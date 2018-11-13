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
    $('#runButton, #glass_button, .search_button').click(callGoogleAPI);
    //alert info with what to input in the field
    $('#search_input').focus(function () {
        if(!$('#search_input').val()){
            $('.invalid').addClass('hidden');
            $('#info_msg').removeClass('hidden');
        }
    });
    $('#search_input').keypress(function () {
        $('#info_msg').addClass('hidden');
    });
    $("#search_input").on("keyup", event => {
        if (event.keyCode === 13) {
            event.preventDefault();
            $("#runButton").click(callGoogleAPI());
        }
    });
    $("#search_field").on("keyup", event => {
        if (event.keyCode === 13) { //if enter key is released
            event.preventDefault();
            $(".search_button").click(callGoogleAPI(event)); //runs the function attaches to click event off add button
        }
    });
    $('.results_list').on('click', '.list_result', notifyTrailClicked);
    $('.results_list').on('mouseleave', '.list_result', resetNotifyTrailClicked);
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
    // $('.landing_page').addClass('hidden');
    // $('.loading').removeClass('hidden');
    // setTimeout(() => {
    //     alert('Invalid Location. Please try again.');
    // }, 200);

    // setTimeout(() => {
    //     window.history.back();
    //     location.reload();
    // }, 200);
    $('.invalid').removeClass('hidden');
    (function (){
        var modal = document.getElementById('invalid-modal')
        var span = document.getElementsByClassName("close")[0];
        modal.style.display = "block";//display modal
        span.onclick = function() {//exit modal when click on x
              modal.style.display = "none";
        }
        window.onclick = function(event) {//exit modal when click anywhere outside of modal
              if (event.target == modal) {
                  modal.style.display = "none";
              }
        }  
    }())
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
        $(".results_list").empty();
        $(".map_page").removeClass("hidden");
        $(".landing_page, .map_area, .loading").addClass('hidden');
        let noResult = $('<div>').addClass('no-result').text(`Your search did not match any trail results. Please try a different location.`)
        $('.results_list').append(noResult);
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
    // displayMapOnDom();
    displayResult();
}

function displayError(error) {
    console.log(`Error: ${error}`);
}

// const direction_tab = $('#direction_container');
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
    if($('.description_tab').hasClass('currentTab') || $('#direction_container').hasClass('currentTab')){
        displayMapOnDom()
    }
    $('#direction_container, .results_list, .events, .description, .message_container').addClass('hidden');
    $('.weather_container').removeClass('hidden');
    $('.description_tab, .meetup_tab, .direction_tab, .trails_tab').removeClass('currentTab');
    $('.weather_tab').addClass('currentTab');
}

function displayDescription() {
    $('.detail_container').removeClass('hidden');
    $('#direction_container, .events, .weather_container, .message_container').addClass('hidden');
    $('.nav_tabs, .description').removeClass('hidden');
    $('.weather_tab, .meetup_tab, .direction_tab, .trails_tab').removeClass('currentTab');
    $('.description_tab').addClass('currentTab');
}

function displayResult() {
    if ($('.container_tabs').hasClass('zIndex')) {
        $('.container_tabs').removeClass('zIndex')
    }
    if (!$('.results_list').hasClass('zIndex')) {
        $('.results_list').addClass('zIndex')
    }
    $('.detail_container').addClass('hidden');
    $('.results_list').removeClass('hidden');
    $('.trails_tab').addClass('currentTab');
    $('#map_area').text();
    if($('.weather_tab').hasClass('currentTab') || $('.meetup_tab').hasClass('currentTab')){
        $('.weather_tab, .meetup_tab').removeClass('currentTab');
        return;
    }
    $('.weather_tab, .meetup_tab').removeClass('currentTab');
    displayMapOnDom();
}

function displayMeetUp() {
    if($('.description_tab').hasClass('currentTab') || $('#direction_container').hasClass('currentTab')){
        displayMapOnDom()
    }
    $('.events, .message_container').removeClass('hidden');
    $('.description, .results_list, .weather_container, #direction_container').addClass('hidden');
    $('.description_tab, .weather_tab, .direction_tab, .trails_tab').removeClass('currentTab');
    $('.meetup_tab').addClass('currentTab');
}

function displayDirection() {
    $('.description, .results_list, .weather_container, .events, .message_container').addClass('hidden');
    $('#direction_container').removeClass('hidden');
    $('.description_tab, .meetup_tab, .weather_tab, .trails_tab').removeClass('currentTab');
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

function goBackToLandingPage(){
    $(".map_page, .map_area").addClass("hidden");
    $(".landing_page").removeClass("hidden");
    $('.meetup_container').empty();
}
