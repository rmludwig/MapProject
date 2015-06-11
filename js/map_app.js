/* 
*
* JS examples
*
*/

function initialize() {
    var locations = [
      ['Home', 38.7333260, -90.5884440, 1],
      ['Shop N Save', 38.7464160,-90.5763050, 2],
      ['Jim\'s House', 38.7304430, -90.5909640, 3],
      ['Grade School', 38.7271690, -90.5983220, 4],
      ['Bus Stop', 38.7347680, -90.5882060, 5],
      ['Pretzel Stop', 38.7448890, -90.5922510, 6],
      ['Shell Gas Station', 38.7449030, -90.5810290, 7],
      ['Dog Walk Turnaround', 38.7198040, -90.5796640, 8],
      ['Zion Church', 38.7424640, -90.5843770, 9]
    ];    


//38.7052978,-90.5186371 LR 
//38.7830861,-90.6475548 UL


    var mapOptions = {
        /* my home is center of map */
        center: { lat: 38.7331560,
                  lng: -90.5881600
        },
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    //console.log("Did it init?");
    //resizeGoogleMap();

    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < locations.length; i++) {  
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        map: map
      });

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(locations[i][0]);
          infowindow.open(map, marker);
        }
      })(marker, i));
    };
}
google.maps.event.addDomListener(window, 'load', initialize);




/*
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
