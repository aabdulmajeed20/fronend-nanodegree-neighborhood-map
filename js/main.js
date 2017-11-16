/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

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

    // ajax request using jquery to retrieve the desired data and store it in the variables.

    
    this.infoWindow = new google.maps.InfoWindow();

    marker.addListener('click', function() {
        
        self.infoWindowContent = '<h4>'+marker.title+'</h4>';
        self.infoWindow.setContent(self.infoWindowContent);
        if (self.infoWindow.marker != marker)
        self.infoWindow.marker = marker;

        $.ajax(foursquareAPIurl).done(function (data) {
            var results = data.response.venues[0];
            
            self.url = results.url;
            if (typeof self.url === 'undefined') {
                self.url = "";
            }
            self.address = results.location.formattedAddress[0] || 'No Address Found';
            self.phone = (results.contact.phone || 'No Phone Found');
            self.infoWindowContent = '<h4>'+marker.title+'</h4>' +
        '<h6>'+self.phone+'</h6>' +
        '<h6>'+self.address+'</h6>' +
        '<a href="'+self.url+'">'+self.url+'</a>';
    self.infoWindow.setContent(self.infoWindowContent);
        }).fail(function () {
            $('#map').html('There is an error with foursquare api, please refresh the page');
        }); 
        

    self.infoWindow.open(map, this);

    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
        marker.setAnimation(null);
    }, 700);
    });
          self.markers().push(marker);
          loc.marker = marker;
    });   
}


function filterPlaces(){
    var self = this;
    
    this.filterSearch = ko.observable("");
    
    // put places into knockout
    this.testPlaces = ko.observableArray(myPlaces);

    var filteredPlaces;
    
    // places after filtering
    this.filteredTestPlaces = ko.computed(function () {
        
        // If there is anything in the search box, filter for this
        // As of now this does not divide the filterSearch and only searches the Name field
        
        filteredPlaces = ko.utils.arrayFilter(self.testPlaces(), function(test) {
                if(test.marker) {
                    test.marker.setMap(map);
                }
            if(self.filterSearch().length){
                // loop on all the items in the filtered array and set the marker to null (hide it)
//                console.log(test);
                test.marker.setMap(null);
//                console.log(test.marker);
                if( test.name.toUpperCase().indexOf(self.filterSearch().toUpperCase()) >= 0){
                    test.marker.setMap(map);
                    return test;
                }
                    
            }
            else{
                return 1;
            }
        });
        
        return filteredPlaces;
    }, self);
    
    var filteredTestPlaces = this.filteredTestPlaces();
}
function showInfo(a) {
        google.maps.event.trigger(a.marker, 'click');
        return;
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
//    filterPlaces();
  }