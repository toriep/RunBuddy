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
function initializeApp(){
    addClickHandlersToElements();
}

/***************************************************************************************************
* addClickHandlerstoElements
* @params {undefined} 
* @returns  {undefined}
*     
*/
function addClickHandlersToElements(){
    // $("#runButton").click(handleRunClicked); 
    $('#runButton').click(renderAvailableLocationsForRunningOnDom);

}

function handleRunClicked() {
    var zipCode = $("#search_input").val();
    getDataFromWeather(zipCode);
}
/***************************************************************************************************
 * displayMapToDom - display map based on the the location (based on zip code or city user inputs)
 * @param: location //an array of objects
 * @returns: none
 * @calls: none
 */
function displayMapOnDom ( location ) {

}

/***************************************************************************************************
 * renderyDirection - display direction based on the the pick
 * @param: pick
 * @returns: none
 * @calls: none
 */
function renderDirectionOnDom ( pick ) {

}

/***************************************************************************************************
 * renderAvailableLocationsForRunningToDom - display available locations for running based on yelp database
 * @param: location
 * @returns: none
 * @calls: none
 */
function renderAvailableLocationsForRunningOnDom () {
    console.log('testing');
    let userLocation = $('#search_input').val();
    var ajaxParameters = {
        dataType: 'JSON',
        url: "http://yelp.ongandy.com/businesses",
        method: 'POST',
        data: {
            api_key:'u7VrqD4pyVGW_uBAod5CCKlJiM4pTyFGYzKyYWXV8YHidu5BsdPN20PhYEJflT-vOhZ7mFXHpHCIeyKTA-0xZ9LJcCg_jDK-B3WvRCmYvU1DdCXioFo8mTSIhRmPW3Yx',
            term: 'running trail park',
            location: userLocation,
        },
        success: getDataFromYelp,
        error: function (response) {
            console.log('error');
        }
    }
    $.ajax(ajaxParameters)
}

/***************************************************************************************************
 * renderLocationPicturesToDom - display pictures of the location
 * @param: location
 * @returns: none
 * @calls: none
 */
function renderLocationPicturesOnDom ( location ) {

}

/***************************************************************************************************
 * renderyWeatherToDom - display weather based on the location
 * @param: location
 * @returns: none
 * @calls: none
 */
function renderWeatherOnDom ( weather ) {
    $('.weather_container #condition').text('Weather condition: '+weather.condition);
    $('.weather_container #condition').text('Current temp: '+weather.currentTempInF);

}

/***************************************************************************************************
 * renderCrimeDataToDom - display crime data based on the location to show how safe 
 * it is to go running in the location
 * @param: location
 * @returns: none
 * @calls: none
 */
function renderCrimeDataOnDom ( location ) {

}


/***************************************************************************************************
 * get data from each server
 * 
 * 
*/
function getDataFromGoogleMap() {

}

function getDataFromYelp(response) {
    var businessesIndex = response.businesses;
    console.log(businessesIndex);

    for ( let i = 0; i < businessesIndex.length; i++) {
        runningTrails.push(
            {
                
            }
        )
    }
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
    let meetUpResponse = response;
    console.log(meetUpResponse)
    return meetUpResponse;
}

function getDataFromWeather(zipCode) {
    let SGT_API = {
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

function displayWeatherSuccess(responseFromServer) {
    let weather = {};
    weather.condition = responseFromServer.weather[0]['main'];
    weather.tempMinInF = ((responseFromServer.main['temp_min'])*0.1 * 9 / 5 + 32).toFixed(1);
    weather.tempMaxInF = ((responseFromServer.main['temp_max'])*0.1 * 9 / 5 + 32).toFixed(1);
    weather.currentTempInF = (((responseFromServer.main['temp'])*0.1) * 9 / 5 + 32).toFixed(1);
    weather.humidity = responseFromServer.main['humidity'];
    weather.wind = responseFromServer.wind['speed'];
    weather.clouds = responseFromServer.clouds['all'];
    renderWeatherOnDom(weather);
}

function displayError() {
    console.log("AJAX call failed :(")
}