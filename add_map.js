var staticLocation = {
    lat: 33.6846,
    lng: -117.8265
}

var staticRunningTrail = {

    lat: 33.6535,
    lng: -117.7826
}

var staticRunningTrailName = "Quail Hill Trailhead"

function initMap() {
    //Map options
    var options = {
        zoom: 13,
        center: staticLocation,
    }
    //New map
    var map = new google.maps.Map(document.getElementById("map_page"), options);
    //Add marker
    var marker = new google.maps.Marker({
        position: staticRunningTrail,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: "images/Winged_Shoe.png"
    });
    var infoWindow = new google.maps.InfoWindow({
        content: "<h3>Quail Hill Trailhead</h3>"
    })

    marker.addListener('click', toggleBounce);

    // marker.addListener('click',function(){
    //     infoWindow.open(map,marker)
    // })
}

function toggleBounce() {
    if(marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}