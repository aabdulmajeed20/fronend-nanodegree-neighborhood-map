// locations to add it to the map
var myPlaces = [
    {name: 'Kudo', location: {lat: 24.806545, lng: 46.693032}},
    {name: 'Dunkin Dounuts', location: {lat: 24.806476, lng: 46.692939}},
    {name: 'Diet Center', location: {lat: 24.806374, lng: 46.692644}},
    {name: 'Starbucks', location: {lat: 24.805670, lng: 46.693202}},
    {name: 'Cinnabon', location: {lat: 24.806232, lng: 46.692786}}
];

var map;

// function to add markers on the map
this.markers = ko.observableArray([]);
function addMarkers(ml, mp) {
    var self = this;
    this.infoWindowContent = '';

    ml.forEach(function(loc) {
        var marker = new google.maps.Marker({
            position: loc.location,
            map: mp,
            title: loc.name,
            animation: google.maps.Animation.DROP
          });

          // foursquare api related information
    this.lat = loc.location.lat;
    this.lng = loc.location.lng;
    this.url = '';
    this.phone= '';
    this.address = '';
    clientID = 'ISHIPPNIN0BRTZIDLSCFLSDRPM1MAA3FVWQIOK1ZUURAQN13';
    clientSecret = '4T4GYFVE5KDM0ECSVTWDBAOSYO1UYLF0LIPBPUBB50GUJW4P';

    var foursquareAPIurl = 'https://api.foursquare.com/v2/venues/search?ll=' + this.lat + ',' + this.lng + '&v=20161016' + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&query=' + marker.title;
          console.log(foursquareAPIurl);
    // ajax request using jquery to retrieve the desired data and store it in the variables.

    
    this.infoWindow = new google.maps.InfoWindow({
        content: self.infoWindowContent
    });

    marker.addListener('click', function() {
        self.infoWindowContent = '<h4>'+marker.title+'</h4>' +
        '<h6>'+self.phone+'</h6>' +
        '<h6>'+self.address+'</h6>' +
        '<a href="'+self.url+'">'+self.url+'</a>';

        if (self.infoWindow.marker != marker)
        self.infoWindow.marker = marker;

        $.getJSON(foursquareAPIurl).done(function (data) {
            var results = data.response.venues[0];
            
            self.url = results.url;
            console.log(self.url);
            if (typeof self.url === 'undefined') {
                self.url = "";
                console.log(self.url);
            }
            self.address = results.location.formattedAddress[0] || 'No Address Found';
            self.phone = (results.contact.phone || 'No Phone Found');
        }).fail(function () {
            $('#map').html('There is an error with foursquare api, please refresh the page');
        }); 
    self.infoWindow.setContent(self.infoWindowContent);

    self.infoWindow.open(map, this);

    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
        marker.setAnimation(null);
    }, 700);
    });
          self.markers().push(marker);
    });   
}


function filterPlaces(){
    var self = this;
    
    this.filterSearch = ko.observable("");
    
    // put places into knockout
    this.testPlaces = ko.observableArray(myPlaces);

    var filteredPlaces;
    
    // places after filtering
    // console.log("Testing1..........");
    this.filteredTestPlaces = ko.computed(function () {
        // console.log("Testing2..........");
        
        // If there is anything in the search box, filter for this
        // As of now this does not divide the filterSearch and only searches the Name field
        filteredPlaces = ko.utils.arrayFilter(self.testPlaces(), function(test) {
            // console.log("Testing3..........::" + this.markers().length);
            if(self.filterSearch().length){
                console.log("Test: " + this.markers().length);
                return ( test.name.toUpperCase().indexOf(self.filterSearch().toUpperCase()) >= 0);
            }
            else{
                return 1;
            }
        });
        
        return filteredPlaces;
    }, self);

    console.log("Hi: " + self.markers);
    var filteredTestPlaces = this.filteredTestPlaces();
    this.filteredMarkers = ko.computed(function() {
        var x1 = ko.utils.arrayFilter(self.markers, function(test) {
            test.setVisible(false);
            console.log(self.filterSearch().length + " test");
            
            for(var i = 0; i< filteredPlaces.length; i++){
                if(test.title === filteredPlaces[i].name)
                test.serVisible(true);
            }

            
            
        });
        
        return x1;
    }, self);
    
}

$(document).ready( function(){
    var filtered = new filterPlaces();
    ko.applyBindings(filtered);
} );

function initMap() {
    var uluru = {lat: 24.806447, lng: 46.693186};
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 17,
      center: uluru
    });
    addMarkers(myPlaces,map);
    filterPlaces();
  }