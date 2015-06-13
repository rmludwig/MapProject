/* 
*
* JS examples
*
*/

function initialize() {
    var mapOptions = {
        /* my home is center of map */
        center: { lat: 38.7331560,
                  lng: -90.5881600
        },
        zoom: 15
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    console.log("Did it init?")
}
google.maps.event.addDomListener(window, 'load', initialize);


