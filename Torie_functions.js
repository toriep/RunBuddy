
/*
<div class="meetup1">
    <div class="time">7:00AM</div>
    <h4 class="groupName">OC HIKING CLUB: ORANGE COUNTY'S HIKING & BACKPACKING GROUP</h4>
    <a href="https://www.meetup.com/Sunrise-to-Sunset-Hikers/events/252851015/">Step Up to Intermediate in Wood Canyon with Liza and David (Repeats every Thu)</a>
    <div class="rsvp">15 OC Hikers & Backpackers! going </div>
</div>*/
function renderMeetUpOnDom(meetup){
    var group = meetup.name;
    for(let m=0; m<meetup.length;m++){
        let groupName = $('<h4>',{
        class: 'groupName',
        text: filteredMeetUpResults[m].group.name})
        let members = $('<div>',{
            class: 'rsvp',
            text: filteredMeetUpResults[m].group.who})
        let time = $('<h4>',{
            class: 'rsvp',
            text: filteredMeetUpResults[m].group.who})
        let eventName = $('<h4>',{
            class: 'groupName',
            text: filteredMeetUpResults[m].eventName
        var link = $('<h4>',{
            class: 'groupName',
            text: filteredMeetUpResults[m].eventName.link
        var meetupDiv = $('<div>').addClass(`meetUp+${m}`);
    }
}