function renderInformationOnDom(runningTrailsArray) {

    for ( let i = 1; i < runningTrailsArray.length; i++) {
        // console.log(runningTrailsArray[i]);
        let listResultsDiv = $('<div>').addClass('list_result');
        let locationPictureDiv = $('<div>');
        let imageOfPlace = $('<img>').attr('src', runningTrailsArray[i].image).addClass('locationPicture');
        locationPictureDiv.append(imageOfPlace);
        let locationDescriptionDiv = $('<div>').addClass('locationDescription');
        let nameOfPlace = $('<p>').text(runningTrailsArray[i].name);
        let addressOfPlace1 = `${runningTrails[i].location.display_address[0]}`;
        let brl = $('<br>');
        let addressOfPlace2 = `${runningTrails[i].location.display_address[1]}`;
        let addressOfPlace = $('<adress>').append(addressOfPlace1, brl, addressOfPlace2);
        let moreInfoButton = $('<button>').text('More Info');
        locationDescriptionDiv.append(nameOfPlace, addressOfPlace, moreInfoButton);
        listResultsDiv.append(locationPictureDiv, locationDescriptionDiv);
        $('.location_list').append(listResultsDiv);
    }
}