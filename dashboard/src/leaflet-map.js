'use strict';
var map = L.map('map', {
    center: [0.0, 0.0],
    minZoom: 1,
    zoom: 2,
    // true by default, false if you want a wild map
    sleep: true,
    // time(ms) for the map to fall asleep upon mouseout
    sleepTime: 750,
    // time(ms) until map wakes on mouseover
    wakeTime: 750,
    // defines whether or not the user is prompted oh how to wake map
    sleepNote: true,
    // allows ability to override note styling
    sleepNoteStyle: {
        color: 'red'
    },
    // should hovering wake the map? (clicking always will)
    hoverToWake: true,
    // opacity (between 0 and 1) of inactive map
    sleepOpacity: .7
});

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="//openstreetmap.org">OpenStreetMap</a> contributors, <a href="//creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="//mapbox.com">Mapbox</a>',
    maxZoom: 20,
    id: 'nfsug007.142k19g5',
    accessToken: 'pk.eyJ1IjoibmZzdWcwMDciLCJhIjoiY2lybHczM2dyMDA1dGZrbTZyZ2s3dDEwbSJ9.2aPrUOjRujV5CQ14Agwl6g'
}).addTo(map);

var myURL = jQuery('script[src$="leaflet-map.js"]').attr('src').replace('leaflet-map.js', '');

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
        // console.log('parsed json', mapJson);

        for (var i = 0; i < mapJson.results.length; ++i) {
            var popup = mapJson.results[i].location +
                '<br/><b>City:</b>' + mapJson.results[i].city +
                '<br/><b>Country:</b> ' + mapJson.results[i].country +
                '<br/><b>Source Name:</b> ' + mapJson.results[i].sourceName +
                '<br/><b>Count:</b> ' + mapJson.results[i].count +
                '<br/><b>Last Updated:</b> ' + mapJson.results[i].lastUpdated +
                '<br/><b>First Updated:</b> ' + mapJson.results[i].firstUpdated;

            var latitude = mapJson.results[i].coordinates.latitude;
            var longitude = mapJson.results[i].coordinates.longitude;
            var m = L.marker([latitude, longitude], {
                    icon: myIcon
                })
                .bindPopup(popup);

            markerClusters.addLayer(m);

            m.on('popupopen', function(e) {
                var marker = this._latlng;
                // console.log(marker);
                marker = marker.toString().replace(/[^0-9\,\.\-]/g, '');
                // console.log(marker);
                var fetchUrl = 'https://api.openaq.org/v1/latest?limit=10000&has_geo=true&radius=500&coordinates=' + marker;
                // console.log(fetchUrl);

                fetch(fetchUrl)
                    .then(function(response) {
                        return response.json();
                    }).then(function(dataJson) {
                        // console.log('parsed json', dataJson);
                        var whitespace = ' ';
                        $('#tbody').html('');
                        dataJson.results[0].measurements.forEach(function(measurement) {
                            var opentr = '<tr ' + 'class=' + measurement.parameter + '>';
                            var closetr = '</tr>';
                            var opentd = '<td class="text-center">';
                            var closetd = '</td>';

                            $('#tbody').html($('#tbody').html() + opentr + opentd + measurement.parameter + closetd + opentd + measurement.value + closetd + opentd + measurement.unit + closetd + opentd + measurement.lastUpdated + closetd + closetr);

                            var pm25Value = parseFloat($($('.pm25').children()[1]).text());
                            var pm10Value = parseFloat($($('.pm10').children()[1]).text());
                            var no2Value = parseFloat($($('.no2').children()[1]).text());
                            var so2Value = parseFloat($($('.so2').children()[1]).text());
                            var o3Value = parseFloat($($('.o3').children()[1]).text());
                            var coValue = parseFloat($($('.co').children()[1]).text());
                            var bcValue = parseFloat($($('.bc').children()[1]).text());

                            if (pm25Value != null) {
                                if (pm25Value <= 25) {
                                    $('.pm25').addClass('green');
                                } else if (pm25Value <= 50) {
                                    $('.pm25').addClass('light-green');
                                } else if (pm25Value <= 75) {
                                    $('.pm25').addClass('yellow');
                                } else if (pm25Value <= 100) {
                                    $('.pm25').addClass('orange');
                                } else {
                                    $('.pm25').addClass('red');
                                }
                            } if (pm10Value != null) {
                                if (pm10Value <= 50) {
                                    $('.pm10').addClass('green');
                                } else if (pm10Value <= 100) {
                                    $('.pm10').addClass('light-green');
                                } else if (pm10Value <= 150) {
                                    $('.pm10').addClass('yellow');
                                } else if (pm10Value <= 200) {
                                    $('.pm10').addClass('orange');
                                } else {
                                    $('.pm10').addClass('red');
                                }
                            } if (no2Value != null) {
                                if (no2Value <= 0.017) {
                                    $('.no2').addClass('green');
                                } else if (no2Value <= 0.034) {
                                    $('.no2').addClass('light-green');
                                } else if (no2Value <= 0.051) {
                                    $('.no2').addClass('yellow');
                                } else if (no2Value <= 0.068) {
                                    $('.no2').addClass('orange');
                                } else {
                                    $('.no2').addClass('red');
                                }
                            } if (so2Value != null) {
                                if (so2Value <= 0.03) {
                                    $('.so2').addClass('green');
                                } else if (so2Value <= 0.06) {
                                    $('.so2').addClass('light-green');
                                } else if (so2Value <= 0.09) {
                                    $('.so2').addClass('yellow');
                                } else if (so2Value <= 0.12) {
                                    $('.so2').addClass('orange');
                                } else {
                                    $('.so2').addClass('red');
                                }
                            } if (o3Value != null) {
                                if (o3Value <= 0.04) {
                                    $('.o3').addClass('green');
                                } else if (o3Value <= 0.08) {
                                    $('.o3').addClass('light-green');
                                } else if (o3Value <= 0.12) {
                                    $('.o3').addClass('yellow');
                                } else if (o3Value <= 0.15) {
                                    $('.o3').addClass('orange');
                                } else {
                                    $('.o3').addClass('red');
                                }
                            } if (coValue >= 0) {
                                if (coValue <= 2) {
                                    $('.co').addClass('green');
                                } else if (coValue <= 4) {
                                    $('.co').addClass('light-green');
                                } else if (coValue <= 6) {
                                    $('.co').addClass('yellow');
                                } else if (coValue <= 8) {
                                    $('.co').addClass('orange');
                                } else {
                                    $('.co').addClass('red');
                                }
                            } if (bcValue >= 0) {
                                $('.bc').addClass('yellow');
                            }
                            // console.log(document.getElementById("tbody").innerHTML);
                        });
                    }).catch(function(ex) {
                        console.log('parsing failed', ex);
                    });
            });
        }
    }).catch(function(ex) {
        console.log('parsing failed', ex);
    });

map.addLayer(markerClusters);
