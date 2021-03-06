// ------------------------------------------------------------------------------
// ----- Ice Jam Monitoring -----------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2018 Martyn Smith - USGS NY WSC

// authors:  Martyn J. Smith - USGS NY WSC

// purpose:  Ice Jam Monitoring

// updates:
// 10.27.2018 - MJS - Created

//CSS imports
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import 'leaflet/dist/leaflet.css';
import 'marker-creator/stylesheets/markers.css';
import 'marker-creator/stylesheets/markers.css';
import 'select2/dist/css/select2.css';
import './styles/main.css';

//ES6 imports
import 'bootstrap/js/dist/util';
import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/tab';
import 'select2';

import * as d3 from 'd3';
import moment from 'moment';
import Highcharts from 'highcharts';
import addExporting from "highcharts/modules/exporting";
addExporting(Highcharts)
import { map, control, tileLayer, featureGroup, geoJSON, Icon } from 'leaflet';
import { basemapLayer, dynamicMapLayer } from 'esri-leaflet';
import 'leaflet-easybutton';

//START user config variables
var MapX = '-73.90'; //set initial map longitude
var MapY = '42.825'; //set initial map latitude
var MapZoom = 12; //set initial map zoom
var sitesURL = './sitesGeoJSON.json';
var mohawkBoundaryURL = './mohawkBoundary.json';
var siteList = [];
var featureCollection;
var parameterList = [];
var NWISivURL = 'https://nwis.waterservices.usgs.gov/nwis/iv/';
var categories = ["MOHAWK RIVER AT LOCK 8 NEAR SCHENECTADY NY", "MOHAWK RIVER AT FREEMAN'S BRIDGE AT SCHENECTADY NY", "MOHAWK RIVER AT REXFORD NY", "MOHAWK RIVER AT VISCHER FERRY DAM NY"];
//END user config variables 

//START global variables
var theMap;
var baseMapLayer, basemaplayerLabels;
var weatherLayer = {};
var svg, g;
var mainChart;
var sitesGeoJSON, boundaryGeoJSON;

//END global variables

//instantiate map
$(document).ready(function () {
  console.log('Application Information: ' + process.env.NODE_ENV + ' ' + 'version ' + VERSION);
  $('#appVersion').html('Application Information: ' + process.env.NODE_ENV + ' ' + 'version ' + VERSION);

  Icon.Default.imagePath = './images/';

  //create map
  theMap = map('mapDiv', { attributionControl: false, zoomControl: false, minZoom: 12, });

  // L.easyButton('fa-home fa-2x',function(btn,map){
  //   map.setView([MapY, MapX], MapZoom);
  // },'Zoom To Home').addTo(theMap);

  // make a bar with the buttons
var zoomBar = L.easyBar([
  L.easyButton( 'fa-plus',  function(control, map){map.setZoom(map.getZoom()+1);}),
  L.easyButton( 'fa-home', function(control, map){map.setView([MapY, MapX], MapZoom);}),
  L.easyButton( 'fa-minus',  function(control, map){map.setZoom(map.getZoom()-1);})
]);

// add it to the map
zoomBar.addTo(theMap);

  //create svg div
  svg = d3.select("#graphContainer").append("svg").attr('width',$('#mapDiv').width());
  g = svg.append("g").attr("class", "d3chart");	
  g.append("path");

  //add zoom control with your options
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
  //sitesLayer = featureGroup().addTo(theMap);

  loadSites();


  //https://bost.ocks.org/mike/leaflet/

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

  // sitesLayer.on('click', function (e) {
  //   //openPopup(e)
  // });

  $('#mainChartScaleToggle').click(function () {

    if ($(this).is(':checked')) {
      mainChart.yAxis[0].update({
        min:null,
        max:null
      });
    }
    else {
      mainChart.yAxis[0].update({
        min:5,
        max:30
      });
    }
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

function showGraph(time,categories,seriesData,graphContainer) {
  //console.log('showGraph:',categories,seriesData);

  //chart init object
  var chartSetup = {

		title:{
			text:'Observed and Expected Gage Heights ' + new Date(time).toLocaleString()
		},
		credits: {
			enabled: false
    },
    tooltip: {
      shared: true
    },
		xAxis: {
      categories: categories,
      labels: {
        align:'center',
        formatter: function() {
          return '<div style="text-align:center;">' + this.value + '</div>';
        },
        useHTML: true
      }
    },
    yAxis: {
      title: { 
        text: 'Gage height, ft'
      },
      min: 5,
      max: 30
    },
		series: seriesData
  };

  mainChart = Highcharts.chart(graphContainer, chartSetup);
}

function showGraphAllData(startTime,seriesData,graphContainer) {
  //console.log('seriesData',startTime,seriesData);

  //clear out graphContainer
  $('#' + graphContainer).html('');

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
      zoomType: 'x',
      events: {
        load: function () {
          //once map is loaded, sent most recent value to mainChart
          console.log('big chart loaded');
          var seriesData = [
            {
              data: [ 
                {name: "MOHAWK RIVER AT LOCK 8 NEAR SCHENECTADY NY", y: null},
                {name: "MOHAWK RIVER AT FREEMAN'S BRIDGE AT SCHENECTADY NY", y: null},
                {name: "MOHAWK RIVER AT REXFORD NY", y:null},
                {name: "MOHAWK RIVER AT VISCHER FERRY DAM NY", y:null}
              ],
              displayName:'Gage height, ft',
              name:'Gage height (observed)' 
            },
            {
              data: [ 
                {name: "MOHAWK RIVER AT LOCK 8 NEAR SCHENECTADY NY", y: null},
                {name: "MOHAWK RIVER AT FREEMAN'S BRIDGE AT SCHENECTADY NY", y: null},
                {name: "MOHAWK RIVER AT REXFORD NY", y:null},
                {name: "MOHAWK RIVER AT VISCHER FERRY DAM NY", y:null}
              ],
              displayName:'Difference between observed and predicted water surface elevation, feet',
              name:'Gage height (expected)'  
            }
          ];
          //var categories = [];
          var value,time;
          $(this.series).each(function (i, series) {

            //get index of last value
            var index = series.data.length - 1;
            time = series.data[index].x;
            value = series.data[index].y;

            var name = series.name.split('|');

            $(seriesData).each(function (i, seriesObj) {
              if (seriesObj.displayName.trim() === name[1].trim()) {

                //another loop over data array
                $(seriesObj.data).each(function (i, dataObj) {

                  if (dataObj.name === name[0].trim() ) {
                    dataObj.y = value;
                  }
                
                });
              }
            });

            //if (categories.indexOf(name[0].trim()) === -1) categories.push(name[0].trim());
          });

          for (var i = 0; i < categories.length; i++) {       
  
            var difference;
            
            //check for null values
            if (!seriesData[0].data[i].y == null || seriesData[1].data[i].y == null) {      
              categories[i] = seriesData[1].data[i].name;
              break;
            }
            else difference = (seriesData[0].data[i].y - seriesData[1].data[i].y).toFixed(2);

            if (difference < 0.5)                      categories[i] = '<icon class="graphIcon wmm-square wmm-008000 wmm-icon-noicon wmm-icon-black wmm-size-25 wmm-borderless">' + difference + '</icon><br><span>' + seriesData[0].data[i].name + '</span>';
            if (difference >= 0.5 && difference < 2.5) categories[i] = '<icon class="graphIcon wmm-square wmm-ffff00 wmm-icon-noicon wmm-icon-black wmm-size-25 wmm-borderless">' + difference + '</icon><br><span>' + seriesData[0].data[i].name + '</span>';
            if (difference >= 2.5)                     categories[i] = '<icon class="graphIcon wmm-square wmm-ff0000 wmm-icon-noicon wmm-icon-black wmm-size-25 wmm-borderless">' + difference + '</icon><br><span>' + seriesData[0].data[i].name + '</span>';

          }

          //console.log(time,categories,seriesData);

          showGraph(time,categories,seriesData,'graphContainer');
          setTimeout(function(){ updateMap(categories,seriesData);}, 500);
          
        }
      }
    },
    plotOptions: {
      series: {
        pointStart: startTime,
        pointInterval: 900000, //15 minutes
        point: {
          events: {
            mouseOver: function () {

              //special function for reloading middle graph with mouse-over date
              var seconds = this.x;
              var time = new Date(seconds).toLocaleString();
              var seriesData = [
                {
                  data: [ 
                    {name: "MOHAWK RIVER AT LOCK 8 NEAR SCHENECTADY NY", y: null},
                    {name: "MOHAWK RIVER AT FREEMAN'S BRIDGE AT SCHENECTADY NY", y: null},
                    {name: "MOHAWK RIVER AT REXFORD NY", y:null},
                    {name: "MOHAWK RIVER AT VISCHER FERRY DAM NY", y:null}
                  ],
                  displayName:'Gage height, ft',
                  name:'Gage height (observed)' 
                },
                {
                  data: [ 
                    {name: "MOHAWK RIVER AT LOCK 8 NEAR SCHENECTADY NY", y: null},
                    {name: "MOHAWK RIVER AT FREEMAN'S BRIDGE AT SCHENECTADY NY", y: null},
                    {name: "MOHAWK RIVER AT REXFORD NY", y:null},
                    {name: "MOHAWK RIVER AT VISCHER FERRY DAM NY", y:null}
                  ],
                  displayName:'Difference between observed and predicted water surface elevation, feet',
                  name:'Gage height (expected)' 
                }
              ];
              //var categories = [];
              var value = null;
              $(this.series.chart.series).each(function (i, series) {
                var name = series.name.split('|');
  
                //search for and only add exact time matched data
                $(series.data).each(function (i, item) {
                  if (item.x === seconds) {
                    value = item.y;

                    $(seriesData).each(function (i, seriesObj) {
                      if (seriesObj.displayName.trim() === name[1].trim()) {
        
                        //another loop over data array
                        $(seriesObj.data).each(function (i, dataObj) {

                          if (dataObj.name === name[0].trim() ) {
                            dataObj.y = value;
                          }
                        
                        });
                      }
                    });

                  }
                });

                //if (categories.indexOf(name[0].trim()) === -1) categories.push(name[0].trim());
              });

              //some logic for added a colored label based on difference to X-axis labels
              for (var i = 0; i < categories.length; i++) {       
                
                //check if either of the comparison values are null
                if (!seriesData[0].data[i].y == null || seriesData[1].data[i].y == null) { 

                  //if null, set the category to just text     
                  categories[i] = seriesData[1].data[i].name;
                  continue;
                }

                var difference = (seriesData[0].data[i].y - seriesData[1].data[i].y).toFixed(2);

                
    
                if (difference < 0.5)                      categories[i] = '<icon class="graphIcon wmm-square wmm-008000 wmm-icon-noicon wmm-icon-black wmm-size-25 wmm-borderless">' + difference + '</icon><br><span>' + seriesData[0].data[i].name + '</span>';
                if (difference >= 0.5 && difference < 2.5) categories[i] = '<icon class="graphIcon wmm-square wmm-ffff00 wmm-icon-noicon wmm-icon-black wmm-size-25 wmm-borderless">' + difference + '</icon><br><span>' + seriesData[0].data[i].name + '</span>';
                if (difference >= 2.5)                     categories[i] = '<icon class="graphIcon wmm-square wmm-ff0000 wmm-icon-noicon wmm-icon-black wmm-size-25 wmm-borderless">' + difference + '</icon><br><span>' + seriesData[0].data[i].name + '</span>';

                //console.log(categories[i],seriesData[0].data[i].y, seriesData[1].data[i].y,difference)
    
              }

              mainChart.xAxis[0].setCategories(categories);

              mainChart.series[0].update(seriesData[0],false);
              mainChart.series[1].update(seriesData[1],true);
              mainChart.setTitle({text: 'Observed and Expected Gage Heights ' + time});
              updateMap(categories,seriesData);
            }
          }
        },
        events: {
            // mouseOut: function () {
                
            // }
        }
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

	var chart = Highcharts.chart(graphContainer, chartSetup);
  
  // update colors
  // https://www.highcharts.com/demo/combo-multi-axes
  // https://stackoverflow.com/questions/12419758/changing-series-color-in-highcharts-dynamically
  // https://stackoverflow.com/questions/17837340/highcharts-dynamically-change-axis-title-color

  $('#graph-loading').hide();

}

function updateMap(categories, seriesData) {

  //console.log('in updateMap',categories,seriesData);

  for (var i = 0; i < categories.length; i++) {

    var category;
    if (categories[i].indexOf('<span>') !== -1) category = categories[i].split('<span>')[1].split('</span>')[0];
    else category = categories[i];

    boundaryGeoJSON.eachLayer(function (layer) {  
      //console.log('here',layer)
  
      //console.log("TEST",categories[i],layer.feature.properties.siteName);
      if(layer.feature.properties.siteName === category) {    
        

        //check if either of the comparison values are null
        if (!seriesData[0].data[i].y == null || seriesData[1].data[i].y == null) { 
          boundaryGeoJSON.resetStyle(layer);
        }

        else {

          var difference = seriesData[0].data[i].y - seriesData[1].data[i].y;
          //console.log("MATCH", difference);
          if (difference < 0.5)                      layer.setStyle({color :'green'});
          if (difference >= 0.5 && difference < 2.5) layer.setStyle({color :'yellow'});
          if (difference >= 2.5)                     layer.setStyle({color :'red'});

        }
      }
    });

    //console.log('111111',sitesGeoJSON)
    sitesGeoJSON.eachLayer(function (layer) {  
      //console.log('here2222',layer)
  
      //console.log("TEST",categories[i],layer.feature.properties.siteName);
      if(layer.feature.properties.siteName === category) {    

        var classString;
        
        if (!seriesData[0].data[i].y == null || seriesData[1].data[i].y == null) { 
          classString = 'wmm-pin wmm-white wmm-icon-triangle wmm-icon-black wmm-size-25';
        }

        else {
          var difference = seriesData[0].data[i].y - seriesData[1].data[i].y;

          if (difference < 0.5)                      classString = 'wmm-pin wmm-008000 wmm-icon-triangle wmm-icon-black wmm-size-25';
          if (difference >= 0.5 && difference < 2.5) classString = 'wmm-pin wmm-ffff00 wmm-icon-triangle wmm-icon-black wmm-size-25';
          if (difference >= 2.5)                     classString = 'wmm-pin wmm-ff0000 wmm-icon-triangle wmm-icon-black wmm-size-25';

        }

        //var icon = L.divIcon({ className: classString,html: 2.2 });
        var icon = L.divIcon({ className: classString });
        layer.setIcon(icon);
      }
    });
  }
}

function addToLegend(text, classString) {
  //console.log('adding to legend:',text,classString)

  var id = text.replace(/\s+/g, '-').toLowerCase();

  if (document.getElementById(id) === null) {
    $('#legend > tbody').append('<tr id="' + id + '" class="site"><td><div><icon class="siteIcon ' + classString + '" /></div></td><td class="siteData"><span class="siteName">' + text + '</span></td></tr>');
    $('#legend .siteIcon').attr('style', 'margin-top: -6px !important;');
  }
}

function loadSites() {
  console.log('in loadsites');

  //first load mohawk boundary geoJSON
  $.ajax({
    url: mohawkBoundaryURL,
    dataType: 'json',
    success: function (data) {
      boundaryGeoJSON = geoJSON(data, {
        style: function(feature) {
          return {
            weight: 2,
            opacity: 1,
            dashArray: '3',
            fillOpacity: 1
          };
        }
      }).addTo(theMap);
    }
  });

  //then load sites geojson
  $.ajax({
    url: sitesURL,
    dataType: 'json',
    success: function (data) {

      featureCollection = data;

      //get list of siteIDs
      siteList = featureCollection.features.filter(function(item) {
        return (item.properties.siteType === 'gage');
      }).map(function(obj) { return obj.properties.siteID; }).join(',');

      console.log('site list:',siteList);

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

            //add legend
            var legend = L.control({position: 'bottomright'});
            legend.onAdd = function (theMap) {
            
                var div = L.DomUtil.create('div', 'info map-legend');
                div.innerHTML += '<table id="legend" class="table table-borderless mb-0"><tbody></tbody></table>';
                return div;
            };
            
            legend.addTo(theMap);
                                    
            sitesGeoJSON = geoJSON(featureCollection, {
              pointToLayer: function (feature, latlng) {

                var classString = 'wmm-pin wmm-white wmm-icon-triangle wmm-icon-black wmm-size-25';
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

                if (feature.properties.ahpsURL && feature.properties.ahpsURL.length > 0) {
                  popupContent += '<br><b>NWS AHPS: </b><a href="' + feature.properties.ahpsURL + '" target="_blank">link</a>';
                }

                if (feature.properties.photoURL && feature.properties.photoURL.length > 0) {
                  popupContent += '<br><b>Site photo (static): </b><a href="' + feature.properties.photoURL + '" target="_blank">link</a>';
                }

                if (feature.properties.webcamURL && feature.properties.webcamURL.length > 0) {
                  popupContent += '<br><b>Webcam photo (live):</b><a href="' + feature.properties.webcamLink + '" target="_blank"><img style="width:100%;" src="' + feature.properties.webcamURL + '"/></a>';
                }

                $.each(feature.properties, function (key, value) {
                  var pcode = key.split(':')[0];
                  if (/^\d+$/.test(pcode) && pcode.length === 5) {
                    //console.log('PCODE',pcode,value)
                    var d = new Date(value.dateTime);
                    var n = d.toLocaleString();
                    popupContent += '<br><b>' + value.name + ' (' + n + '): </b>' + value.value;
                  }
              
                });

                //if (feature.properties.siteType === 'gage') popupContent += '<br><h5><span class="openGraphingModule ml-2 badge badge-success" data-sitename="' + feature.properties.siteName + '" data-siteid="' + feature.properties.siteID + '" >Get Data</span></h5>';

                layer.bindPopup(popupContent);

                //console.log('feature:',feature.properties)
              }
            }).addTo(theMap);

            addToLegend("No backwater from ice", "wmm-square wmm-008000 wmm-icon-noicon wmm-icon-black wmm-size-25 wmm-borderless");
            addToLegend("Moderate backwater from ice", "wmm-square wmm-ffff00 wmm-icon-noicon wmm-icon-black wmm-size-25 wmm-borderless");
            addToLegend("Significant backwater from ice", "wmm-square wmm-ff0000 wmm-icon-noicon wmm-icon-black wmm-size-25 wmm-borderless");
          
            //sitesLayer.addLayer(geoJSONlayer);
            
            //initializeFilters(featureCollection);

            // call a function on complete 
            $('#loading').hide();
            $('#legend').show();
      });

      //get historical NWIS data
      //$.getJSON(NWISivURL, {

      $.getJSON('./testData.json', {
          dataType: 'json'
          // sites: siteList,
          // startDt: '2018-01-10',
          // endDT: '2018-02-10',
          // parameterCd: '00065,99067'
        }, function success(data) {
            console.log('NWIS historical IV Data:',data);

            var seriesData = [];
     
            if (data.value.timeSeries.length <= 0) {
              alert('Found an NWIS site [' + siteIDs + '] but it had no data in waterservices for [' +  parameterCodes + ']');
              $('#graph-loading').hide();
              return;
            }

            var startTime = data.value.queryInfo.criteria.timeParam.beginDateTime;   
        
            $(data.value.timeSeries).each(function (i, siteParamCombo) {

              $(siteParamCombo.values).each(function (i, value) {

                //temp func to populate fake data array
                var site = siteParamCombo.name.split(':');
                if (site[2] === '99067') {
                  $(data.value.timeSeries).each(function (i, test) {
                    //look for gage height for same station id
                    var lookupsite = test.name.split(':');

                    //if we have the matching site
                    if (site[1] === lookupsite[1] && lookupsite[2] === '00065') {
                      //console.log('lookupsite', site[1],site[2],lookupsite[1],lookupsite[2]);

                      //console.log(test.values[0])
                      $(test.values[0].value).each(function (i,val) {
                        var num = Math.floor(Math.random()*5) + 0.1;
                        //console.log(num,val)
                        var newObj = JSON.parse(JSON.stringify(val));
                        newObj.value = val.value/1 - num;
                        value.value.push(newObj);
                      })
                    }
                  });
                }

                //console.log('herenow',siteParamCombo)

                var valueArray = value.value.map(function(item) {
                  var seconds = new Date(item.dateTime)/1;
                  //return item.value/1;
                  return [seconds,item.value/1];
                });

                //make sure we bail from loop if there is no data
                if (valueArray.length === 0) return;

                var name;
                if (value.method[0].methodDescription.length > 0) name = siteParamCombo.sourceInfo.siteName + ' | ' + $('<div>').html(siteParamCombo.variable.variableName).text() + ' | ' + value.method[0].methodDescription;
                else name = siteParamCombo.sourceInfo.siteName + ' | ' + $('<div>').html(siteParamCombo.variable.variableName).text();
          
                var series = {
                  showInLegend: true,
                  values: value,
                  data: valueArray,
                  color: getRandomColor(),
                  siteID: siteParamCombo.sourceInfo.siteCode[0].value,
                  siteName: siteParamCombo.sourceInfo.siteName,
                  siteCode: siteParamCombo.name,
                  variableDescription: siteParamCombo.variable.variableDescription,
                  variableName: siteParamCombo.variable.variableName,
                  unit: siteParamCombo.variable.unit.unitCode,
                  name:name,
                };
              
                seriesData.push(series);
              });
            });

            showGraphAllData(startTime,seriesData, 'graphContainer2');

      });    
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