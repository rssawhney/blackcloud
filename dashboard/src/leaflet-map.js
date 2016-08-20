'use strict';
var map = L.map( 'map', {
    center: [0.0, 0.0],
    minZoom: 1,
    zoom: 1,
    // true by default, false if you want a wild map
    sleep: true,
    // time(ms) for the map to fall asleep upon mouseout
    sleepTime: 750,
    // time(ms) until map wakes on mouseover
    wakeTime: 750,
    // defines whether or not the user is prompted oh how to wake map
    sleepNote: true,
    // allows ability to override note styling
    sleepNoteStyle: { color: 'red' },
    // should hovering wake the map? (clicking always will)
    hoverToWake: true,
    // opacity (between 0 and 1) of inactive map
    sleepOpacity: .7
});

L.tileLayer( 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="//openstreetmap.org">OpenStreetMap</a> contributors, <a href="//creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="//mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'nfsug007.142k19g5',
    accessToken: 'pk.eyJ1IjoibmZzdWcwMDciLCJhIjoiY2lybHczM2dyMDA1dGZrbTZyZ2s3dDEwbSJ9.2aPrUOjRujV5CQ14Agwl6g'
}).addTo( map );

var myURL = jQuery( 'script[src$="leaflet-map.js"]' ).attr( 'src' ).replace( 'leaflet-map.js', '' );

var myIcon = L.icon({
    iconUrl: myURL + 'images/pin24.png',
    iconRetinaUrl: myURL + 'images/pin48.png',
    iconSize: [29, 24],
    iconAnchor: [9, 21],
    popupAnchor: [0, -14]
});

var markerClusters = L.markerClusterGroup();

fetch('https://api.openaq.org/v1/locations?limit=10000&has_geo=true')
    .then(function(response) {
        return response.json();
    }).then(function(mapJson) {
    console.log('parsed json', mapJson);

    for ( var i = 0; i < mapJson.results.length; ++i )
    {
        var popup = mapJson.results[i].location +
            '<br/><b>City:</b>' + mapJson.results[i].city +
            '<br/><b>Country:</b> ' + mapJson.results[i].country +
            '<br/><b>Source Name:</b> ' + mapJson.results[i].sourceName +
            '<br/><b>Count:</b> ' + mapJson.results[i].count +
            '<br/><b>Last Updated:</b> ' + mapJson.results[i].lastUpdated +
            '<br/><b>First Updated:</b> ' + mapJson.results[i].firstUpdated;

        var m = L.marker( [mapJson.results[i].coordinates.latitude, mapJson.results[i].coordinates.longitude], {icon: myIcon} )
            .bindPopup( popup );

        markerClusters.addLayer( m );

        m.on('popupopen', function(e) {
            var marker = this._latlng;
            console.log(marker);
            marker = marker.toString().replace(/[^0-9\,\.\-]/g,'');
            console.log(marker);
            var fetchUrl = 'https://api.openaq.org/v1/latest?limit=10000&has_geo=true&radius=1&coordinates=' + marker;
            console.log(fetchUrl);

            fetch(fetchUrl)
                .then(function(response) {
                    return response.json();
                }).then(function(dataJson) {
                console.log('parsed json', dataJson);
                // document.getElementById("data").innerHTML =
                var whitespace = ' ';
                document.getElementById("parameter").innerHTML = '';
                document.getElementById("value").innerHTML = '';
                document.getElementById("unit").innerHTML = '';
                document.getElementById("lastUpdated").innerHTML = '';
                dataJson.results[0].measurements.forEach(function (measurement) {
                    document.getElementById("parameter").innerHTML += whitespace + measurement.parameter;
                    document.getElementById("value").innerHTML += whitespace + measurement.value;
                    document.getElementById("unit").innerHTML += whitespace + measurement.unit;
                    document.getElementById("lastUpdated").innerHTML += whitespace + measurement.lastUpdated;
                });
            }).catch(function(ex) {
                console.log('parsing failed', ex);
            });
        });
    }
}).catch(function(ex) {
    console.log('parsing failed', ex);
});


map.addLayer( markerClusters );
