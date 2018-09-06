
function displayDirectionLineOnMap() {
    $("#map_area").text();
    var pointA = new google.maps.LatLng(33.7675, -117.9425),
      pointB = new google.maps.LatLng(33.7208, -117.9396),
      myOptions = {
        zoom: 7,
        center: pointA
      },
      map = new google.maps.Map(document.getElementById('map_area'), myOptions),
      // Instantiate a directions service.
      directionsService = new google.maps.DirectionsService,
      directionsDisplay = new google.maps.DirectionsRenderer({
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
    }, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      } else {
       console.log('Directions request failed due to ' + status);
      }
    });
  }

  //to call function, add a click handler to the location box .click(displayDirectionLineOnMap);
  
 
