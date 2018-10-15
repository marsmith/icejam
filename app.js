// ------------------------------------------------------------------------------
// ----- HRECOS -----------------------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2018 Martyn Smith - USGS NY WSC

// authors:  Martyn J. Smith - USGS NY WSC

// purpose:  HABS Data Viewer

// updates:
// 08.07.2018 - MJS - Created

//CSS imports
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import 'leaflet/dist/leaflet.css';
import 'marker-creator/stylesheets/markers.css';
import 'select2/dist/css/select2.css';
import './styles/main.css';

//ES6 imports
import 'bootstrap/js/dist/util';
import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/tab';
import 'select2';
import moment from 'moment'
import Highcharts from 'highcharts';
import addExporting from "highcharts/modules/exporting";
addExporting(Highcharts)
import { map, control, tileLayer, featureGroup, geoJSON, Icon } from 'leaflet';
import { basemapLayer, dynamicMapLayer } from 'esri-leaflet';

//START user config variables
var MapX = '-73.92'; //set initial map longitude
var MapY = '42.825'; //set initial map latitude
var MapZoom = 12; //set initial map zoom
var sitesURL = './sitesGeoJSON.json';
var mohawkBoundaryURL = './mohawkBoundary.json';
var siteList = [];
var featureCollection;
var parameterList = [];
var NWISivURL = 'https://nwis.waterservices.usgs.gov/nwis/iv/';
//END user config variables 

//START global variables
var theMap;
var baseMapLayer, basemaplayerLabels;
var weatherLayer = {};
var NWISmarkers = {};
var sitesLayer;

//END global variables

//instantiate map
$(document).ready(function () {
  console.log('Application Information: ' + process.env.NODE_ENV + ' ' + 'version ' + VERSION);
  $('#appVersion').html('Application Information: ' + process.env.NODE_ENV + ' ' + 'version ' + VERSION);

  Icon.Default.imagePath = './images/';

  //create map
  theMap = map('mapDiv', { attributionControl: false, zoomControl: false, minZoom: 8, });

  //add zoom control with your options
  control.zoom({ position: 'topright' }).addTo(theMap);
  control.scale().addTo(theMap);

  //basemap
  baseMapLayer = tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
  }).addTo(theMap);

  weatherLayer.NexRad = tileLayer('https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png', {opacity : 0.5 });
  weatherLayer.Precip = tileLayer('https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/q2-n1p-900913/{z}/{x}/{y}.png', {opacity : 0.5 });
  weatherLayer.PrecipForecast1hr = dynamicMapLayer({url: 'https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/wpc_qpf/MapServer', layers: [7], opacity : 0.5 });
  weatherLayer.CloudCoverVisible = tileLayer('https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/goes-vis-1km-900913/{z}/{x}/{y}.png', {opacity : 0.5 });
  weatherLayer.Drought = tileLayer.wms('http://ndmc-001.unl.edu:8080/cgi-bin/mapserv.exe?map=/ms4w/apps/usdm/service/usdm_current_wms.map', {layers : 'usdm_current', bboxSR: 102100, imageSR: 102100, format: 'image/png', transparent: true, f: 'image', nocache: Date.now(), opacity : 0.5});

  //set initial view
  theMap.setView([MapY, MapX], MapZoom);

  //define layers
  sitesLayer = featureGroup().addTo(theMap);

  loadSites();

  /*  START EVENT HANDLERS */
  $('.weatherBtn').click(function () {
    $(this).toggleClass('slick-btn-selection');
    var lyrID = this.id.replace('btn', '');
    setWeatherLayer(lyrID);
  });

  $('.basemapBtn').click(function () {
    $('.basemapBtn').removeClass('slick-btn-selection');
    $(this).addClass('slick-btn-selection');
    var baseMap = this.id.replace('btn', '');
    setBasemap(baseMap);
  });

  $('#mobile-main-menu').click(function () {
    $('body').toggleClass('isOpenMenu');
  });

  $('#resetView').click(function () {
    resetView();
  });

  $('#aboutButton').click(function () {
    $('#aboutModal').modal('show');
  });

  $('#showGraph').click(function () {
    getData();
  });

  $('#downloadData').click(function () {
    downloadData();
  });

  sitesLayer.on('click', function (e) {
    //openPopup(e)
  });

  /*  END EVENT HANDLERS */

});

String.prototype.trim = function() {
  return this.replace(/^\s+|\s+$/g, '');
};

function openPopup(e) {

  console.log('properties',e)
  var popup = L.popup({  }).setLatLng(e.latlng);
  var popupContent = '<b>Site Number: </b><a href="https://waterdata.usgs.gov/nwis/inventory/?site_no=' + e.layer.data.siteCode + '" target="_blank">' + e.layer.data.siteCode + '</a><br>';
  popupContent += '<b>Station Name: </b>' + e.layer.data.siteName + '<br>';

  popup.setContent(popupContent).openOn(theMap);

}


function openGraphingModule() {
  $('#graphModal').modal('show');
}

function downloadData() {
  
  if (seriesData) {
    $(seriesData).each(function (i, data) {
      
      if (data) {
  
        // start CSV file
        var csvData = [];
        csvData.push('Site Name,"' + data.siteName + '"');
        csvData.push('Site ID,"' + data.siteID + '"');
        csvData.push('Description,"' + data.variableDescription + '"');
        csvData.push('');

        csvData.push('Time,Value');

        $(data.values).each(function (i, value) {
            csvData.push(value.dateTime + ',' + value.value);
        });
    
        //console.log(csvData);
        
        csvData = csvData.join('\n');
    
        var filename = data.siteCode.replace(':','_') + '.csv';
        downloadFile(csvData,filename);
      }
    
      else {
        alert('No data to export');
      }
    });

  }
  else {
    alert('No data to export');
  }

}

function downloadFile(data,filename) {
	var blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
	if (navigator.msSaveBlob) { // IE 10+
		navigator.msSaveBlob(blob, filename);
	} else {
		var link = document.createElement('a');
		var url = URL.createObjectURL(blob);
		if (link.download !== undefined) { // feature detection
			// Browsers that support HTML5 download attribute
			link.setAttribute('href', url);
			link.setAttribute('download', filename);
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
		else {
			window.open(url);
		}
	}
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function showGraph(startTime,seriesData) {
  console.log('seriesData',startTime,seriesData);

  //clear out graphContainer
  $('#graphContainer').html('');

  //if there is some data, show the div
  $('#graphModal').modal('show');

	Highcharts.setOptions({
		global: { useUTC: false },
		lang: { thousandsSep: ','}
  });
  
  //chart init object
  var chartSetup = {
		chart: {
			type: 'line',
			spacingTop: 20,
			spacingLeft: 0,
			spacingBottom: 0,
    },
    plotOptions: {
      series: {
        pointStart: startTime,
        pointInterval: 900000 //15 minutes
      }
    },
		title:{
			text:''
		},
		credits: {
			enabled: false
    },
    tooltip: {
      shared: true
    },
		xAxis: {
			type: "datetime",
			labels: {
				formatter: function () {
					return Highcharts.dateFormat('%m/%d %H%P', this.value);
				},
				//rotation: 90,
				align: 'center',
				tickInterval: 172800 * 1000
			}
    },
		yAxis: [],
		series: []
  };


  //loop over series data so we can match up the axis and series indexes
  $(seriesData).each(function (i, obj) {
    var yaxis =   {
      title: { 
        text: obj.unit,
        style: {
          color: obj.color
        }
      },
      labels: {
        style: {
            color: obj.color
        }
      },
      //put odd items on opposite axis
      opposite: isOdd(i)
    };


    //need another loop to check if this series unit aleady has yaxis
    //NOT WORKING RIGHT

    //LOOP OVER ALLDATA TO GET MAX AND MIN TO SET YAXIS
    // https://www.highcharts.com/demo/combo-regression

    var exists = false;
    $(chartSetup.yAxis).each(function (i, data) { 
      if (data.title.text == obj.unit) exists = true;
    });

    if (!exists) { 
      obj.yAxis = i;
      chartSetup.yAxis.push(yaxis);
    }

    // obj.yAxis = i;
    // chartSetup.yAxis.push(yaxis);
    //console.log('here',obj)
    
    chartSetup.series.push(obj);
    
  });

	var chart = Highcharts.chart('graphContainer', chartSetup);
  
  // update colors
  // https://www.highcharts.com/demo/combo-multi-axes
  // https://stackoverflow.com/questions/12419758/changing-series-color-in-highcharts-dynamically
  // https://stackoverflow.com/questions/17837340/highcharts-dynamically-change-axis-title-color

  $('#graph-loading').hide();

}

function addToLegend(text, classString) {
  console.log('adding to legend:',text,classString)

  var id = text.replace(/\s+/g, '-').toLowerCase();

  if (document.getElementById(id) === null) {
    $('#legend > tbody').append('<tr id="' + id + '" class="site"><td><div><icon class="siteIcon ' + classString + '" /></div></td><td class="siteData"><span class="siteName">' + text + '</span></td></tr>');
    $('#legend .siteIcon').attr('style', 'margin-top: -6px !important; margin-left: 3px !important');
  }
}

function getColor(siteID) {
  return siteID === '01354330' ? '#1b9e77' :
         siteID === '01355475' ? '#d95f02' :
         siteID === '01354500' ? '#7570b3' :
                                 '#FFEDA0';
}

function loadSites() {
  console.log('in loadsites');


  $.ajax({
    url: mohawkBoundaryURL,
    dataType: 'json',
    success: function (data) {
      geoJSON(data, {
        style: function(feature) {
          return {
            weight: 2,
            opacity: 1,
            color: getColor(feature.properties.siteID),
            dashArray: '3',
            fillOpacity: 1
          };
        }
      }).addTo(theMap);
    }
  });


  $.ajax({
    url: sitesURL,
    dataType: 'json',
    success: function (data) {

      featureCollection = data;

      //get list of siteIDs
      siteList = featureCollection.features.filter(function(item) {
        return (item.properties.siteType === 'gage');
      }).map(function(obj) { return obj.properties.siteID; }).join(',');

      console.log('here2',siteList)

      //get most recent NWIS data
      $.getJSON(NWISivURL, {
          format: 'json',
          sites: siteList,
        }, function success(data) {
            console.log('NWIS IV Data:',data);

            var idx = 1;

            //we need to add new NWIS data as geoJSON featureCollection attributes
            featureCollection.features.forEach(function (feature) {
              var found = false;

              data.value.timeSeries.forEach(function (NWISdata) {
                var site_data = NWISdata.name.split(':');
                var siteID = site_data[1];
                var pcode = site_data[2];
                var pcode_tsid = '';

                if (siteID === feature.properties['siteID']) {
                  found = true;

                  NWISdata.values.forEach(function (TSID) {
                    pcode_tsid = pcode + ':' + TSID.method[0].methodID;

                    var description;
                    if (TSID.method[0].methodDescription.length > 0) description = NWISdata.variable.variableDescription + ', ' + TSID.method[0].methodDescription;
                    else description = NWISdata.variable.variableDescription;

                    var parameterObj = {
                      "idx": String(idx),
                      "pcode": pcode,
                      "desc": NWISdata.variable.variableDescription
                    };

                    //push to parameter list if we don't have it yet
                    if (!parameterList.some(item => item.pcode === pcode)) {
                      parameterList.push(parameterObj);
                      idx+=1;
                    }

                    if (!(pcode_tsid in feature.properties) ) {
                      feature.properties[pcode_tsid] = {};
                      feature.properties[pcode_tsid].value = TSID.value[0].value;
                      feature.properties.dateTime = TSID.value[0].dateTime;
                      feature.properties[pcode_tsid].dateTime = TSID.value[0].dateTime;
                      feature.properties[pcode_tsid].qualifiers = TSID.value[0].qualifiers;
                      feature.properties[pcode_tsid].description = description;
                      feature.properties[pcode_tsid].name = NWISdata.variable.variableName + ', ' + TSID.method[0].methodDescription;
                    }
                  });
                }
              });
              if (!found) console.log('no data found for:',feature.properties['siteID'])  
            });
            
            var geoJSONlayer = geoJSON(featureCollection, {
              pointToLayer: function (feature, latlng) {

                var classString = 'wmm-pin wmm-orange wmm-icon-triangle wmm-icon-black wmm-size-25';
                var text = 'USGS Gage';

                if (feature.properties.siteType === 'webcam') {
                  classString = 'wmm-circle wmm-blue wmm-icon-noicon wmm-icon-white wmm-size-25';
                  text = 'USGS Webcam';
                }
          
                addToLegend(text, classString);
          
                var icon = L.divIcon({ className: classString });
                return L.marker(latlng, { icon: icon });
              },
              onEachFeature: function(feature, layer) {
                var popupContent = '<b>Site ID: </b><a href="https://waterdata.usgs.gov/nwis/uv/?site_no=' + feature.properties.siteID + '" target="_blank">' + feature.properties.siteID + '</a><br><b>Station Name:</b> ' + feature.properties.siteName;

                if (feature.properties.photoURL && feature.properties.photoURL.length > 0) {
                  popupContent += '<br><b>Site photo (static): </b><a href="' + feature.properties.photoURL + '" target="_blank">link</a>';
                }

                if (feature.properties.webcamURL && feature.properties.webcamURL.length > 0) {
                  popupContent += '<br><b>Webcam photo (live):</b><a href="' + feature.properties.webcamLink + '" target="_blank"><img style="width:100%;" src="' + feature.properties.webcamURL + '"/></a>';
                }

                if (feature.properties.siteType === 'gage') popupContent += '<br><h5><span class="openGraphingModule ml-2 badge badge-success" data-sitename="' + feature.properties.siteName + '" data-siteid="' + feature.properties.siteID + '" >Get Data</span></h5>';

                layer.bindPopup(popupContent);

                console.log('feature:',feature.properties)
              }
            });
          
            sitesLayer.addLayer(geoJSONlayer);
            
            //initializeFilters(featureCollection);

            // call a function on complete 
            $('#loading').hide();
            $('#legend').show();
      });

      // $('#loading').hide();
      // $(data).find('site').each(function(){

      //   var classString = 'wmm-pin wmm-mutedblue wmm-icon-circle wmm-icon-white wmm-size-25';
      //   var icon = L.divIcon({ className: classString });

      //   var siteID = $(this).attr('sno');
      //   var siteName = $(this).attr('sna');
      //   var lat = $(this).attr('lat');
      //   var lng = $(this).attr('lng');
      //   console.log('Site found:',siteID,siteName,lat,lng)
      //   NWISmarkers[siteID] = L.marker([lat, lng], {icon: icon});
      //   NWISmarkers[siteID].data = {siteName:siteName,siteCode:siteID};
      //   NWISmarkers[siteID].data.parameters = {};

      //   //add point to featureGroup
      //   sitesLayer.addLayer(NWISmarkers[siteID]);

      // });

      // theMap.fitBounds(sitesLayer.getBounds());
      

    }
  });
}

function setWeatherLayer(layer) {

  var layerName = weatherLayer[layer];
  
  //first check if weve added this already
  if(theMap.hasLayer(layerName)) theMap.removeLayer(layerName)
  else theMap.addLayer(layerName);
}

function setBasemap(baseMap) {

  switch (baseMap) {
    case 'Streets': baseMap = 'Streets'; break;
    case 'Satellite': baseMap = 'Imagery'; break;
    case 'Clarity': baseMap = 'ImageryClarity'; break;
    case 'Topo': baseMap = 'Topographic'; break;
    case 'Terrain': baseMap = 'Terrain'; break;
    case 'Gray': baseMap = 'Gray'; break;
    case 'DarkGray': baseMap = 'DarkGray'; break;
    case 'NatGeo': baseMap = 'NationalGeographic'; break;
  }

  if (baseMapLayer) theMap.removeLayer(baseMapLayer);
  baseMapLayer = basemapLayer(baseMap);
  theMap.addLayer(baseMapLayer);
  if (basemaplayerLabels) theMap.removeLayer(basemaplayerLabels);
  if (baseMap === 'Gray' || baseMap === 'DarkGray' || baseMap === 'Imagery' || baseMap === 'Terrain') {
    basemaplayerLabels = basemapLayer(baseMap + 'Labels');
    theMap.addLayer(basemaplayerLabels);
  }
}

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
    return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
}

function isOdd(n) {
  return !!(n % 2);
}