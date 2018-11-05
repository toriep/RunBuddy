$(document).ready(initializeApp);

let runningTrails = [];
let currentLocation = null;
let inputFromUser = null;
let userInput = null;
let markersOnMap = [];
let map = {};

function initializeApp() {
    addClickHandlersToElements();
}

function addClickHandlersToElements() {
    $('#runButton, .search_button').click(callGoogleAPI);
    //alert info with what to input in the field
    $('#search_input').focus(function () {
        $('#info_msg').removeClass('hidden');
    });
    $('#search_input').keypress(function () {
        $('#info_msg').addClass('hidden');
    });
    $("#search_input, #search_field").on("keyup", event => {
        if (event.keyCode === 13) { //if enter key is released
            $("#runButton, .search_button").click(callGoogleAPI()); //runs the function attaches to click event off add button
        }
    });
    $('.location_list').on('click', '.list_result', notifyTrailClicked);
    $('.location_list').on('mouseleave', '.list_result', resetNotifyTrailClicked);
    /** displaying tabs */
    $('.trails_tab').click(displayResult);
    $('.description_tab').click(displayDescription);
    $('.direction_tab').click(displayDirection);
    $('.weather_tab').click(displayWeather);
    $('.meetup_tab').click(displayMeetUp);
}

function callGoogleAPI() {
    inputFromUser = $("#search_input").val() || $("#search_field").val();
    userInput = $("#search_input").val();
    $("#search_input").val("");
    if (inputFromUser.length === 0) {//if the search bar is empty, get current location
        getDataFromGeolocation();
    } else {//if user typed in a location, make a Geocoding AJAX call
        getLatLongFromGeocoding(inputFromUser);
        getCurrentLocationForDirection();
    }
}

function responseFromGeolocation(response) {
    runningTrails = [];
    markersOnMap = [];
    let lat = response.location.lat;
    let lng = response.location.lng;
    let center = new google.maps.LatLng(lat, lng);
    runningTrails.push(center);
    getresponseFromTrailsList(lat, lng);
    getDataFromWeather(lat, lng);
    getWeatherForecast(lat, lng);
    getDataFromMeetUp(lat, lng);
}

function alertMsgAndRefresh() {
    $('.landing_page').addClass('hidden');
    $('.loadingImg').removeClass('hidden');
    setTimeout(() => {
        alert('Invalid Location. Please try again.');
    }, 200);

    setTimeout(() => {
        window.history.back();
        location.reload();
    }, 200);
}

//use the lat and long from this function to call trail API
function geocodingResponse(response) {
    if (response.status === "ZERO_RESULTS") {
        alertMsgAndRefresh();
    }
    runningTrails = [];
    markersOnMap = [];
    const latLong = response.results[0].geometry.location;
    const lat = latLong.lat.toFixed(4);
    const lng = latLong.lng.toFixed(4);
    let center = new google.maps.LatLng(lat, lng);
    runningTrails.push(center);
    getDataFromTrailsList(lat, lng);
    getDataFromWeather(lat, lng);
    getWeatherForecast(lat, lng);
    getDataFromMeetUp(lat, lng);
}

function responseFromTrailsList(response) {
    if (response.trails.length === 0) {
        $(".location_list").empty();
        $(".map_page").removeClass("hidden");
        $(".landing_page, .map_area, .loadingImg").addClass('hidden');
        let noResult = $('<div>').addClass('no-result').text(`Your search did not match any trail results. Please try a different location.`)
        $('.location_list').append(noResult);
        return;
    }
    $('.nav_tabs').addClass('hidden');
    const { trails } = response;
    trails.map((trail) => {
        const { latitude, longitude } = trail;
        let coordinates = new google.maps.LatLng(latitude, longitude);
        if (trail.imgSqSmall) {//only include results with an image since not all results have one
            runningTrails.push({
                image: trail.imgMedium,
                distance: `${trail.length} miles`,
                ...trail,
                coordinates: coordinates
            });
        }
    });
    displayMapOnDom();
    // displaySearchResultMessage();
}

function displayError(sub) {
    // console.log(`${sub} AJAX call failed.`);
}

// const direction_tab = $('#direction_tab');
// const list_result = $('.list_result');
// const events = $('.events');
// const description = $('.description');
// const weather_list = $('.weather_list');
// const description_tab = $('.description_tab');
// const meetup_tab = $('.meetup_tab');
// const results = $('.results');
// const weather_tab = $('.weather_tab');
// const trails_tab = $('.trails_tab');

function displayWeather() {
    $('#direction_tab').addClass('hidden');
    $('.list_result').addClass('hidden');
    $('.events').addClass('hidden');
    $('.description').addClass('hidden');
    $('.weather_list').removeClass('hidden');
    $('.description_tab').removeClass('currentTab');
    $('.meetup_tab').removeClass('currentTab');
    $('.direction_tab').removeClass('currentTab');
    $('.results').removeClass('currentTab');
    $('.weather_tab').addClass('currentTab');
}

function displayDescription() {
    $('#direction_tab, .events, .weather_list').addClass('hidden');
    $('.events').addClass('hidden');
    $('.weather_list').addClass('hidden');
    $('.nav_tabs').removeClass('hidden');
    $('.description').removeClass('hidden');
    $('.weather_tab').removeClass('currentTab');
    $('.meetup_tab').removeClass('currentTab');
    $('.direction_tab').removeClass('currentTab');
    $('.trails_tab').removeClass('currentTab');
    $('.description_tab').addClass('currentTab');
}

function displayResult() {
    $('.nav_tabs').addClass('hidden');
    $('#direction_tab').addClass('hidden');
    $('.events').addClass('hidden');
    $('.weather_list').addClass('hidden');
    $('.description').addClass('hidden');
    $('.list_result').removeClass('hidden');
    $('#map_area').text();
    $('.single_location_detail').addClass('hidden');
    displayMapOnDom();
}

function displayMeetUp() {
    $('.description').addClass('hidden');
    $('.list_result').addClass('hidden');
    $('.weather_list').addClass('hidden');
    $('.events').removeClass('hidden');
    $('#direction_tab').addClass('hidden');
    $('.description_tab').removeClass('currentTab');
    $('.weather_tab').removeClass('currentTab');
    $('.direction_tab').removeClass('currentTab');
    $('.trails_tab').removeClass('currentTab');
    $('.meetup_tab').addClass('currentTab');
}

function displayDirection() {
    $('.description').addClass('hidden');
    $('.list_result').addClass('hidden');
    $('.weather_list').addClass('hidden');
    $('.events').addClass('hidden');
    $('#direction_tab').removeClass('hidden');
    $('.description_tab').removeClass('currentTab');
    $('.meetup_tab').removeClass('currentTab');
    $('.weather_tab').removeClass('currentTab');
    $('.trails_tab').removeClass('currentTab');
    $('.direction_tab').addClass('currentTab');
}

function notifyTrailClicked(event) {
    const data = $(event.currentTarget).data('coordinates');
    for (let i = 0; i < markersOnMap.length; i++) {
        if (markersOnMap[i].position.lat === data.lat && markersOnMap[i].position.lng === data.lng) {
            markersOnMap[i].infoWindow.open(map, markersOnMap[i]);
            markersOnMap[i].setAnimation(google.maps.Animation.BOUNCE);
        }
    }
}

function resetNotifyTrailClicked(event) {
    const data = $(event.currentTarget).data('coordinates');
    for (let i = 0; i < markersOnMap.length; i++) {
        if (markersOnMap[i].position.lat === data.lat && markersOnMap[i].position.lng === data.lng) {
            markersOnMap[i].infoWindow.close(map, markersOnMap[i]);
            markersOnMap[i].setAnimation(null);
        }
    }
}