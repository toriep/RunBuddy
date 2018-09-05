
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
    
}

/***************************************************************************************************
* addClickHandlerstoElements
* @params {undefined} 
* @returns  {undefined}
*     
*/
function addClickHandlersToElements(){
    
}

/***************************************************************************************************
 * displayMapToDom - display map based on the the location (based on zip code or city user inputs)
 * @param: location
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
function renderAvailableLocationsForRunningOnDom ( location ) {

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
function renderWeatherOnDom ( location ) {

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

function getDataFromYelp() {

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
    return meetUpResponse;
}

function getDataFromWeather(zipCode) {
    var SGT_API = {
        url: `http://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&APPID=9538ca63e1e6a5306d06af4048ad137f`,
        success: displaySuccess,
        method: 'post',
        dataType: 'json',
        error: displayError,
    }
    $.ajax(SGT_API);
}

function displaySuccess(response) {
    response = response;
    return response;
}

function displayError() {
    console.log("AJAX call failed :(")
}