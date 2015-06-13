Rich's Neighborhood Map project
===============================

Date 06/13/15

Author Rich L.

Git repo https://github.com/rmludwig/MapProject.git


Using the app
-------------

To use or test this app simply load the index.html file in your browser. The porject was developed in Chrome but should be mostly compatible with other browsers due to the flexibility of the API I used and the jQuery library.

Features
--------

The map has built in Google features like:
+ zoom
+ street view
+ pan
+ satelite view

Additional custom features are:
+ markers for my favorite neighborhood locations
+ search/filter on location names
+ index list of all visible markers
+ display all markers option to reset map

When a marker is selected:
+ marker color changes
+ infowindow popup displays info on the location
+ up to four wikipedia links are displayed related to the location
+ the top flickr image hit is diaplyed


Sources & Process of Development
--------------------------------
While developing this project I relied heavily on the knockout js and google map API documentation. I also used the wiwpesia API and flickr API documentation. Other sources include sourceforge and w3schools.

I initially started with a bootstrap page and got to the point where I could control map size and position and add markers. I thn looked at the requirements more closely and found that "full page map" was described as a requirement. So I moved away from bootstrap and now rely on custom css to controll positioning of elements as needed over the top of the full screen map. I struggled with the markers quite a bit, but once I got over that hurdle things moved fairly quickly. Also I has some problems with subscribing to observables elements of an observable array item. I then found that there was another way to accomplish wha tI was looking for which was to rely on the click listner. 


SUMMARY
-------

I hope you enjoy testing the map as much as I did. This project was very challenging but also very educational. 