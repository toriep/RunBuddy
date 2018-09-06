
/*
<div class="meetup1">
    <div class="time">7:00AM</div>
    <h4 class="groupName">OC HIKING CLUB: ORANGE COUNTY'S HIKING & BACKPACKING GROUP</h4>
    <a href="https://www.meetup.com/Sunrise-to-Sunset-Hikers/events/252851015/">Step Up to Intermediate in Wood Canyon with Liza and David (Repeats every Thu)</a>
    <div class="rsvp"></div>
</div>*/
function renderMeetUpOnDom(meetup){
    for(let m=0; m<meetup.length;m++){
        let groupName = $('<h4>',{
            class: 'groupName',
            text: meetup[m].group.name.toUpperCase()})
        let members = $('<div>',{
            class: 'rsvp',
            text: `${meetup[m].yes_rsvp_count} ${meetup[m].group.who} going`})
        // let time = $('<div>',{
        //     class: 'time',
        //     text: meetup[m].time})
        let eventName = $('<a>',{
            class: 'rsvp',
            text: meetup[m].eventName,
            href: meetup[m].link})
        let meetUp = $('.location_list');
        let meetupDiv = $('<div>').addClass(`meetUp+${m} events hidden`);
        meetupDiv = $(meetupDiv).append(groupName,eventName,members)
        $(meetUp).append(meetupDiv)
    }
}