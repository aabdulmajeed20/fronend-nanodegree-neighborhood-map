
/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}


var map;
var Marker;

var clientID;
var clientSecret;



// places array
var myPlaces = [
    {name: 'Kudo', location: {lat: 24.806545, lng: 46.693032}},
    {name: 'Dunkin Dounuts', location: {lat: 24.806476, lng: 46.692939}},
    {name: 'Diet Center', location: {lat: 24.806374, lng: 46.692644}},
    {name: 'Starbucks', location: {lat: 24.805670, lng: 46.693202}},
    {name: 'Cinnabon', location: {lat: 24.806232, lng: 46.692786}}
];

Place = function (data) {
    var self = this;

    this.title = data.name;
    this.position = data.location;
    this.infoWindowText = '';

    // foursquare api related information
    this.lat = data.location.lat;
    this.lng = data.location.lng;
    this.url = '';
    this.phone= '';
    this.address = '';
    clientID = 'ISHIPPNIN0BRTZIDLSCFLSDRPM1MAA3FVWQIOK1ZUURAQN13';
    clientSecret = '4T4GYFVE5KDM0ECSVTWDBAOSYO1UYLF0LIPBPUBB50GUJW4P';

    var foursquareAPIurl = 'https://api.foursquare.com/v2/venues/search?ll=' + this.lat + ',' + this.lng + '&v=20161016' + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&query=' + this.title;

    // ajax request using jquery to retrieve the desired data and store it in the variables.

    $.getJSON(foursquareAPIurl).done(function (data) {
        var results = data.response.venues[0];
        self.url = results.url;
        if (typeof self.url === 'undefined') {
            self.url = "";
        }
        self.address = results.location.formattedAddress[0] || 'No Address Found';
        self.phone = (results.contact.phone || 'No Phone Found');
    }).fail(function () {
        $('#map').html('There is an error with foursquare api, please refresh the page');
    });


    // adding the marker into the map
    this.marker = new google.maps.Marker({
        title: self.title,
        map: map,
        position: self.position,
        animation: google.maps.Animation.DROP,
    });

    // infoWindow with the text
    this.infoWindow = new google.maps.InfoWindow({
        content: self.infoWindowText
    });

    // visibility of marker
    this.visible = ko.observable(true);
    
    this.show = ko.computed(function(){
        if(this.visible() === true)
            this.marker.setMap(map);
        else
            this.marker.setMap(null);
        return true;
    }, this);


    // click listener on the marker
    this.marker.addListener('click', function () {

        self.infoWindowText = '<div class="h6">'+this.title+'</div>' +
            '<p>'+self.phone+'</p>' +
            '<p>'+self.address+'</p>' +
            '<a href="'+self.url+'">'+self.url+'</a>';

        if (self.infoWindow.marker != self.marker)
            self.infoWindow.marker = self.marker;

        self.infoWindow.setContent(self.infoWindowText);

        self.infoWindow.open(map, this);

        self.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            self.marker.setAnimation(null);
        }, 1500);

    });

    this.trigger = function(marker) {
        google.maps.event.trigger(self.marker, 'click');
    };

};

function ViewModel(){
    var self = this;

    // search filter
    this.filter = ko.observable();

    //markers array
    this.markersList = ko.observableArray([]);

    var uluru = {lat: 24.806447, lng: 46.693186};
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 17,
      center: uluru
    });

    // pushed the places into the markers array
    myPlaces.forEach(function(locationEl){
        self.markersList.push( new Place(locationEl) );
    });

    // computed array with the search filter applied on
    this.visiblePlaces = ko.computed(function() {
        var newFilter = self.filter();
        if (!newFilter){
            self.markersList().forEach(function(markerEl){
                markerEl.visible(true);
            });
            return self.markersList();
        } else {
            newFilter = self.filter().toLowerCase();
            return ko.utils.arrayFilter(self.markersList(), function(markerEl) {
                var string = markerEl.title.toLowerCase();
                var result = (string.search(newFilter) >= 0);
                markerEl.visible(result);
                return result;
            });
        }
    });


}
function googleMapsAPIError(){
    $('#map').html('There is an error with google maps api, please refresh the page');
}

function initMap() {
    ko.applyBindings(new ViewModel());
}