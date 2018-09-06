function renderInformationOnDom(runningTrailsArray) {

    for ( let i = 1; i < runningTrailsArray.length; i++) {
        console.log(runningTrailsArray[i]);
        let listResultsDiv = $('<div>').addClass('list_result');
        let imageOfPlace = $('<img>').attr('src', runningTrailsArray[i].image);
        let nameOfPlace = $('<h3>').text(runningTrailsArray[i].name);
        let addressOfPlace = $('<p>').text(`${runningTrails[i].location.display_address[0]} ${runningTrails[i].location.display_address[1]}`);
        let moreInfoButton = $('<button>').text('More Info');
        listResultsDiv.append(nameOfPlace, imageOfPlace, addressOfPlace, moreInfoButton);
        $('.location_list').append(listResultsDiv);
    }
}