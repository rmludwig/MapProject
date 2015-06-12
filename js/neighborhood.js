/* DATA */
/* Location data for my markers */
var LocationData = [
    {
        name : 'Home',
        lat : 38.7333260,
        lng : -90.5884440,
        id : 1,
        visible : true,
        latLng : "",
        marker : ""
    },
    {
        name : 'Shop N Save',
        lat : 38.7464160,
        lng : -90.5763050,
        id : 2,
        visible : true,
        latLng : "",
        marker : ""
    },
    {
        name : 'Jim\'s House',
        lat : 38.7304430,
        lng : -90.5909640,
        id : 3,
        visible : true,
        latLng : "",
        marker : ""
    },
    {
        name : 'Grade School',
        lat : 38.7271690,
        lng : -90.5983220,
        id : 4,
        visible : true,
        latLng : "",
        marker : ""
    },
    {
        name : 'Bus Stop',
        lat : 38.7347680,
        lng : -90.5882060,
        id : 5,
        visible : true,
        latLng : "",
        marker : ""
    },
    {
        name : 'Pretzel Stop',
        lat : 38.7448890,
        lng : -90.5922510,
        id : 6,
        visible : true,
        latLng : "",
        marker : ""
    },
    {
        name : 'Shell Gas Station',
        lat : 38.7449030,
        lng : -90.5810290,
        id : 7,
        visible : true,
        latLng : "",
        marker : ""
    },
    {
        name : 'Dog Walk Turnaround',
        lat : 38.7198040,
        lng : -90.5796640,
        id : 8,
        visible : true,
        latLng : "",
        marker : ""
    },
    {
        name : 'Zion Church',
        lat : 38.7424640,
        lng : -90.5843770,
        id : 9,
        visible : true,
        latLng : "",
        marker : ""
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
    this.latLng = data.latLng;
    this.marker = data.marker;
};


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
        self.locationList.push( new Location(item) );
    });

    // Create search criteria observable
    self.criteria = ko.observable();

    // Search function based on observable
    self.criteria.subscribe( function(criteria) {
        // For each location matching criteria make visible
        ko.utils.arrayForEach(self.locationList(), function(item) {
            if (item.name.toLowerCase().match(criteria.toLowerCase())) {
                //console.log("--------> Found "+item.name);
                item.marker.setMap(self.map);
                item.visible(true);
            }
            else {
                //console.log("NOT FOUND "+item.name);
                item.marker.setMap(null);
                item.visible(false);
            }
        });
        //ko.utils.arrayForEach(self.locationList(), function(item) {
            //console.log(item.name+" "+item.visible());
        //});
    });

    // Create observable for the map and infowindow
    self.map = ko.observable();
    self.iWindow = ko.observable();

    // Setup the map and components
    function initialize() {
        console.log("Loading map")

        // Attributes of my map, basis of the webpage
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
    
        // Prepare for info window.
        self.iWindow = new google.maps.InfoWindow();

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
        // For each location build an initial marker using visibility attribute
        for (var i = 0; i < self.locationList().length; i++) { 

            // Create latLng then set to the array attribute on locations
            var position = new google.maps.LatLng(self.locationList()[i].lat, self.locationList()[i].lng)
            self.locationList()[i].latLng = position;

            self.locationList()[i].marker = new google.maps.Marker({
                position: position,
                map: self.map
            });

            google.maps.event.addListener(self.locationList()[i].marker, 'click', (function(thisMarker, i) {
                return function() {
                    self.iWindow.setContent(self.locationList()[i].name);
                    self.iWindow.open(self.map, thisMarker);
                }
            })(self.locationList()[i].marker, i));

        };
    };

    function changeAllVisibility(newVisibility) {
        ko.utils.arrayForEach(self.locationList(), function(item) {
                self.criteria('');
                if (newVisibility) {
                    item.marker.setMap(self.map);
                }
                else {
                    item.marker.setMap(null);
                }
                item.visible(newVisibility);
        });
    }

    // Makes all markers hidden, resets search input, and makes 
    // ONLY the selected marker visible
    self.selectItemFromList = function(item) {
        changeAllVisibility(false);
        item.marker.setMap(self.map);
        item.visible(true);
    }

    // Makes all markers visible and resets search input
    self.makeAllVisible = function() {
        changeAllVisibility(true);
    }
    
    // On instatiation of VeiwMoeld initialize
    google.maps.event.addDomListener(window, 'load', initialize);
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
