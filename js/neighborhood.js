/* DATA */
/* Location data for my markers */
var LocationData = [
    {
        name : 'Rich\'s Home',
        desc : 'Where Rich sleeps, works, plays, and studies with Udacity.',
        lat : 38.7333260,
        lng : -90.5884440,
        id : 1,
        visible : true,
        latLng : "",
        marker : "",
        searchString : "home"
    },
    {
        name : 'Shop N Save',
        desc : 'The local super marker where Rich buys fresh avecados.',
        lat : 38.7464160,
        lng : -90.5763050,
        id : 2,
        visible : true,
        latLng : "",
        marker : "",
        searchString : "grocery"
    },
    {
        name : 'Jim\'s House',
        desc : 'Where Rich plays poker with the guys on Thursday nights.',
        lat : 38.7304430,
        lng : -90.5909640,
        id : 3,
        visible : true,
        latLng : "",
        marker : "",
        searchString : "card game"
    },
    {
        name : 'Grade School',
        desc : 'Where all the kids go to grade school.',
        lat : 38.7271690,
        lng : -90.5983220,
        id : 4,
        visible : true,
        latLng : "",
        marker : "",
        searchString : "grade school"
    },
    {
        name : 'Bus Stop',
        desc : 'Where the kids catch the bus to get to grade school.',
        lat : 38.7347680,
        lng : -90.5882060,
        id : 5,
        visible : true,
        latLng : "",
        marker : "",
        searchString : "school bus"
    },
    {
        name : 'Pretzel Stop',
        desc : 'Rich\'s favorite place to get a yummy pretzel snack.',
        lat : 38.7448890,
        lng : -90.5922510,
        id : 6,
        visible : true,
        latLng : "",
        marker : "",
        searchString : "fresh pretzel"
    },
    {
        name : 'Shell Gas Station',
        desc : 'Where Rich goes to fill up the gas guzzler and grab a quick coffee.',
        lat : 38.7449030,
        lng : -90.5810290,
        id : 7,
        visible : true,
        latLng : "",
        marker : "",
        searchString : "shell gasoline"
    },
    {
        name : 'Dog Walk Turnaround',
        desc : 'A good place to turn around and head back when on a dog walk.',
        lat : 38.7198040,
        lng : -90.5796640,
        id : 8,
        visible : true,
        latLng : "",
        marker : "",
        searchString : "puppy"
    },
    {
        name : 'Zion Church',
        desc : 'The local soccer fields for the kids.',
        lat : 38.7424640,
        lng : -90.5843770,
        id : 9,
        visible : true,
        latLng : "",
        marker : "",
        searchString : "soccer"
    }
]; 


/* MODEL */
var Location = function(data) {
    // Attributes OR observables
    this.name = data.name;
    this.desc = data.desc;
    this.lat = data.lat;
    this.lng = data.lng;
    this.id = data.id;
    this.visible = ko.observable(data.visible);
    this.latLng = data.latLng;
    this.marker = data.marker;
    this.searchString = data.searchString;
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

    // Create search criteria observable to trigger filtering of markers
    self.criteria = ko.observable();

    // Search function based on observable
    self.criteria.subscribe( function(criteria) {
        // For each location matching criteria make visible
        ko.utils.arrayForEach(self.locationList(), function(item) {
            if (item.name.toLowerCase().match(criteria.toLowerCase())) {
                item.marker.setMap(self.map);
                item.visible(true);
            }
            else {
                item.marker.setMap(null);
                item.visible(false);
            }
        });
        /* Uncomment for debugging */
        /*
        ko.utils.arrayForEach(self.locationList(), function(item) {
            console.log(item.name+" "+item.visible());
        });
        */
    });

    // Create observable for the map and infowindow
    self.map = ko.observable();
    self.iWindow = ko.observable();

    // Setup the map and components
    function initialize() {
        //console.log("Loading map")

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

            // Prepare the content.
            var content = buildMarkerPopContent(self.locationList()[i]);

            // Create latLng then set to the array attribute on locations
            var position = new google.maps.LatLng(self.locationList()[i].lat, self.locationList()[i].lng)
            self.locationList()[i].latLng = position;

            // Build marker object and add as attribute to location
            self.locationList()[i].marker = new google.maps.Marker({
                position: position,
                map: self.map
            });

            // Add the click listener to trigger infowindow popup with extra data on a location
            google.maps.event.addListener(self.locationList()[i].marker, 'click', (function(thisMarker, i, content) {
                return function() {
                    self.iWindow.setContent(content);
                    self.iWindow.open(self.map, thisMarker);
                    fetchWikiInfo(self.locationList()[i]);
                    fetchFlickrInfo(self.locationList()[i]);
                    self.map.setCenter(thisMarker.getPosition());
                    changeAllMarkerColor();
                    thisMarker.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'); //icon: iconBase + 'schools_maps.png'
                }
            })(self.locationList()[i].marker, i, content));
        };
    };

    // Change visibility of all markers
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
    };

    // Change color of all markers
    function changeAllMarkerColor() {
        ko.utils.arrayForEach(self.locationList(), function(item) {
            item.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
        });
    };

    // For the given location build location specific content container
    function buildMarkerPopContent(listItem) {
        var container = '<div class="popup-container">';
        container += '<h2>'+listItem.name+'</h2>';
        container += '<p>'+listItem.desc+'</p>';
        container += '<h4>Wikipedia Links</h4>';
        container += '<ul id="wiki-list-'+listItem.id+'" class="wiki-list"></ul>';
        container += '<a href="" target="_flickr"><img id="flickr-image-'+listItem.id+'" class="flickr-image" alt="' + listItem.searchString + '"/></a>';
        container += '</div>';
        
        // return the string
        return container;
    }

    // For the given location get collection of wiki links
    function fetchWikiInfo(listItem) {
        // Get the element that I will modify via ajax
        var wikiListUl = $('#wiki-list-'+listItem.id);

        // Make a timeout for uncought errors with JSONP callback to wiki
        var wikiRequestTimeout = setTimeout(function(){
            wikiListUl.append("<li>Failed to load Wikipedia links!</li>");
        // 8 second timeout
        }, 8000);

        // set attributes for JSONP request with callback
        var wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + listItem.searchString + '&format=json&callback=wikiCallback';
        var ajaxSettings = {
            url: wikiURL,
            dataType: "jsonp",
            success: function(response) {
                //console.log("Wiki Callback");
                //console.log(response);
                var articleList = response[1];
                                        
                for (var i = 0; i < articleList.length; i++) {
                    if (i == 4) {
                        clearTimeout(wikiRequestTimeout);
                        return false;
                    };
                    var articleStr = articleList[i];
                    var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                    //console.log(url);
                    wikiListUl.append('<li class="wiki-item"><a href="' + url + '" target="_wikiWindow">' + articleStr + '</a></li>');
                };

                // Warn users if no wiki pages were found
                if (articleList.length == 0) {
                    wikiListUl.append('<li class="wiki-item">No related Wikipedia links were found.</li>');
                };

                // Prevent timeout above from overwriting if success
                clearTimeout(wikiRequestTimeout);
            }
        };
        
        // Make ajax request
        $.ajax(ajaxSettings)
        .error(function(error) {
            wikiListUl.append("<li>Wikipedia Links Couldn't Load!</li>");
        });
    };

    // Make asyncronous call to get flickr image related to search criteria
    function fetchFlickrInfo(listItem) {
        // Get the element that I will pupulate with json result
        var flickrImg = $('#flickr-image-'+listItem.id);

        // Make a timeout for uncought errors with JSONP callback to wiki
        var flickrRequestTimeout = setTimeout(function(){
            flickrImg.parent().replaceWith("<div>Failed to load Flickr image!</div>");
        // 8 second timeout
        }, 8000);

        $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?", 
            {
                tags: listItem.searchString,
                tagmode: "any",
                format: "json"
            },
            function(data) {
                // Use only the first item/image returned
                flickrImg.attr("src", data.items[0].media.m);
                flickrImg.parent().attr("href", data.items[0].media.m);

                // Prevent timeout above from overwriting if success
                clearTimeout(flickrRequestTimeout);
            }
        );
    };

    // Makes all markers hidden, resets search input, and makes 
    // ONLY the selected marker visible
    self.selectItemFromList = function(item) {
        changeAllVisibility(false);
        item.marker.setMap(self.map);
        item.visible(true);
        google.maps.event.trigger(item.marker, 'click');
    };

    // Makes all markers visible and resets search input
    self.makeAllVisible = function() {
        // show all markers
        changeAllVisibility(true);
        // Reset to default color
        changeAllMarkerColor();
        // close any open infowindow
        self.iWindow.close();
    };
    
    // On instatiation of VeiwMoeld initialize
    google.maps.event.addDomListener(window, 'load', initialize);
};

// Pull ViewModel and Model data specifics into KO for 
// interaction. Bind my view and model.
ko.applyBindings(new ViewModel());
