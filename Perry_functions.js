function renderInformationOnDom(runningTrailsArray) {
    
    for ( let i = 1; i < runningTrailsArray.length; i++) {
        // console.log(runningTrailsArray[i]);
        let listResultsDiv = $('<div>').addClass('list_result');

        let locationPictureDiv = $('<div>'); //check 
        let imageOfPlace = $('<img>').attr('src', runningTrailsArray[i].image).addClass('locationPicture'); //check
        locationPictureDiv.append(imageOfPlace); //check
        let locationDescriptionDiv = $('<div>').addClass('locationDescription'); //check
        let nameOfPlace = $('<p>').text(runningTrailsArray[i].name); //check
        let addressOfPlace1 = `${runningTrails[i].location.display_address[0]}`; //check
        let brLine1 = $('<br>'); //check
        let brLine2 = $('<br>'); //check
        let addressOfPlace2 = `${runningTrails[i].location.display_address[1]}`;
        let moreInfoButton = $('<button>').addClass('btn btn-success').text('More Info');
        let addressOfPlace = $('<address>').append(addressOfPlace1, brLine1, addressOfPlace2);

        moreInfoButton.click(()=>{
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
            $('.location_list').append(descriptionDiv);
            displayDirectionLineOnMap(pointBCoordinates);
        })
        locationDescriptionDiv.append(nameOfPlace, addressOfPlace, brLine2, moreInfoButton);
        listResultsDiv.append(locationPictureDiv, locationDescriptionDiv);
        $('.location_list').append(listResultsDiv);
    }

}