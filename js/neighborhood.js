/* DATA */
/* Location data for my markers */
var LocationData = [
    {
        name : 'Home',
        lat : 38.7333260,
        lng : -90.5884440,
        id : 1,
        visible : true
    },
    {
        name : 'Shop N Save',
        lat : 38.7464160,
        lng : -90.5763050,
        id : 2,
        visible : false
    },
    {
        name : 'Jim\'s House',
        lat : 38.7304430,
        lng : -90.5909640,
        id : 3,
        visible : true
    },
    {
        name : 'Grade School',
        lat : 38.7271690,
        lng : -90.5983220,
        id : 4,
        visible : true
    },
    {
        name : 'Bus Stop',
        lat : 38.7347680,
        lng : -90.5882060,
        id : 5,
        visible : true
    },
    {
        name : 'Pretzel Stop',
        lat : 38.7448890,
        lng : -90.5922510,
        id : 6,
        visible : true
    },
    {
        name : 'Shell Gas Station',
        lat : 38.7449030,
        lng : -90.5810290,
        id : 7,
        visible : true
    },
    {
        name : 'Dog Walk Turnaround',
        lat : 38.7198040,
        lng : -90.5796640,
        id : 8,
        visible : true
    },
    {
        name : 'Zion Church',
        lat : 38.7424640,
        lng : -90.5843770,
        id : 9,
        visible : true
    }
]; 


/* MODEL */
/* Location Object*/
var Location = function(data) {
    // Attributes OR observables
    this.name = data.name;
    this.lat = data.lat;
    this.lng = data.lng;
    this.id = data.id;
    this.visible = ko.observable(data.visible);
};
/* Search Object*/
var Search = function(argument) {
    this.criteria = ko.observable(argument.criteria);
}


/* VIEWMODEL - aka Controller */
var ViewModel = function() {
    // Binding self to the viewmodel to make code below easier to
    // understand. This is optional, but good for keeping the 'this'
    // values sepperate.
    //
    // Keeping track of 'outer this' and 'inner this'.
    var self = this;

    // Create observable array that will be pupulated with model data
    self.locationList = ko.observableArray([]);  

    // Populate the ObsAarray with loc data via loop
    LocationData.forEach(function(item) {
        self.locationList.push( new Location(item) )
    });

    // Create Search observable
    self.search = ko.observable( new Search(" ") );

    // Create observable for the map
    self.map = ko.observable({});

    // Setup the map and components
    function initialize() {
        console.log("Loading map")

        var mapOptions = {
            center : {
                lat : self.locationList()[0].lat,
                lng : self.locationList()[0].lng
            },
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        // Paint the map
        self.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    
        // Paint the initial overlay elements
        loadOverlay();

        // Position the controls where I want them using google API
        var input = document.getElementById('pac-input');
        var types = document.getElementById('type-selector');
        self.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        self.map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

    };

    // Create info window for overlay elements
    function loadOverlay() {
        var infowindow = new google.maps.InfoWindow();

        // For each location build an initial marker using visibility attribute
        var marker;
        for (var i = 0; i < self.locationList().length; i++) { 

            // Only load the visible markers
            //console.log("The "+self.locationList()[i].name+" visibility is "+self.locationList()[i].visible());
            if (self.locationList()[i].visible()) {
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(self.locationList()[i].lat, self.locationList()[i].lng),
                    map: self.map
                });

                google.maps.event.addListener(marker, 'click', (function(thisMarker, i) {
                    return function() {
                        infowindow.setContent(self.locationList()[i].name);
                        infowindow.open(self.map, thisMarker);
                    }
                })(marker, i));
            }
        };
    };

    // Search my locations, and re-draw the markers.

    // Build list of all markers.
    
    // On instatiation of VM initialize
    google.maps.event.addDomListener(window, 'load', initialize);

    //console.log("This guy "+self.locationList()[0].name);
    //console.log(+self.locationList()[0].marker.visible());
    //self.locationList()[0].marker.setVisible(false);
};


// Pull ViewModel and Model data specifics into KO for 
// interaction. Bind my view and model.
ko.applyBindings(new ViewModel());




/*


        // USE LATER?? MAP BOUNDS
        //38.7052978,-90.5186371 LR 
        //38.7830861,-90.6475548 UL


// This is needed when map is not in a stand alone div and full screen.
// After I figured this out I re-read the requirements and see that full
// screen is desired on this project. I'm leaving the code commented out
// for future reference.
function resizeGoogleMap() {
    var mapDivWidth = $('#map-div').width();
    $('#map-canvas').width(mapDivWidth);
    $('#map-canvas').height(3 * mapDivWidth / 4);
    google.maps.event.trigger($('#map'), 'resize');
    console.log(mapDivWidth);
    console.log("Resized");
}

// resize the map whenever the window resizes
$(window).resize(resizeGoogleMap);
*/
