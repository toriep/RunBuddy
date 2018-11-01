$(document).ready(initializeApp);

let runningTrails = [];
let zipCode = null;

function initializeApp() {
    addClickHandlersToElements();
}

function addClickHandlersToElements() {
    $('#runButton').click(callGoogleAPI);
    let eventListener = $("#search_input");

    //alert info with what to input in the field
    $('#search_input').focus(function () {
        $('#info_msg').removeClass('hidden');});
    $('#search_input').focusout(function () {
        $('#info_msg').addClass('hidden');});

    eventListener.on("keyup", event => {
        if (event.keyCode === 13) { //if enter key is released
            $("#runButton").click(); //runs the function attaches to click event off add button
        }
    });
}

function callGoogleAPI(){
    let userLocation = $("#search_input").val();
    if (userLocation.length===0) {//if the search bar is empty, get current location
        getDataFromGeolocation();
    } else {//if user typed in a location, make a Geocoding AJAX call
        // ajaxYelpCall(userLocation);
        getLatLongFromGeocoding(userLocation);
    }
}

function getDataFromGeolocation(){
    const location = {
        url: `https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDKqdQXJuUA7X296IGSb3enjdybpgnwfMw`,
        method: 'post',
        dataType: 'json',
        success: reverseGeolocation,
        error: displayError ('GetDataFromGeoLoaction'),
    }
    $.ajax(location);
}

//this function converts lat and long to an address
function reverseGeolocation(response){
    let lat = response.location.lat;
    let lng = response.location.lng;
    const location = {
        url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDKqdQXJuUA7X296IGSb3enjdybpgnwfMw`,
        method: 'post',
        dataType: 'json',
        success: getCurrentLocation,
        error: displayError('reverseGeolocation'),
    }
    $.ajax(location);
}

function extractZipCode(response){
    let currentAddress = response.results[0].formatted_address;
    let indexOfZipCode = currentAddress.lastIndexOf(',');
    zipCode = currentAddress.slice(indexOfZipCode-5, indexOfZipCode);
}

function getCurrentLocation(response){
    extractZipCode(response);
    ajaxYelpCall(zipCode);
}

//this function converts a given address, city, or zip code to lat and long
function getLatLongFromGeocoding(inputAddress){
    const formattedAddress = inputAddress.split(" ").join("+");
    const location = {
        url: `https://maps.googleapis.com/maps/api/geocode/json`,
        method: 'get',
        dataType: 'json',
        data: {
            key: 'AIzaSyDKqdQXJuUA7X296IGSb3enjdybpgnwfMw',
            address: formattedAddress
        },
        success: geocodingResponse,
        error: displayError ('GetDataFromGeocoding'),
    }
    $.ajax(location);
}

//use the lat and long from this function to call trail API
function geocodingResponse(response){
    const latLong = response.results[0].geometry.location;
    const lat = latLong.lat.toFixed(4);
    const lng = latLong.lng.toFixed(4);
    getRunningTrailsList(lat,lng);
}

function getRunningTrailsList(lat, long) {
    const runningTrails = {
        dataType: 'JSON',
        url: `https://www.trailrunproject.com/data/get-trails?lat=${lat}&lon=${long}&maxDistance=10&key=200354719-4f64b16db640b15c131f04f75804eacd`,
        success: response => {
            console.log("Trail Success:", response);
        }
    }
    $.ajax(runningTrails);
}

function ajaxYelpCall(location) {
    let userLocation = location;

    $('.landing_page').addClass('hidden');
    $('.meerkat').removeClass('hidden');
    const ajaxParameters = {
        dataType: 'JSON',
        url: "https://yelp.ongandy.com/businesses",
        method: 'POST',
        data: {
            api_key: 'u7VrqD4pyVGW_uBAod5CCKlJiM4pTyFGYzKyYWXV8YHidu5BsdPN20PhYEJflT-vOhZ7mFXHpHCIeyKTA-0xZ9LJcCg_jDK-B3WvRCmYvU1DdCXioFo8mTSIhRmPW3Yx',
            term: 'running trail park',
            location: userLocation,
        },
        success: getDataFromYelp,
        error: displayError('ajaxYelpCall')
    }
    $.ajax(ajaxParameters);
}

function getDataFromYelp(response) {
    const businessesIndex = response.businesses;
    let {
        latitude,
        longitude
    } = response.region.center;
    let center = new google.maps.LatLng(latitude, longitude);
    runningTrails.push(center);
    for (let i = 1; i < businessesIndex.length; i++) {
        let yelpObject = {};
        let {
            latitude,
            longitude
        } = businessesIndex[i].coordinates;
        let coordinates = new google.maps.LatLng(latitude, longitude);
        let {
            rating,
            distance
        } = businessesIndex[i];
        runningTrails.push({
            name: businessesIndex[i].name,
            location: businessesIndex[i].location,
            coordinates: coordinates,
            image: businessesIndex[i].image_url,
            rating: businessesIndex[i].rating,
            distance: (businessesIndex[i].distance / 1000).toFixed(1) + " miles"
        })
    }
    displayMapOnDom();
    getDataFromWeather(latitude, longitude);
    getDataFromMeetUp(runningTrails[1].location.zip_code);
    $(".weather_list").addClass("hidden");
}


function displayMapOnDom() {
    $(".landing_page").addClass("hidden");
    $(".map_page").removeClass("hidden");
    //Map options
    const options = {
        zoom: 12,
        center: runningTrails[0],
    }
    //New map
    let map = new google.maps.Map(document.getElementById("map_area"), options);
    //Add marker

    for (var trailIndex = 1; trailIndex < runningTrails.length; trailIndex++) {
        let marker = new google.maps.Marker({
            position: runningTrails[trailIndex].coordinates,
            map: map,
            animation: google.maps.Animation.DROP,
            icon: "images/Winged_Shoe.png"
        });
        let contentString = "<h3>" + runningTrails[trailIndex].name + "</h3>";
        let infoWindow = new google.maps.InfoWindow({
            content: contentString
        })

        marker.addListener('click', function () {
            infoWindow.open(map, marker);
            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
            } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
            }
        });
    }
    renderTrailInfoOnDom(runningTrails);
}

function renderTrailInfoOnDom(runningTrailsArray) {
    for (let i = 1; i < runningTrailsArray.length; i++) {
        let listResultsDiv = $('<div>').addClass('list_result');
        let locationPictureDiv = $('<div>');
        let imageOfPlace = $('<img>').attr('src', runningTrailsArray[i].image).addClass('locationPicture');
        locationPictureDiv.append(imageOfPlace);
        let locationDescriptionDiv = $('<div>').addClass('locationDescription');
        let nameOfPlace = $('<p>').text(runningTrailsArray[i].name);
        let addressOfPlace1 = `${runningTrails[i].location.display_address[0]}`;
        let brLine1 = $('<br>');
        let brLine2 = $('<br>');
        let addressOfPlace2 = `${runningTrails[i].location.display_address[1]}`;
        let moreInfoButton = $('<button>').addClass('btn btn-success').text('More Info');
        let addressOfPlace = $('<address>').append(addressOfPlace1, brLine1, addressOfPlace2);

        moreInfoButton.click(() => displayTrailDescription(runningTrailsArray[i]));

        locationDescriptionDiv.append(nameOfPlace, addressOfPlace, brLine2, moreInfoButton);
        listResultsDiv.append(locationPictureDiv, locationDescriptionDiv);
        $('.location_list').append(listResultsDiv);
    }
    $('.meerkat').addClass('hidden');
}

function displayTrailDescription(trail){
    $('.descriptionTab').empty();
    $('.trails_tab').removeClass('hidden');
    $('.single_location_detail').removeClass('hidden');
    $('.list_result').addClass('hidden');
    let descriptionDiv = $('<div>').addClass('description');
    let imageOfPlace = $('<img>').attr('src', trail.image);
    let nameOfPlace = $('<h1>').addClass('trailName').text(trail.name);
    let addressOfPlace = $('<p>').text(`Address: ${trail.location.display_address[0]} ${trail.location.display_address[1]}`);
    let distance = $('<div>').text(`Distance: ${trail.distance}`)
    let rating = $('<div>').text('Rating: ' + trail.rating)
    let pointBCoordinates = trail.coordinates
    descriptionDiv.append(nameOfPlace, imageOfPlace, addressOfPlace, distance, rating);
    $('.descriptionTab').append(descriptionDiv);
    displayDirectionLineOnMap(pointBCoordinates);
    $("html, body").animate({
        scrollTop: 0
    }, "slow"); //scroll window to the top
}

function displayDirectionLineOnMap(pointBCoordinates) {
    $("#map_area").text();
    var pointA = runningTrails[0],
        pointB = pointBCoordinates,
        myOptions = {
            zoom: 14,
            center: pointA
        },
        map = new google.maps.Map(document.getElementById('map_area'), myOptions),
        // Instantiate a directions service.
        directionsService = new google.maps.DirectionsService, //I'm from pointA
        directionsDisplay = new google.maps.DirectionsRenderer({ //find me a direction
            map: map
        }),
        markerA = new google.maps.Marker({
            position: pointA,
            title: "point A",
            label: "A",
            map: map
        }),
        markerB = new google.maps.Marker({
            position: pointB,
            title: "point B",
            label: "B",
            map: map
        });

    // get route from A to B
    calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB);
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
    directionsService.route({
            origin: pointA,
            destination: pointB,
            //travelMode: google.maps.TravelMode.DRIVING
            travelMode: 'DRIVING'
        },
        function (response, status) {
            // if (status == google.maps.DirectionsStatus.OK) {
            if (status == "OK") { //success function
                directionsDisplay.setDirections(response);
                
                var result = document.getElementById('result');
                result.innerHTML = "";
                let newTr1 = document.createElement("tr");
                newTr1.innerHTML = `<b>Start location:</b> ${response.routes[0].legs[0].start_address}<br>`;
                let newTr2 = document.createElement("tr");
                newTr2.innerHTML = `<b>Distance:</b> ${response.routes[0].legs[0].distance.text}.  <b>Duration:</b> ${response.routes[0].legs[0].duration.text}.<br><br>`;
                let newTr4 = document.createElement("tr");
                newTr4.innerHTML = `<b>Destination:</b> ${response.routes[0].legs[0].end_address}<br><br>`;
                result.appendChild(newTr1);
                result.appendChild(newTr2);
                result.appendChild(newTr4);
                for (var i = 0; i < response.routes[0].legs[0].steps.length; i++) {
                    let newTr3 = document.createElement("tr"); //new table row
                    //let td1 = document.createElement("td");
                    //td1.innerHTML = response.routes[0].legs[0].steps[i].maneuver;
                    let td2 = document.createElement("td");
                    td2.innerHTML = `${i+1}. ${response.routes[0].legs[0].steps[i].instructions}`;
                    let td3 = document.createElement("td");
                    td3.innerHTML = `  ${response.routes[0].legs[0].steps[i].distance.text}`;
                    //newTr3.appendChild(td1);
                    newTr3.appendChild(td2);
                    newTr3.appendChild(td3);
                    result.appendChild(newTr3);
                } 
                

            } else { //error function
                console.log('Directions request failed due to ' + status);
            }
        }
    );
}

function activatePlacesSearch() {
    let input = document.getElementById('search_input');
    let autocomplete = new google.maps.places.Autocomplete(input);
}

function getDataFromWeather(lat, lon) {
    const weather = {
        url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=9538ca63e1e6a5306d06af4048ad137f`,
        method: 'post',
        dataType: 'json',
        success: displayWeatherSuccess,
        error: displayError('getDataFromWeather'),
    }
    $.ajax(weather);
}

function displayWeatherSuccess(responseFromServer) {
    var weather = {
        condition: responseFromServer.weather[0]['main'],
        cityName: responseFromServer.name,
        conditionDescription: responseFromServer.weather[0]['description'],
        iconId: responseFromServer.weather[0]['icon'],
        //convert temperature in Kelvin to Fahrenheit
        tempMinInF: (responseFromServer.main['temp_min'] * 9 / 5 - 459.67).toFixed(1),
        tempMaxInF: (responseFromServer.main['temp_max'] * 9 / 5 - 459.67).toFixed(1),
        currentTempInF: (responseFromServer.main['temp'] * 9 / 5 - 459.67).toFixed(1),
        sunriseTime: (responseFromServer.sys['sunrise']),
        sunsetTime: (responseFromServer.sys['sunset']),
        humidity: responseFromServer.main['humidity'],
        wind: responseFromServer.wind['speed']
    };
    renderWeatherOnDom(weather);
}

function renderWeatherOnDom(weather) {
    let imgSrc =   `http://openweathermap.org/img/w/${weather.iconId}.png`;
    let weatherImage = $('<img class="weather_icon">').attr({
        "src": imgSrc,
        "alt": weather.condition
    });
    let today = new Date();
    let dateToday = today.toDateString();
    let timeNow = today.toLocaleTimeString();
    let headline = $('<p>').append(`${weather.cityName}`);
    let line0 = $('<li>').append(weatherImage, (weather.conditionDescription).toUpperCase());
    let line1 = $('<li>').append(`${dateToday} ${timeNow}`);
    let line2 = $('<li>').append(`Current temperature: ${weather.currentTempInF} °F `);
    let line3 = $('<li>').append(`High: ${weather.tempMaxInF} °F / Low: ${weather.tempMinInF} °F `);
    let line4 = $('<li>').append(`Humidity: ${weather.humidity} %`);
    let line5 = $('<li>').append(`Wind: ${weather.wind} m/s`);

    let weatherList =  $('<ul>').addClass('weather_list hidden');
    weatherList.append(headline, line0, line1, line2, line3, line4, line5);
    $('.location_list').append(weatherList);
}

function getDataFromMeetUp(zipCode) {
    let MeetUpZipCode = zipCode;
    let meetup = {
        url: `https://api.meetup.com/2/open_events?&sign=true&photo-host=public&zip=${MeetUpZipCode}&topic=running&page=20&key=647a3e362fa1b49424a3566149136e`,
        success: displayMeetUpSuccess,
        method: 'post',
        dataType: 'jsonp',
        error: displayError ('getDataFromMeetUp'),
    }
    $.ajax(meetup);
}

function displayMeetUpSuccess(response) {
    if(response.meta.count===0){
        let meetupDiv = $('<div>',{
            class:`events hidden`,
            html: '<h2>Currently, there are no upcoming meetups near your area.'
        });
        $('.location_list').append(meetupDiv);
    }
    let meetUpResponse = response.results;
    let filteredMeetUpResults = [];
    for (let m = 0; m < meetUpResponse.length; m++) {
        let {
            description,
            name,
            event_url,
            time,
            group,
            yes_rsvp_count
        } = meetUpResponse[m];
        let formattedInfo = {
            description,
            eventName: name,
            link: event_url,
            time,
            group,
            yes_rsvp_count
        }
        formattedInfo.time = Date(parseInt(formattedInfo.time))
        filteredMeetUpResults.push(formattedInfo);
    }
    renderMeetUpOnDom(filteredMeetUpResults)
}

function displayError( sub ) {
    // console.log(`${sub} AJAX call failed.`);
}

function renderMeetUpOnDom(meetup) {
    for (let m = 0; m < meetup.length; m++) {
        let groupName = $('<p>', {
            class: 'groupName',
            text: meetup[m].group.name.toUpperCase()
        })
        let members = $('<div>', {
            class: 'rsvp',
            text: `${meetup[m].yes_rsvp_count} ${meetup[m].group.who} going`
        })
        let eventName = $('<a>', {
            class: 'rsvp',
            text: meetup[m].eventName,
            href: meetup[m].link
        })
        let meetUp = $('.location_list');
        let meetupDiv = $('<div>').addClass(`meetUp+${m} events hidden`);
        meetupDiv = $(meetupDiv).append(groupName, eventName, members)
        $(meetUp).append(meetupDiv)
    }
}

function displayWeather() {
    $('#result').addClass('hidden');
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
    $('#result').addClass('hidden');
    $('.list_result').addClass('hidden');
    $('.events').addClass('hidden');
    $('.weather_list').addClass('hidden');
    $('.description').removeClass('hidden');
    $('.weather_tab').removeClass('currentTab');
    $('.meetup_tab').removeClass('currentTab');
    $('.direction_tab').removeClass('currentTab');
    $('.trails_tab').removeClass('currentTab');
    $('.description_tab').addClass('currentTab');
}

function displayResult() {
    $('#result').addClass('hidden');
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
    $('#result').addClass('hidden');
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
    $('#result').removeClass('hidden');
    $('.description_tab').removeClass('currentTab');
    $('.meetup_tab').removeClass('currentTab');
    $('.weather_tab').removeClass('currentTab');
    $('.trails_tab').removeClass('currentTab');
    $('.direction_tab').addClass('currentTab');
}
