const runningTrails = [];

/**
 * Listen for the document to load and initialize the application
 */
$(document).ready(initializeApp);

/**
 * global variables here if any 
 */

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
    // $('#runButton').click(redirectRunButton);

}



function checkIfInputZipIsValid (zip) {
    var valid = true;
    if (zip.length!=5 || isNaN(zip)) {
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
            animation: setTimeout(function(){google.maps.Animation.DROP},500),
            icon: "images/Winged_Shoe.png"
        });
        let infoWindow = new google.maps.InfoWindow({
            content: `<h3>${runningTrails[trailIndex].name}</h3>`
        })

        marker.addListener('click', function () {
            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
            } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
            }
        });
    }
}

/***************************************************************************************************
 * renderyDirection - display direction based on the the pick
 * @param: pick
 * @returns: none
 * @calls: none
 */
function renderDirectionOnDom(pick) {

}

/***************************************************************************************************
 * ajaxYelpCall - display available locations for running based on yelp database
 * @param: location
 * @returns: none
 * @calls: none
 */

function ajaxYelpCall () {
    let userLocation = $("#search_input").val();
    $('#search_input').focus( function() {
        $('#error_msg').addClass('hidden');
    });    

    if (checkIfInputZipIsValid(userLocation)) {
        getDataFromWeather(userLocation);
    } else {
        $("#search_input").val('');
        ajaxYelpCall();
    } 
    $('#error_msg').text('');

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
 * renderLocationPicturesToDom - display pictures of the location
 * @param: location
 * @returns: none
 * @calls: none
 */

function renderLocationPicturesOnDom ( runningTrailsArray ) {


}

/***************************************************************************************************
 * renderyWeatherToDom - display weather based on the location
 * @param: location
 * @returns: none
 * @calls: none
 */

function renderWeatherOnDom ( weather ) {
    var imgSrc = getImgForWeather (weather);
    var weatherDisplay = `Current temp: ${weather.currentTempInF} °F `;
    $('.weather_container #condition').text(weatherDisplay);


}

function getImgForWeather (weather) {
    var imgSrc;
    switch (weather.condition)  {
        case 'Haze':
            imgSrc = '.images/haze.img';
            break;
        case 'Clouds':
            imgSrc = '.images/clouds.img';
            break;
        case 'Sunny':
            imgSrc = '.images/sunny.img';
            break;
        default:
            imgSrc = '.images/default.img';             
    }

}

/***************************************************************************************************
 * get data from each server
 * 
 * 
 */
function getDataFromGoogleMap() {

}

function getDataFromYelp(response) {
    const businessesIndex = response.businesses;
    // let center = response.region.center;
    let {
        latitude,
        longitude
    } = response.region.center;
    let center = new google.maps.LatLng(latitude, longitude);
    runningTrails.push(center);
    console.log(businessesIndex);
    for (let i = 1; i < businessesIndex.length; i++) {
        let {
            latitude,
            longitude
        } = businessesIndex[i].coordinates;
        let coordinates = new google.maps.LatLng(latitude, longitude);
        runningTrails.push({
            name: businessesIndex[i].name,
            location: businessesIndex[i].location,
            coordinates: coordinates,
            image: businessesIndex[i].image_url,
        })
    }
    // console.log(runningTrails);
    displayMapOnDom();
}

function getDataFromMeetUp(zipCode) {
    let SGT_API = {
        url: `https://api.meetup.com/2/open_events?&sign=true&photo-host=public&zip=${zipCode}&topic=running&page=20&key=647a3e362fa1b49424a3566149136e`,
        success: displayMeetUpSuccess,
        method: 'post',
        dataType: 'jsonp',
        error: displayError,
    }
    $.ajax(SGT_API);
}

function displayMeetUpSuccess(response){
    let meetUpResponse = response.results;
    let filteredMeetUpResults = [];
    for ( let m = 0; m < meetUpResponse.length; m++) {
        let formattedMeetUp = {};
        if(meetUpResponse[m].venue){
            let {address_1, city, state, zip, lat, lon} = meetUpResponse[m].venue;
            let formattedAddress = {address: address_1,city,state,zip,lat,lon
            } 
            formattedMeetUp.address = formattedAddress;
        }
        let {description,name,event_url, time,} = meetUpResponse[m];
        let formattedInfo = {description,eventName: name,link: event_url,time,}
        formattedInfo.time = Date(parseInt(formattedInfo.time))
        formattedMeetUp.info = formattedInfo;
        filteredMeetUpResults.push(formattedMeetUp);
    }
       console.log(filteredMeetUpResults)
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
    weather.tempMinInF = ((responseFromServer.main['temp_min']) * 0.1 * 9 / 5 + 32).toFixed(1);
    weather.tempMaxInF = ((responseFromServer.main['temp_max']) * 0.1 * 9 / 5 + 32).toFixed(1);
    weather.currentTempInF = (((responseFromServer.main['temp']) * 0.1) * 9 / 5 + 32).toFixed(1);
    weather.humidity = responseFromServer.main['humidity'];
    weather.wind = responseFromServer.wind['speed'];
    weather.clouds = responseFromServer.clouds['all'];
    renderWeatherOnDom(weather);
}

function displayError() {
    console.log("AJAX call failed :(")
}

// function redirectRunButton() {
//     window.location.href = 'location_list.html';
//     return false;
// }