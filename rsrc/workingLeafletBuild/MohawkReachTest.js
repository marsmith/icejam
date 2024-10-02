

//////////////////////////////////////////////////////////////////////////
// Grid Coords, map defintions
//////////////////////////////////////////////////////////////////////////
var north = 42.832;
var east = -73.9396;

// define map
var map = L.map('map').setView([north, east], 13);

// USGS Maps: USGSTopo; USGSHydroCached; USGSShadedReliefOnly ; 
var USGS_USTopo = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}', {
	maxZoom: 20, attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'}).addTo(map);

//////////////////////////////////////////////////////////////////////////
// Pull NWIS Data 
//////////////////////////////////////////////////////////////////////////

// write function() here to pull nwis stage and q

//////////////////////////////////////////////////////////////////////////
// Generalized functions for prediction models
//////////////////////////////////////////////////////////////////////////
function stage (q, a, b, c) {
    return (a * q**(b) + c) 
}

// update these fit params
function L9_s (q) {
    return stage(q, 0.08666, 0.51, 10.8) 
}

function L8_s (q) {
    return stage(q, 0.00046, 0.93, 9.1)
}

function FB_s (q) {
    return stage(q, 0.00039, 0.82, 9.2)
}

function RX_s (q) {
    return stage(q, 0.00277, 0.68, 9.1)
}

//////////////////////////////////////////////////////////////////////////
// COLOR HANDLERS
//////////////////////////////////////////////////////////////////////////
function getColor(s1, s2) { //actual, predicted
    if (s1 >= (s2+3.0)) {
        colour = 'red';
    } else if (s1 >= (s2+2.0)){
        colour = 'orange';
    } else if (s1 >= (s2+1.0)) {
        colour = 'yellow';
    } else {
        colour = 'green';
    }
    return(colour)
}

function polyfill(feature, col=getColor()){
    return{
        color: 'black',
        weight: 2,
        opacity: 0.85,
        fillColor: col,
        fillOpacity: 1,
    }
}

//////////////////////////////////////////////////////////////////////////////
// Simulate data and plot (need to pull nwis data)
//////////////////////////////////////////////////////////////////////////////

// simulated fb discharge
q = 30000 
// predicted values based on q 
l9_s0 = L9_s(q)
l8_s0 = L8_s(q)
fb_s0 = FB_s(q) 
rx_s0 = RX_s(q)

// simulated stage values (replace w/ nwis data)
l9s = l9_s0+5.6
l8s = l8_s0+2.3
fbs = fb_s0+1.4
rxs = rx_s0+0.5

// add to map
L.geoJson(reach1, {style: polyfill(reach1, col=getColor(l9s, l9_s0))}).addTo(map);
L.geoJson(reach2, {style: polyfill(reach1, col=getColor(l8s, l8_s0))}).addTo(map);
L.geoJson(reach3, {style: polyfill(reach1, col=getColor(fbs, fb_s0))}).addTo(map);
L.geoJson(reach4, {style: polyfill(reach1, col=getColor(rxs, rx_s0))}).addTo(map);
// L.geoJson(gageCams).addTo(map);

//////////////////////////////////////////////////////////////////////////////
// Function to swap coords and plot markers 
//////////////////////////////////////////////////////////////////////////////
function plot_marker(array, msg = gage_msg){
    nw_ary = [array[1], array[0]];
    var mrkr = L.marker(nw_ary).addTo(map)
    mrkr.bindPopup(msg).openPopup();
}

//////////////////////////////////////////////////////////////////////////////
// Swap coords and plot markers 
//////////////////////////////////////////////////////////////////////////////
cam_msg = "<b>USGS</b><br>Camera" 
both_msg = "<b>USGS</b><br>Streamgage and Camera" 
gage_msg = "<b>USGS</b><br>Streamgage" 

plot_marker(gageCams.features[0].geometry.coordinates, msg = both_msg)
plot_marker(gageCams.features[1].geometry.coordinates)
plot_marker(gageCams.features[2].geometry.coordinates, msg = both_msg)
plot_marker(gageCams.features[3].geometry.coordinates)
plot_marker(gageCams.features[4].geometry.coordinates, msg = both_msg)
plot_marker(gageCams.features[5].geometry.coordinates, msg = cam_msg)
plot_marker(gageCams.features[6].geometry.coordinates, msg = cam_msg)
plot_marker(gageCams.features[7].geometry.coordinates, msg = cam_msg)

