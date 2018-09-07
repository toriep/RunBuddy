/**
 * Listen for the document to load and initialize the application
 */
$(document).ready(initializeApp);
const runningTrails = [];
/***************************************************************************************************
 * initializeApp 
 * @params {undefined} none
 * @returns: {undefined} none
 * initializes the application
 */
function initializeApp() {
    addClickHandlersToElements();
}
/***************************************************************************************************

 * addClickHandlerstoElements
 * @params {undefined} 
 * @returns  {undefined}
 *     
 */
function addClickHandlersToElements() {
    $('#runButton').click(ajaxYelpCall);
    $('#runButton').click(getDataFromMeetUp);
    let eventListener = $("#search_input");
    eventListener.on("keyup", event => {
        if (event.keyCode === 13) { //if enter key is released
            $("#runButton").click(); //runs the function attaches to click event off add button
        }
    });
}

function checkIfInputZipIsValid(zip) {
    var valid = true;
    if (zip.length != 5 || isNaN(zip)) {
        $('#error_msg').removeClass('hidden');
        valid = false;
    }
    return valid;
}
/***************************************************************************************************
 * displayMapToDom - display map based on the the location (based on zip code or city user inputs)
 * @param: location //an array of objects
 * @returns: none
 * @calls: none
 */
function displayMapOnDom() {
    $(".landing_page").addClass("hidden");
    $(".map_page").removeClass("hidden");
    //Map options
    const options = {
        zoom: 10,
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
                icon: "images/Winged_Shoe.png",

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
    renderInformationOnDom(runningTrails);
}

/***************************************************************************************************
 * ajaxYelpCall - display available locations for running based on yelp database
 * @param: location
 * @returns: none
 * @calls: none
 */
function ajaxYelpCall () {
    let userLocation = $("#search_input").val();
    $('#search_input').focus(function () {
        $('#error_msg').addClass('hidden');
    });

    if (checkIfInputZipIsValid(userLocation)) {
        getDataFromWeather(userLocation);
    } else {
        $("#search_input").val('');
        ajaxYelpCall();
    }
    $('#error_msg').text('');
    $('.landing_page').addClass('hidden')
    $('.meerkat').removeClass('hidden')
    const ajaxParameters = {
        dataType: 'JSON',
        url: "http://yelp.ongandy.com/businesses",
        method: 'POST',
        data: {
            api_key: 'u7VrqD4pyVGW_uBAod5CCKlJiM4pTyFGYzKyYWXV8YHidu5BsdPN20PhYEJflT-vOhZ7mFXHpHCIeyKTA-0xZ9LJcCg_jDK-B3WvRCmYvU1DdCXioFo8mTSIhRmPW3Yx',
            term: 'running trail park',
            location: userLocation,
        },
        success: getDataFromYelp,
        error: function (response) {
            console.log('error');
        }
    }
    $.ajax(ajaxParameters);
}

/***************************************************************************************************
 * renderyWeatherToDom - display weather based on the location
 * @param: location
 * @returns: none
 * @calls: none
 */
function renderWeatherOnDom ( weather ) {
    let imgSrc = getImgForWeather (weather);
    let weatherImage = $('<img class="weather_icon">').attr({"src":imgSrc, "alt":imgSrc});
    let today = new Date();
    let hrs = today.getHours();
    let dayOrNight;
    if (hrs > 19 || hrs < 6) {//it's night time
        dayOrNight = 'images/nightTime.jpg';
        dayOrNightColor = 'white';
    } else {//it's day time
        dayOrNight = 'images/dayTime.jpg';
        dayOrNightColor = 'white';
    }    
    let headline = $('<p>').append(`${weather.cityName}`);
    let line0 = $('<li>').append(weather.conditionDescription.toUpperCase());
    let line1 = $('<li>').append(today);
    let line2 = $('<li>').append(`Current temperature: ${weather.currentTempInF} °F `);
    let line3 = $('<li>').append(`High: ${weather.tempMaxInF} °F / Low: ${weather.tempMinInF} °F `);
    let line4 = $('<li>').append(`Humidity: ${weather.humidity} %`);
    let line5 = $('<li>').append(`Wind: ${weather.wind} m/s`);

    let weatherList = $('<ul class="weather_list hidden">').css({"background-image": dayOrNight, "color":dayOrNightColor});
    weatherList.append(weatherImage, headline, line0, line1, line2, line3, line4, line5);
    // $('.weather_display').append(line0, line1, line2, line3);
    $('.location_list').append(weatherList);
}

function displayWeather() {
    $('.list_result').addClass('hidden');
    $('.events').addClass('hidden');
    $('.description').addClass('hidden');
    $('.weather_list').removeClass('hidden');
}

function displayDescription() {
    $('.list_result').addClass('hidden');
    $('.events').addClass('hidden');
    $('.weather_list').addClass('hidden');
    $('.description').removeClass('hidden');
}

function displayResult() {
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
}

function displayDirection() {
    $('.description').addClass('hidden');
    $('.list_result').addClass('hidden');
    $('.weather_list').addClass('hidden');
    $('.events').addClass('hidden');
}

function getImgForWeather(weather) {
    var imgSrc;
    switch (weather.condition) {
        case 'Haze':
            imgSrc = 'images/haze.png';
            break;
        case 'Clouds':
            imgSrc = 'images/clouds.png';
            break;
        case 'few clouds':
            imgSrc = 'images/clouds.png';
            break;    
        case 'Sunny':
            imgSrc = 'images/sunny.png';
            break;
        case 'Clear':
            imgSrc = 'images/clear.png';
            break;
        case 'Rain':
            imgSrc = 'images/rain.png';
            break;    
        default:
            imgSrc = 'images/default.png';             
    }
    return imgSrc;
}

function getDataFromYelp(response) {
    $('.meerkat').addClass('hidden');
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
}

function getDataFromMeetUp() {
    let zipCode = $("#search_input").val();
    let meetup = {
        url: `https://api.meetup.com/2/open_events?&sign=true&photo-host=public&zip=${zipCode}&topic=running&page=20&key=647a3e362fa1b49424a3566149136e`,
        success: displayMeetUpSuccess,
        method: 'post',
        dataType: 'jsonp',
        error: displayError,
    }
    $.ajax(meetup);
}


function displayMeetUpSuccess(response) {
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

function getDataFromWeather(zipCode) {
    const SGT_API = {
        url: `http://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&APPID=9538ca63e1e6a5306d06af4048ad137f`,
        method: 'post',
        dataType: 'json',
        success: displayWeatherSuccess,
        error: displayError,
    }
    $.ajax(SGT_API);
}

function displaySuccess(response) {
    response = response;
    return response;
}

function displayWeatherSuccess(responseFromServer) {
    let weather = {};
    weather.condition = responseFromServer.weather[0]['main'];
    weather.cityName = responseFromServer.name;
    weather.conditionDescription = responseFromServer.weather[0]['description']; 
    weather.tempMinInF = (responseFromServer.main['temp_min'] * 9 / 5 - 459.67).toFixed(1);
    weather.tempMaxInF = (responseFromServer.main['temp_max'] * 9 / 5 - 459.67).toFixed(1);
    weather.currentTempInF = (responseFromServer.main['temp'] * 9 / 5 - 459.67).toFixed(1);
    weather.humidity = responseFromServer.main['humidity'];
    weather.wind = responseFromServer.wind['speed'];
    renderWeatherOnDom(weather);
}

function displayError() {
    console.log("AJAX call failed :(")
}

function renderInformationOnDom(runningTrailsArray) {
    
    for ( let i = 1; i < runningTrailsArray.length; i++) {
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

        moreInfoButton.click(()=>{
            $('.descriptionTab').empty();
            $('.results').removeClass('hidden');
            $('.single_location_detail').removeClass('hidden');
            $('.list_result').addClass('hidden');
            let descriptionDiv = $('<div>').addClass('description');
            let imageOfPlace = $('<img>').attr('src', runningTrailsArray[i].image);
            let nameOfPlace = $('<h3>').text(runningTrailsArray[i].name);
            let addressOfPlace = $('<p>').text(`Address: ${runningTrails[i].location.display_address[0]} ${runningTrails[i].location.display_address[1]}`);
            let distance = $('<div>').text(`Distance: ${runningTrails[i].distance}`)
            let rating = $('<div>').text('Rating: ' + runningTrails[i].rating)
            let pointBCoordinates = runningTrails[i].coordinates
            descriptionDiv.append(nameOfPlace,imageOfPlace,addressOfPlace,distance,rating);
            $('.descriptionTab').append(descriptionDiv);
            displayDirectionLineOnMap(pointBCoordinates);
        })
        locationDescriptionDiv.append(nameOfPlace, addressOfPlace, brLine2, moreInfoButton);
        listResultsDiv.append(locationPictureDiv, locationDescriptionDiv);
        $('.location_list').append(listResultsDiv);
    }
}

function displayDirectionLineOnMap(pointBCoordinates) {
    $("#map_area").text();
    var pointA = runningTrails[0],
        pointB = pointBCoordinates, 
        myOptions = {
            zoom: 7,
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
                result.innerHTML= "";
                for (var i =0; i < response.routes[0].legs[0].steps.length; i++){
                    result.innerHTML+=response.routes[0].legs[0].steps[i].instructions+"<br>"
                }
            } else { //error function
                console.log('Directions request failed due to ' + status);
            }
        });
}

function activatePlacesSearch() {
    let input = document.getElementById('search_input');
    let autocomplete = new google.maps.places.Autocomplete(input);
}

function renderMeetUpOnDom(meetup){
    for(let m=0; m<meetup.length;m++){
        let groupName = $('<h4>',{
            class: 'groupName',
            text: meetup[m].group.name.toUpperCase()})
        let members = $('<div>',{
            class: 'rsvp',
            text: `${meetup[m].yes_rsvp_count} ${meetup[m].group.who} going`})
        let eventName = $('<a>',{
            class: 'rsvp',
            text: meetup[m].eventName,
            href: meetup[m].link})
        let meetUp = $('.location_list');
        let meetupDiv = $('<div>').addClass(`meetUp+${m} events hidden`);
        meetupDiv = $(meetupDiv).append(groupName,eventName,members)
        $(meetUp).append(meetupDiv)
    }
}
