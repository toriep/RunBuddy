function getDataFromGeolocation() {
    const location = {
        url: `https://www.googleapis.com/geolocation/v1/geolocate?key=${GOOGLE_API_KEY}`,
        method: 'post',
        dataType: 'json',
        success: responseFromGeolocation,
        error: displayError('GetDataFromGeoLoaction'),
    }
    $.ajax(location);
}

//this function converts a given address, city, or zip code to lat and long
function getLatLongFromGeocoding(inputAddress) {
    const formattedAddress = inputAddress.split(" ").join("+");
    const location = {
        url: `https://maps.googleapis.com/maps/api/geocode/json`,
        method: 'get',
        dataType: 'json',
        data: {
            key: GOOGLE_API_KEY,
            address: formattedAddress
        },
        success: geocodingResponse,
        error: displayError('GetDataFromGeocoding'),
    }
    $.ajax(location);
}

function activatePlacesSearch() {
    const input = document.getElementById('search_input');
    const input2 = document.getElementById('search_field');
    const autocomplete = new google.maps.places.Autocomplete(input);
    const autocomplete2 = new google.maps.places.Autocomplete(input2);
}

function getresponseFromTrailsList(latitude, longitude) {
    $('.landing_page').addClass('hidden');
    $('.loadingImg').removeClass('hidden');

    const runningTrails = {
        dataType: 'JSON',
        method: 'GET',
        url: `https://www.trailrunproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&maxResults=30&key=${TRAIL_API_KEY}`,
        success: responseFromTrailsList,
    }
    $.ajax(runningTrails);
}

function getDataFromWeather(lat, lon) {
    const weather = {
        url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${WEATHER_API_KEY}`,
        method: 'post',
        dataType: 'json',
        success: displayWeatherSuccess,
        error: displayError('getDataFromWeather'),
    }
    $.ajax(weather);
}

function getDataFromMeetUp(lat,long) {
    const meetup = {
        url: `https://api.meetup.com/2/open_events?&sign=true&photo-host=public&lat=${lat}&lon=${long}&topic=running&page=20&key=${MEETUP_API_KEY}`,
        success: displayMeetUpSuccess,
        method: 'post',
        dataType: 'jsonp',
        error: displayError('getDataFromMeetUp'),
    }
    $.ajax(meetup);
}

