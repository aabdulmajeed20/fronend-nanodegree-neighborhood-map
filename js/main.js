
var myLocations = [
    {title: 'Kudo', location: {lat: 24.806545, lng: 46.693032}},
    {title: 'Dunkin Dounuts', location: {lat: 24.806476, lng: 46.692939}},
    {title: 'Diet Center', location: {lat: 24.806374, lng: 46.692644}},
    {title: 'Starbucks', location: {lat: 24.805670, lng: 46.693202}},
    {title: 'Cinnabon', location: {lat: 24.806232, lng: 46.692786}}
];

function initMap() {
    var uluru = {lat: 24.806447, lng: 46.693186};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: uluru
    });
    var marker = new google.maps.Marker({
      position: uluru,
      map: map
    });
  }