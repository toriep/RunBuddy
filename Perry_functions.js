function renderInformationOnDom(runningTrailsArray) {

    for ( let i = 1; i < runningTrailsArray.length; i++) {
        console.log(runningTrailsArray[i]);
        let listResultsDiv = $('<div>').addClass('list_result');
        let imageOfPlace = $('<img>').attr('src', runningTrailsArray[i].image);
        let nameOfPlace = $('<h3>').text(runningTrailsArray[i].name);
        let addressOfPlace = $('<p>').text(`${runningTrails[i].location.display_address[0]} ${runningTrails[i].location.display_address[1]}`);
        let moreInfoButton = $('<button>').addClass('btn btn-success').text('More Info');
        moreInfoButton.click(()=>{
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
        listResultsDiv.append(nameOfPlace, imageOfPlace, addressOfPlace, moreInfoButton);
        $('.location_list').append(listResultsDiv);
    }
}