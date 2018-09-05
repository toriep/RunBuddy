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
    $("#runButton").click(handleRunClicked); 
}
function handleRunClicked() {
    var zipCode = $("#search_input").val();
    getDataFromWeather(zipCode);
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
function renderAvailableLocationsForRunningOnDom () {
    let userLocation = $('#search_input').val();
    const ajaxParameters = {
        url: "http://yelp.ongandy.com/businesses",
        method: 'POST',
        data: {
            api_key:'u7VrqD4pyVGW_uBAod5CCKlJiM4pTyFGYzKyYWXV8YHidu5BsdPN20PhYEJflT-vOhZ7mFXHpHCIeyKTA-0xZ9LJcCg_jDK-B3WvRCmYvU1DdCXioFo8mTSIhRmPW3Yx',
            term: 'running trail park',
            location: userLocation,
        }
    }
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
    $('.weather_page').text(weather);
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

function getDataFromCrimeData() {

}

function getDataFromWeather(zipCode) {
    var SGT_API = {
        url: `http://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&APPID=9538ca63e1e6a5306d06af4048ad137f`,
        success: displayWeatherSuccess,
        method: 'post',
        dataType: 'json',
        error: displayError,
    }
    $.ajax(SGT_API);
}


function displayWeatherSuccess(responseFromServer) {
    var weather = responseFromServer.wind;
    renderWeatherOnDom(weather);
    

}

function displayError() {
    console.log("AJAX call failed :(")
}