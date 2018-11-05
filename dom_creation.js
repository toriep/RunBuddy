function displayMapOnDom() {
    $(".landing_page").addClass("hidden");
    $(".map_page").removeClass("hidden");
    //Map options
    const options = {
        zoom: 11,
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
            icon: "images/run_buddy_marker.png"
        });
        let contentString = "<h3>" + runningTrails[trailIndex].name + "</h3>";
        let infoWindow = new google.maps.InfoWindow({
            content: contentString
        })

        marker.addListener('click', function () {
            infoWindow.open(map, marker);
            for (let i = 1; i < runningTrails.length; i++) {
                if (runningTrails[i].coordinates.lat === marker.position.lat && runningTrails[i].coordinates.lng === marker.position.lng) {
                    trailToReplaceAtIndexOne = runningTrails[i];
                    runningTrails.splice(i, 1);
                    runningTrails.splice(1, 0, trailToReplaceAtIndexOne);
                    $(".list_result").remove();
                    renderTrailInfoOnDom(true);
                }
            }
            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
            } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function () { marker.setAnimation(null); }, 1000);
                setTimeout(function () { infoWindow.close(); }, 1000);
            }
        });
    }
    renderTrailInfoOnDom();
}

function renderTrailInfoOnDom(markerIsClicked = false) {
    if ($('.list_result').length > 0) {
        $(".list_result").remove();
    }
    for (let i = 1; i < runningTrails.length; i++) {
        let listResultsDiv = $('<div>').addClass('list_result');
        if (markerIsClicked && i === 1) {
            listResultsDiv.addClass('selected')
        }
        let locationPictureDiv = $('<div>');
        let imageOfPlace = $('<img>').attr('src', runningTrails[i].image).addClass('locationPicture');
        locationPictureDiv.append(imageOfPlace);
        let locationDescriptionDiv = $('<div>').addClass('locationDescription');
        let nameOfPlace = $('<p>').text(runningTrails[i].name);
        const location = $('<div>').addClass('address').text(`${runningTrails[i].location}`);
        const rating = $('<div>').text(`${runningTrails[i].stars} out of 5 stars`);
        let brLine = $('<br>');
        let moreInfoButton = $('<button>').addClass('btn btn-blue').text('Trail Info');
        moreInfoButton.click(() => displayTrailDescription(runningTrails[i]));
        locationDescriptionDiv.append(nameOfPlace, location, rating, brLine, moreInfoButton);
        listResultsDiv.append(locationPictureDiv, locationDescriptionDiv);
        $('.location_list').append(listResultsDiv);
    }
    $('.loadingImg').addClass('hidden');
    $('.group_tabs').animate({ scrollTop: 0 }, 1500)
}

function displayTrailDescription(trail) {
    $('.descriptionTab').empty();
    $('.trails_tab').removeClass('hidden');
    $('.single_location_detail').removeClass('hidden');
    $('.list_result').addClass('hidden');
    displayDescription();
    const imageOfPlace = $('<img>').attr('src', trail.imgMedium);
    const nameOfPlace = $('<p>').addClass('trailName').text(trail.name);
    const location = $('<div>').html(`<b>Location :</b> ${trail.location}`);
    const distance = $('<div>').html(`<b>Length :</b> ${trail.distance}`);
    const rating = $('<div>').html(`<b>Rating :</b> ${trail.stars} out of 5 stars from ${trail.starVotes} reviews`);
    const summary = $('<div>').addClass('trail_summary').html(`<b>Overview :</b> ${trail.summary}`);
    const conditionStatus = $('<div>').addClass('condition_status').html(`<b>Status :</b> ${trail.conditionStatus}`);
    const conditionDetails = $('<div>').addClass('condition_details').html(`<b>Condition :</b> ${trail.conditionDetails || 'Currently, there is no condtition information for this trail.'}`);
    const ascent = $('<div>').addClass('ascent').html(`<b>Ascent :</b> ${trail.ascent} inches`);
    const descent = $('<div>').addClass('descent').html(`<b>Descent :</b> ${trail.descent} inches`);
    const pointBCoordinates = trail.coordinates
    const descriptionDiv = $('<div>').addClass('description');
    const moreInfo = $('<div>').html(`<br><a target="_blank" href="${trail.url}">More info on ${trail.name}</a>`);
    descriptionDiv.append(nameOfPlace, imageOfPlace, location, rating, distance, ascent, descent, conditionStatus, conditionDetails, summary, moreInfo);
    $('.descriptionTab').append(descriptionDiv);
    displayDirectionLineOnMap(pointBCoordinates);
    $("html, body").animate({
        scrollTop: 0
    }, "slow"); //scroll window to the top
}

function displayDirectionLineOnMap(pointBCoordinates) {
    debugger;
    $("#map_area").text();
    var pointA = currentLocation,
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
                var result = document.getElementById('direction_tab');
                result.innerHTML = "";
                let newTr1 = document.createElement("tr");
                newTr1.innerHTML = `<b>Start location :</b> ${response.routes[0].legs[0].start_address}<br>`;
                let newTr2 = document.createElement("tr");
                newTr2.innerHTML = `<b>Distance :</b> ${response.routes[0].legs[0].distance.text}.  <b>Duration:</b> ${response.routes[0].legs[0].duration.text}.<br><br>`;
                let newTr4 = document.createElement("tr");
                newTr4.innerHTML = `<b>Destination :</b> ${response.routes[0].legs[0].end_address}<br><br>`;
                result.appendChild(newTr1);
                result.appendChild(newTr2);
                result.appendChild(newTr4);
                for (var i = 0; i < response.routes[0].legs[0].steps.length; i++) {
                    let newTr3 = document.createElement("tr"); //new table row
                    let td2 = document.createElement("td");
                    td2.innerHTML = `${i + 1}. ${response.routes[0].legs[0].steps[i].instructions}`;
                    let td3 = document.createElement("td");
                    td3.innerHTML = `  ${response.routes[0].legs[0].steps[i].distance.text}`;
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

function displayWeatherSuccess(responseFromServer) {
    let weather = {
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
        wind: responseFromServer.wind['speed'],
        clouds: responseFromServer.clouds['all'],
    };
    console.log(responseFromServer);
    renderWeatherOnDom(weather);
}

function renderWeatherOnDom(weather) {
    if ($('.weather_list').length > 0) {
        $(".weather_list").remove();
    }
    let imgSrc = `http://openweathermap.org/img/w/${weather.iconId}.png`;
    let weatherImage = $('<img class="weather_icon">').attr({
        "src": imgSrc,
        "alt": weather.condition
    });
    let today = new Date();
    let dateToday = today.toDateString();
    let timeNow = today.toLocaleTimeString();
    let highInC = ((weather.tempMaxInF - 32) * 5/9).toFixed(1);
    let lowInC = ((weather.tempMinInF - 32) * 5/9).toFixed(1);
    let headline = $('<div>').append(`${weather.cityName}`);
    let line0 = $('<li>').append(`<i>As of ${dateToday} ${timeNow}</i>`);
    let line1 = $('<li>').append(weatherImage, (weather.conditionDescription).toUpperCase());
    let line2 = $('<li>').append(`<b>Current Temperature :</b> ${weather.currentTempInF} <b>°F</b `);
    let line3 = $('<li>').append(`<b>High :</b> ${weather.tempMaxInF} <b>°F</b>&nbsp; | &nbsp;${highInC} <b>°C</b>`);
    let line4 = $('<li>').append(`<b>Low :</b> ${weather.tempMinInF} <b>°F</b>&nbsp; | &nbsp;${lowInC} <b>°C</b>`);
    let line5 = $('<li>').append(`<b>Humidity :</b> ${weather.humidity} <b>%</b>`);
    let line6 = $('<li>').append(`<b>Wind :</b> ${weather.wind} <b>m/s</b>`);
    let line7 = $('<li>').append(`<b>Cloudiness :</b> ${weather.clouds} <b>%</b>`);
    
    let weatherList = $('<ul>').addClass('weather_list hidden');
    weatherList.append(headline, line0, line1, line2, line3, line4, line5, line6, line7);
    $('.single_location_detail').append(weatherList);
}

function displayMeetUpSuccess(response) {
    if ($('.events').length > 0) {
        $(".events").remove();
    }
    if (response.meta.count === 0) {
        const meetupDiv = $('<div>', {
            class: `events hidden`,
            html: '<h2>Currently, there are no upcoming meetups near your area.'
        });
        $('.single_location_detail').append(meetupDiv);
    }
    const meetUpResponse = response.results;
    const filteredMeetUpResults = [];
    for (let m = 0; m < meetUpResponse.length; m++) {
        let { description, name, event_url, time, group, yes_rsvp_count } = meetUpResponse[m];
        const formattedInfo = { description, eventName: name, link: event_url, time, group, yes_rsvp_count }
        formattedInfo.time = Date(parseInt(formattedInfo.time))
        filteredMeetUpResults.push(formattedInfo);
    }
    renderMeetUpOnDom(filteredMeetUpResults)
}

function renderMeetUpOnDom(meetup) {
    for (let m = 0; m < meetup.length; m++) {
        const groupName = $('<p>', {
            class: 'groupName',
            text: meetup[m].group.name.toUpperCase()
        })
        const members = $('<div>', {
            class: 'rsvp',
            text: `${meetup[m].yes_rsvp_count} ${meetup[m].group.who} going`
        })
        const eventName = $('<a>', {
            class: 'rsvp',
            text: meetup[m].eventName,
            href: meetup[m].link,
            title: 'Meetup.com Link',
            target: '_blank'
        })
        const meetUp = $('.single_location_detail');
        let meetupDiv = $('<div>').addClass(`meetUp events hidden`);
        meetupDiv = $(meetupDiv).append(groupName, eventName, members)
        $(meetUp).append(meetupDiv)
    }
}