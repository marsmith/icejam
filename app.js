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
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'
// import 'font-awesome/css/font-awesome.css';
import 'leaflet/dist/leaflet.css';
//import 'marker-creator/stylesheets/css/markers.css';
import 'select2/dist/css/select2.css';
import 'bootstrap-datepicker/dist/css/bootstrap-datepicker.css';
import './styles/markers.css'
import './styles/main.css';

//ES6 imports
import 'bootstrap/js/dist/util';
import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/tab';
import 'select2';

import moment from 'moment';
import 'moment-timezone';
import Highcharts from 'highcharts';
// import addExporting from "highcharts/modules/exporting";
// addExporting(Highcharts);
import 'bootstrap-datepicker';
import { map, control, tileLayer, geoJSON, Icon } from 'leaflet';
import { basemapLayer, dynamicMapLayer } from 'esri-leaflet';
import 'leaflet-easybutton';

//START user config variables
var MapX = '-73.94'; //set initial map longitude
var MapY = '42.84'; //set initial map latitude
var MapZoom = 10.5; //set initial map zoom
var sitesURL = './sitesGeoJSON.json';
var mohawkBoundaryURL = './mohawkBoundary.json';
var weatherServiceURL = 'https://api.weather.gov/gridpoints/ALY/51,65';
var mesonetServiceURL = 'https://api.nysmesonet.org/data/dynserv/timeseries2';
var siteList = [];
var featureCollection;
var parameterList = [];
var NWISivURL = 'https://nwis.waterservices.usgs.gov/nwis/iv/';
var categories = ["MOHAWK RIVER AT LOCK 9 AT ROTTERDAM JUNCTION NY", "MOHAWK RIVER AT LOCK 8 NEAR SCHENECTADY NY", "MOHAWK RIVER AT FREEMAN'S BRIDGE AT SCHENECTADY NY", "MOHAWK RIVER AT REXFORD NY", "MOHAWK RIVER AT VISCHER FERRY DAM NY"];
var observedColor = '#1F42DD';
var predictedColor = '#E23F22';
var siteColors = {
  '01354330:00065': '#1A5276',
  '01354330:99067': '#2980B9',
  '01354500:00060': '#2C3E50',
  '01354500:00065': '#BA4A00',
  '01354500:99067': '#DC7633',
  '01355475:00065': '#196F3D',
  '01355475:99067': '#229954',
  '01356000:00065': '#8E44AD'
}
//END user config variables 

//START global variables
var theMap, miniMap;
var baseMapLayer, basemaplayerLabels;
var weatherLayer = {};
var mainChart,bottomChart, weatherChart;
var sitesGeoJSON, boundaryGeoJSON;
var lastDateVal, keyboardVal,minKeyboardVal, maxKeyboardVal;

//END global variables

//instantiate map
$(document).ready(function () {
  console.log('Application Information: ' + process.env.NODE_ENV + ' ' + 'version ' + VERSION);
  $('#appVersion').html('Application Information: ' + process.env.NODE_ENV + ' ' + 'version ' + VERSION);

  Icon.Default.imagePath = './images/';

  //create map
  theMap = map('mapDiv', { attributionControl: false, zoomControl: false, zoomSnap: 0.5, minZoom: 11, });

  // make a bar with the buttons
  var zoomBar = L.easyBar([
    L.easyButton( 'fa-plus',  function(control, map){map.setZoom(map.getZoom()+1);}),
    L.easyButton( 'fa-home', function(control, map){map.setView([MapY, MapX], MapZoom);}),
    L.easyButton( 'fa-minus',  function(control, map){map.setZoom(map.getZoom()-1);})
  ]);

  // add it to the map
  zoomBar.addTo(theMap);

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


  loadSites();
  setDates();

  //testing
  getMesonetData();
  //getWeatherServiceData();


  $('.datepicker').datepicker({
    format: 'yyyy-mm-dd'
  });


  /*  START EVENT HANDLERS */
  $('.time-arrow').on('click', function () {
    if ($(this).attr('id') === 'right-arrow' && keyboardVal <= maxKeyboardVal) {
      incrementChart('right');
    }
    if ($(this).attr('id') === 'left-arrow' && keyboardVal >= minKeyboardVal) {
      incrementChart('left');
    }
  });

  $(document).keydown(function(eventObject) {

    //if this is first keyboard arrow, just get the date
    if (!keyboardVal) {
      console.error('no previous value');
      return;
    }

    //right arrow
    if (eventObject.keyCode === 39 && keyboardVal <= maxKeyboardVal) {
      incrementChart('right');
    }

    //left arrow
    if (eventObject.keyCode === 37 && keyboardVal >= minKeyboardVal) {
      incrementChart('left');
    }
  });

  $('#timePeriodSelect').select2({
    dropdownAutoWidth: true,
    minimumResultsForSearch: -1
  });

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
    loadSites();
  });

  $('#downloadData').click(function () {
    downloadData();
  });

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

function getWeatherServiceData() {

  $.ajax({
    url : weatherServiceURL,
    dataType : 'json',
    success: function(data, textStatus, jqXHR)
    {
        console.log('weather service data:', data);


        var timeInMs = Date.now();
        var timePlus48hr = timeInMs + 172800000;  //48 hours in milliseconds

        //convert times and only return forecast values within 48 hours of current time
        var tempData = data.properties.temperature.values.map(function (x) { 
          var ts = moment.utc(x.validTime.split('/')[0]).local();
          return [ts.valueOf(), Math.round((x.value * 9 / 5 + 32) * 100)/100]; //celcius to fahrenheit
        }).filter(function (x) { 
          return x[0] <= timePlus48hr; 
        }) ;

        var precipData = data.properties.quantitativePrecipitation.values.map(function (x) { 
          var ts = moment.utc(x.validTime.split('/')[0]).local();
          return [ts.valueOf(), Math.round((x.value *  0.039370078740157) * 100)/100 ]; //mm to inches/10
        }).filter(function (x) { 
          return x[0] <= timePlus48hr;  
        }) ;

        // var weatherDataFiltered = data.properties.weather.values.map(function (x) { 
        //   var ts = moment.utc(x.validTime.split('/')[0]).local();
        //   return [ts.valueOf(), x.value ]; //mm to inches/10
        // }).filter(function (x) { 
        //   return x[0] <= timePlus48hr;  
        // }) ;

        //we need to pop out any number of series for types of precip
        var rainData= [];
        var thunderData = [];
        var snowData = [];
        var sleetData = [];
        var freezingRainData = [];

        var categoryList = ['slight_chance', 'chance', 'likely', 'definite'];

        data.properties.weather.values.forEach(function(value) {
          var ts = moment.utc(value.validTime.split('/')[0]).local().valueOf();

          //bail if greater than 48 hours out
          if (ts >= timePlus48hr) return; 

          //console.log('11111', ts, value)

          var rainItem = [ts, 0];
          var thunderItem = [ts, 0];
          var snowItem = [ts, 0];
          var sleetItem = [ts, 0];
          var freezingRainItem = [ts, 0];

          //loop over possible 
          if (value.value && value.value.length > 0) {
            value.value.forEach(function(item) {

              //console.log('222222', item)

              if (item.weather) {


                //nominal category lookup
                var y_val = categoryList.indexOf(item.coverage)+1;


                //rain
                if (item.weather.indexOf('rain') !== -1) {
                  rainItem = [ts, y_val];
                }

                //thunder
                if (item.weather.indexOf('thunder') !== -1) {
                  thunderItem = [ts, y_val];
                }

                //snow
                if (item.weather.indexOf('snow') !== -1) {
                  snowItem = [ts, y_val];
                }

                //sleet
                if (item.weather.indexOf('sleet') !== -1) {
                  sleetItem = [ts, y_val];
                }

                //freezingRain
                if (item.weather.indexOf('freezing') !== -1) {
                  freezingRainItem = [ts, y_val];
                }
              }


              
            });
          }

          rainData.push(rainItem);
          thunderData.push(thunderItem);
          snowData.push(snowItem);
          sleetData.push(sleetItem);
          freezingRainData.push(freezingRainItem);


          
        });

        console.log('weatherService rainData', rainData);
        console.log('weatherService tempData', tempData);
        console.log('weatherService precipData', precipData);

        
        weatherChart.addSeries({
          name: 'Thunderstorms Likelihood (weather service)',
          type: 'column',
          data: thunderData,
          tooltip: {
            pointFormatter: function () {
              return 'Thunderstorms: ' + getProbabilityText(this.y);
            }
          }
        });

        weatherChart.addSeries({
          name: 'Rain Likelihood (weather service)',
          type: 'column',
          data: rainData,
          tooltip: {
            pointFormatter: function () {
              return 'Rain: ' + getProbabilityText(this.y);
            }
          }
        });

        weatherChart.addSeries({
          name: 'Snow Likelihood (weather service)',
          type: 'column',
          data: snowData,
          tooltip: {
            pointFormatter: function () {
              return 'Snow: ' + getProbabilityText(this.y);
            }
          }
        });
        
        weatherChart.addSeries({
          name: 'Sleet Likelihood (weather service)',
          type: 'column',
          data: sleetData,
          tooltip: {
            pointFormatter: function () {
              return 'Sleet: ' + getProbabilityText(this.y);
            }
          }
        });

        weatherChart.addSeries({
          name: 'Freezing Rain Likelihood (weather service)',
          type: 'column',
          data: freezingRainData,
          tooltip: {
            pointFormatter: function () {
              return 'Freezing Rain: ' + getProbabilityText(this.y);
            }
          }
        });

        weatherChart.addSeries({
          yAxis: '4',
          name: 'Air temperature (weather service)',
          data: tempData,
          tooltip: {
            valueSuffix: ' °F'
          }
        });

        weatherChart.addSeries({
          yAxis: '1',
          name: 'Precipitation (weather service)',
          data: precipData,
          tooltip: {
            valueSuffix: ' inches'
          }
        });

    },
    error: function (jqXHR, textStatus, errorThrown)
    {
 
    }
  });

}

function getProbabilityText(val) {
  if (val === 0) return '<b>None</b><br/>';
  if (val === 1) return '<b>Slight Chance</b><br/>';
  if (val === 2) return '<b>Chance</b><br/>';
  if (val === 3) return '<b>Likely</b><br/>';
  if (val === 4) return '<b>Definite</b><br/>';
}

function  getMesonetData() {

  //get dates
  var d1 = $('#startDate').val();

  var currentDate = moment.utc().format('YYYYMMDD[T]HHmm');
  var twoDayDate = moment(d1).utc().format('YYYYMMDD[T]HHmm');
  console.log('in getweather api data:',currentDate,twoDayDate);


  var request = {
    'dataset':'nysm',
    'stations':['DUAN'],
    'variables':['srad', {'id': 'precip', 'units': 'inch'}, {'id': 'tair', 'units': 'degF'}, 'relh'],
    'start':twoDayDate,
    'end':currentDate
  };

  console.log('mesonet weather request body', request)

  $.ajax({
    url : mesonetServiceURL,
    type: 'POST',
    dataType : 'json',
    contentType: 'application/json',
    data : JSON.stringify(request),
    success: function(data)
    {
      //console.log('data', data)

      var timeArray =  data.response.coords.time.data.map(x => moment.utc(x).tz('America/New_York').valueOf());

      //console.log('mesonet API data',data.response.data_vars.relh.data);

      //need to map these to arrays with: [time,value]
      var precipArray = [];
      var relhArray = [];
      var sradArray = []; 
      var tairArray = [];

      for (var i = 0; i < timeArray.length; i++) {

        if (data.response.data_vars.precip.data[0][i] !== null) {
          precipArray.push([timeArray[i],  Math.round(data.response.data_vars.precip.data[0][i]*data.response.data_vars.precip.attrs.scale_factor*100)/100]);
        }

        if (data.response.data_vars.relh.data[0][i] !== null) {
          relhArray.push([timeArray[i], Math.round(data.response.data_vars.relh.data[0][i]*data.response.data_vars.relh.attrs.scale_factor*100)/100]);
        }

        if (data.response.data_vars.srad.data[0][i] !== null) {
          sradArray.push([timeArray[i], Math.round(data.response.data_vars.srad.data[0][i]*data.response.data_vars.srad.attrs.scale_factor*100)/100]);
        }

        if (data.response.data_vars.tair.data[0][i] !== null) {
          tairArray.push([timeArray[i], Math.round(data.response.data_vars.tair.data[0][i]*data.response.data_vars.tair.attrs.scale_factor*100)/100]);
        }
      }

     
      //console.log('precipArray', precipArray, relhArray, sradArray, tairArray);

      weatherChart = Highcharts.chart('mesonetGraphContainer', {
        
          title:{
            text: ''
          },
          credits: {
            enabled: false
          },
          chart: {
            type: 'line',
            spacingTop: 20,
            spacingLeft: 0,
            spacingBottom: 0,
            zoomType: 'x'
          },
          yAxis: [{ // Primary yAxis
            id: '1',
            title: {
              text: 'Precipitation, in',
              // style: {
              //     color: Highcharts.getOptions().colors[0]
              // }
            },
            labels: {
                format: '{value}',
                // style: {
                //     color: Highcharts.getOptions().colors[0]
                // }
            },
            //opposite: true
      
          }, { // Secondary yAxis
              id: '2',
              showEmpty: false, 
              title: {
                  text: 'Relative Humidity, %',
                  // style: {
                  //     color: Highcharts.getOptions().colors[1]
                  // }
              },
              labels: {
                  format: '{value}',
                  // style: {
                  //     color: Highcharts.getOptions().colors[1]
                  // }
              },
              opposite: true
      
          }, { // Tertiary yAxis
              id: '3',
              showEmpty: false, 
              title: {
                  text: 'Solar Radiation, W/m^2',
                  // style: {
                  //     color: Highcharts.getOptions().colors[2]
                  // }
              },
              labels: {
                  format: '{value}',
                  // style: {
                  //     color: Highcharts.getOptions().colors[2]
                  // }
              }
          }, { // quaternary yAxis
            id: '4',
            title: {
                text: 'Air temperature, deg F',
                // style: {
                //     color: Highcharts.getOptions().colors[3]
                // }
            },
            labels: {
                format: '{value}',
                // style: {
                //     color: Highcharts.getOptions().colors[3]
                // }
            },
            opposite: true
          }],
          tooltip: {
            shared: true,
            headerFormat: '<span style="font-size: 10px">' +
                              '{point.key:%e %b %H:%M:%S}' +
                          '</span><br/>'
          },
          series: [
            {
              name: 'Precipitation',
              data: precipArray,
              tooltip: {
                valueSuffix: ' inches'
              },
              yAxis: '1'
            },
            {
              name: 'Relative humidity',
              data: relhArray,
              tooltip: {
                valueSuffix: ' % at 2 meters'
              },
              visible: false,
              yAxis: '2'
            },
            {
              name: 'Solar radiation',
              data: sradArray,
              tooltip: {
                valueSuffix: ' W/m^2'
              },
              visible: false,
              yAxis: '3'
            },            
            {
              name: 'Air temperature',
              data: tairArray,
              tooltip: {
                valueSuffix: ' °F at 2 meters'
              },
              yAxis: '4'
            }
          ],
          xAxis: {
            type: "datetime",
            labels: {
              formatter: function () {
                return Highcharts.dateFormat('%m/%d %H%P', this.value);
              },
              align: 'center',
              tickInterval: 172800 * 1000
            }
          }


      
      });

      //add plotline for today
      weatherChart.xAxis[0].removePlotLine('mainLine');
      var plotOption = {
        id: 'mainLine',
        color: '#FF0000',
        dashStyle: 'ShortDash',
        width: 2,
        value: keyboardVal,
        zIndex: 3,
        label : {
            text : new Date(keyboardVal).toLocaleString()
        }
      };
      weatherChart.xAxis[0].addPlotLine(plotOption) ; 

      //now get weatherservice data and add to chart
      getWeatherServiceData();
    },
    error: function (jqXHR, textStatus, errorThrown)
    {
 
    }
  });

}

function incrementChart(direction) {
  //console.log(direction + ' arrow, have a value', keyboardVal,minKeyboardVal,maxKeyboardVal);

  $("#" + direction + "-arrow").animate({"opacity":1});
  $("#" + direction + "-arrow").animate({"opacity":0.7});

  if (direction === 'right') keyboardVal += 300000;
  if (direction === 'left') keyboardVal -= 300000;

  redrawTopChartOnHover(keyboardVal,bottomChart.series);
}

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
  console.log('showGraph:',categories,seriesData);

  //set card title
  $('#topChartTitle').html('Observed and Predicted Gage Heights ' + new Date(time).toLocaleString());
  $('#mapTitle').html('Mohawk River near Schenectady, NY ' + new Date(time).toLocaleString());

  //chart init object
  var chartSetup = {
		title:{
      //text:'Observed and Predicted Gage Heights ' + new Date(time).toLocaleString()
      text: ''
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

function redrawTopChartOnHover(seconds,chartSeries) {

  //update keyboardval
  keyboardVal = seconds

  //special function for reloading middle graph with mouse-over date
  var time = new Date(seconds).toLocaleString();
  var seriesData = [
    {
      data: [ 
        {name: "MOHAWK RIVER AT LOCK 9 AT ROTTERDAM JUNCTION NY", y: null, visible: false},
        {name: "MOHAWK RIVER AT LOCK 8 NEAR SCHENECTADY NY", y: null},
        {name: "MOHAWK RIVER AT FREEMAN'S BRIDGE AT SCHENECTADY NY", y: null},
        {name: "MOHAWK RIVER AT REXFORD NY", y:null},
        {name: "MOHAWK RIVER AT VISCHER FERRY DAM NY", y:null}
      ],
      name:'Gage height (Observed)' 
    },
    {
      data: [ 
        {name: "MOHAWK RIVER AT LOCK 9 AT ROTTERDAM JUNCTION NY", y: null},
        {name: "MOHAWK RIVER AT LOCK 8 NEAR SCHENECTADY NY", y: null},
        {name: "MOHAWK RIVER AT FREEMAN'S BRIDGE AT SCHENECTADY NY", y: null},
        {name: "MOHAWK RIVER AT REXFORD NY", y:null},
        {name: "MOHAWK RIVER AT VISCHER FERRY DAM NY", y:null}
      ],
      name:'Gage height (Predicted)'
    },
    {
      id: 'main',
      name:'Difference Between Observed and Predicted gage heights (under chart)',
      marker : {symbol : 'url(https://image.ibb.co/ijFrFV/Capture.png)' }
    }
  ];

  var value = null;
  $(chartSeries).each(function (seriesIndex, series) {

    var name = series.name.split('|');

    //update legend to blank value
    var newName = series.name.split(':')[0] + ':';
    bottomChart.legend.allItems[seriesIndex].update({name:newName});

    //search for and only add exact time matched data
    $(series.data).each(function (i, item) {
      
      if (item.x === seconds) {
        value = item.y;

        //set initial visibility
        if (series.name.indexOf('ROTTERDAM') !== -1 || series.name.indexOf('Predicted') !== -1) {
          //console.log("FOUND ONE!!!!", series.name)
          series.hide();
        }

        //if time match found update legend
        newName = series.name.split(':')[0] + ': ' + parseFloat(item.y).toFixed(2);
        bottomChart.legend.allItems[seriesIndex].update({name:newName});

        $(seriesData).each(function (i, seriesObj) {
          if (seriesObj.name === name[2].split(':')[0].trim()) {

            //another loop over data array
            $(seriesObj.data).each(function (i, dataObj) {

              if (dataObj.name === name[1].trim() ) {
                dataObj.y = value;
              }
   
            });
          }
        });
      }

      //bottomChart.legend.allItems[seriesIndex].update({name:newName});

      // else {
      //   //discharge only every 15 mins
      //   var newName = series.name.split('Discharge')[0] + 'Discharge: (n/a)';
        
      //   bottomChart.legend.allItems[seriesIndex].update({name:newName});
      // }
    });
  });

  //some logic for added a colored label based on difference to X-axis labels
  for (var i = 0; i < categories.length; i++) {       
    
    //check if either of the comparison values are null
    if (!seriesData[0].data[i].y == null || seriesData[1].data[i].y == null) { 

      //if null, set the category to just text     
      categories[i] = '<span class="ice-legend">' + seriesData[0].data[i].name + '</span>';
      continue;
    }

    var difference = (seriesData[0].data[i].y - seriesData[1].data[i].y).toFixed(2);

    //console.log('THISSS', seriesData[0].data[i].name, seriesData[0].data[i].name.length)

    if (difference < 0.5)                      categories[i] = '<span class="ice-legend">' + seriesData[0].data[i].name + '</span><hr><icon class="graphIcon wmm-square wmm-196F3D wmm-icon-noicon wmm-icon-black wmm-size-25 wmm-borderless"></icon>' + difference;
    if (difference >= 0.5 && difference < 2.5) categories[i] = '<span class="ice-legend">' + seriesData[0].data[i].name + '</span><hr><icon class="graphIcon wmm-square wmm-F1C40F wmm-icon-noicon wmm-icon-black wmm-size-25 wmm-borderless"></icon>' + difference;
    if (difference >= 2.5)                     categories[i] = '<span class="ice-legend">' + seriesData[0].data[i].name  + '</span><hr><icon class="graphIcon wmm-square wmm-E74C3C wmm-icon-noicon wmm-icon-black wmm-size-25 wmm-borderless"></icon>' + difference;
  }

  //update top chart
  //console.log('updating top chart',seriesData)
  mainChart.xAxis[0].setCategories(categories);
  mainChart.series[0].update(seriesData[0],false);
  mainChart.series[1].update(seriesData[1],true);
  $('#topChartTitle').html('Observed and Predicted Gage Heights ' + time);

  //update plotLine
  bottomChart.xAxis[0].removePlotLine('mainLine');
  var plotOption = {
    id: 'mainLine',
    color: '#FF0000',
    dashStyle: 'ShortDash',
    width: 2,
    value: seconds,
    zIndex: 3,
    label : {
        text : new Date(seconds).toLocaleString()
    }
  };
  bottomChart.xAxis[0].addPlotLine(plotOption) ; 

  if (weatherChart) {
    weatherChart.xAxis[0].removePlotLine('mainLine');
    weatherChart.xAxis[0].addPlotLine(plotOption) ; 
  }


  //update Map
  $('#mapTitle').html('Mohawk River near Schenectady, NY ' + time);
  updateMap(categories,seriesData);
  
}
 
function showGraphAllData(startTime,seriesData,graphContainer) {

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
                {name: "MOHAWK RIVER AT LOCK 9 AT ROTTERDAM JUNCTION NY", y: null},
                {name: "MOHAWK RIVER AT LOCK 8 NEAR SCHENECTADY NY", y: null},
                {name: "MOHAWK RIVER AT FREEMAN'S BRIDGE AT SCHENECTADY NY", y: null},
                {name: "MOHAWK RIVER AT REXFORD NY", y:null},
                {name: "MOHAWK RIVER AT VISCHER FERRY DAM NY", y:null}
              ],
              name:'Gage height (Observed)',
              marker: {
                symbol: 'circle'
              },
              color: observedColor
            },
            {
              data: [ 
                {name: "MOHAWK RIVER AT LOCK 9 AT ROTTERDAM JUNCTION NY", y: null},
                {name: "MOHAWK RIVER AT LOCK 8 NEAR SCHENECTADY NY", y: null},
                {name: "MOHAWK RIVER AT FREEMAN'S BRIDGE AT SCHENECTADY NY", y: null},
                {name: "MOHAWK RIVER AT REXFORD NY", y:null},
                {name: "MOHAWK RIVER AT VISCHER FERRY DAM NY", y:null}
              ],
              name:'Gage height (Predicted)',
              marker: {
                symbol: 'triangle'
              },
              color: predictedColor
            },
            {
              id: 'main',
              name:'Difference Between Observed and Predicted gage heights (under chart)',
              marker : {symbol : 'url(https://image.ibb.co/ijFrFV/Capture.png)' }
            }

          ];

          var value,time;
          $(this.series).each(function (i, series) {

            //make sure we have some data
            if (series.data.length > 0) {

              //get index of last non-null value
              //console.log('TEST',series.data)
              var lastgoodIndex;
              for (i = 0; i < series.data.length; i++) {
                if (series.data[i].y === null) {
                  //console.log('found a null', series.data[i])
                  lastgoodIndex = i-1;
                  break;
                }
              }

              //get index of last value
              var index = series.data.length - 1;
              //console.log('TEST', series.data, lastgoodIndex)
              time = series.data[lastgoodIndex].x;
              value = series.data[lastgoodIndex].y;

              //want to make sure initial load shows a time point including discharge
              if (series.name.indexOf('Discharge') != -1) {
                keyboardVal = time;
                maxKeyboardVal = keyboardVal;
                minKeyboardVal = series.data[0].x;
    
                console.log('init keyboard val:',series.name,keyboardVal)
              }
            }

            var name = series.name.split('|');

            $(seriesData).each(function (i, seriesObj) {

              if (seriesObj.name === name[2].trim()) {

                //another loop over data array
                $(seriesObj.data).each(function (i, dataObj) {

                  if (dataObj.name === name[1].trim() ) {
                    dataObj.y = value;
                  }
                
                });
              }
            });
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

          showGraph(time,categories,seriesData,'graphContainer');
          setTimeout(function(){ updateMap(categories,seriesData);}, 500);
          
        },
        mouseOver: function () {

          //redraw the top chart
          //redrawTopChartOnHover(this.x,this.series.chart.series);
        },
        click: function(e) {

          var lastSeries = this.series[this.series.length -1].data
          var snapValue = this.series[this.series.length -1].data[0].x;
          var seconds = e.xAxis[0].value;

          //need to find closet 5 min value to clicked point since this listener is for the entire chart area we could have decimal second value
          $(lastSeries).each(function (i, dataPoint) {
            if (Math.abs (seconds - dataPoint.x) < Math.abs(seconds - snapValue)) {
              snapValue = dataPoint.x;
            }

          });
            
          redrawTopChartOnHover(snapValue,this.series);
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

              //redraw the top chart
              //redrawTopChartOnHover(this.x,this.series.chart.series);
            },
            click: function(evt) {
              
              //need to also enable click listener on the series or else the main chart click listener wont work if a line is clicked
              redrawTopChartOnHover(this.x,this.series.chart.series);
 
            },


          }
        },

        //turn on checkbox and set it to toggle series visibility
        // events: {
        //   checkboxClick: function (event) {

        //     //console.log('checkbox was clicked',this)

        //     var chart = this.chart;
        //     Highcharts.each(chart.legend.allItems, function (p, i) {
        //       $(p.checkbox).change(
        //         function () {
        //           if (this.checked) {
        //             chart.legend.allItems[i].show();
        //           } else {
        //             chart.legend.allItems[i].hide();
        //           }
        //         });
        //     });
        //   },
        //   //this will toggle the checkbox on legend text click
        //   legendItemClick: function (event) {
        //     this.checkbox.checked = !this.checkbox.checked;
        //   }
        // },
        // showCheckbox: true,
        selected: true
      }
    },
		title:{
			text:''
		},
		credits: {
			enabled: false
    },
    tooltip: {
      shared: true,
      headerFormat: '<span style="font-size: 10px">' +
                        '{point.key:%e %b %H:%M:%S}' +
                    '</span><br/>'
    },
    // tooltip: {
    //   shared: true,
    //   formatter: function() {   
    //     return '<b>' + new Date(this.point.x).toLocaleString() + '</b><br/>' + this.series.name.split(':')[0] + ': ' + this.point.y;
    //   }
    // },
		xAxis: {
			type: "datetime",
			labels: {
				formatter: function () {
					return Highcharts.dateFormat('%m/%d %H%P', this.value);
				},
				align: 'center',
				tickInterval: 172800 * 1000
      }
    },
		yAxis: [],
		series: []
  };

  //loop over series data so we can match up the axis and series indexes
  $(seriesData).each(function (i, obj) {

    //setup yAxis template
    var yaxis =   {
      title: { 
        text: obj.modifiedVariableName,
        // style: {
        //   color: obj.color
        // }
      },
      labels: {
        // style: {
        //     color: 'black'
        // }
      }
    };

    //check if this series unit aleady has yaxis
    var exists = false;
    $(chartSetup.yAxis).each(function (i, data) { 
      //console.log('what is this',data)
      if (data.title.text == obj.modifiedVariableName) exists = true;
    });

    //if it doesn't exist we want to add this axis template
    if (!exists) { 
      //console.log('doesnt exist:',yaxis)

      //set logrithmic scale for discharge
      if (yaxis.title.text.indexOf('Discharge') !== -1) yaxis.type = 'logarithmic';
      
      yaxis.opposite = isOdd(chartSetup.yAxis.length);
      obj.yAxis = chartSetup.yAxis.length;
      chartSetup.yAxis.push(yaxis);      
    }
    
    chartSetup.series.push(obj);    
  });

  
  bottomChart = Highcharts.chart(graphContainer, chartSetup);
  
  
  //add initial plotline at end of chart on load
  var plotOption = {
    id: 'mainLine',
    color: '#FF0000',
    dashStyle: 'ShortDash',
    width: 2,
    value: keyboardVal,
    zIndex: 0,
    label : {
        text : new Date(keyboardVal).toLocaleString()
    }
  };
  bottomChart.xAxis[0].addPlotLine(plotOption) ; 

  redrawTopChartOnHover(keyboardVal,bottomChart.series);
  
  $('.graph-loading').hide();

}

function updateMap(categories, seriesData) {

  //console.log('in updateMap',categories,seriesData);

  for (var i = 0; i < categories.length; i++) {

    var category;
    if (categories[i].indexOf('<span class="ice-legend">') !== -1) category = categories[i].split('<span class="ice-legend">')[1].split('</span>')[0];
    else category = categories[i];

    boundaryGeoJSON.eachLayer(function (layer) {  
       
      if(layer.feature.properties.siteName === category) {    

        //console.log("HAVE MATCH",categories[i],layer.feature.properties.siteName);
        
        //check if either of the comparison values are null
        if (!seriesData[0].data[i].y === null || seriesData[1].data[i].y === null) { 
          boundaryGeoJSON.resetStyle(layer);
        }

        else {

          var difference = seriesData[0].data[i].y - seriesData[1].data[i].y;
          //console.log("MATCH", difference);
          if (difference < 0.5)                      layer.setStyle({fillColor :'#196F3D'}); //#196F3D
          if (difference >= 0.5 && difference < 2.5) layer.setStyle({fillColor :'#F1C40F'}); //#F1C40F
          if (difference >= 2.5)                     layer.setStyle({fillColor :'#E74C3C'}); //#E74C3C

        }
      }
    });

  }
}

function addToLegend(text, classString) {
  console.log('adding to legend:',text,classString)

  var id = text.replace(/\s+/g, '-').toLowerCase();

  if (document.getElementById(id) === null) {
    $('#legend').append('<span id="' + id + '" class="site"><icon class="siteIcon ' + classString + '" />' + text + '</span>');
    $('#legend .siteIcon').attr('style', 'margin-top: -6px !important;');
  }
}

function loadSites() {
  console.log('in loadsites');

  $('.graph-loading').show();

  //first load mohawk boundary geoJSON
  $.ajax({
    url: mohawkBoundaryURL,
    dataType: 'json',
    success: function (data) {
      boundaryGeoJSON = geoJSON(data, {
        style: function(feature) {
          return {
            fillColor: '#196F3D',
            //fillColor: 'green',
            weight: 1.5,
            opacity: 1,
            color: '#313030', //border color
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
                      feature.properties[pcode_tsid].value = parseFloat(TSID.value[0].value).toFixed(2);
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

            // //add legend
            // var legend = L.control({position: 'bottomright'});
            // legend.onAdd = function (theMap) {
            
            //     var div = L.DomUtil.create('div', 'info map-legend');
            //     div.innerHTML += '<table id="legend" class="table table-borderless mb-0"><tbody></tbody></table>';
            //     return div;
            // };
            
            // legend.addTo(theMap);
                                    
            sitesGeoJSON = geoJSON(featureCollection, {
              pointToLayer: function (feature, latlng) {

                var classString = 'wmm-pin wmm-white wmm-icon-triangle wmm-icon-black wmm-size-25';
                var text = 'USGS Streamgage';

                if (feature.properties.siteType === 'webcam') {
                  classString = 'wmm-circle wmm-blue wmm-icon-noicon wmm-icon-white wmm-size-25';
                  text = 'USGS Webcam';
                }

                if (feature.properties.siteType === 'weather') {
                  classString = 'wmm-pin wmm-sky wmm-icon-noicon wmm-icon-white wmm-size-25';
                  text = feature.properties.siteName;
                }


          
                addToLegend(text, classString);

          
                var icon = L.divIcon({ className: classString });
                return L.marker(latlng, { icon: icon });
              },
              onEachFeature: function(feature, layer) {
                var popupContent = '';

                
                if (feature.properties.siteType == 'webcam') {
                  popupContent = '<b>Camera Name:</b> ' + feature.properties.siteName + '<br><a href="' + feature.properties.webcamLink + '" target="_blank" class="btn btn-outline-info btn-sm">Open webcam</a>';
                }

                else if (feature.properties.siteType == 'weather') {
                  popupContent = '<b>Station Name:</b> ' + feature.properties.siteName;
                }

                //otherwise its a gage
                else {
                  popupContent = '<b>Site ID: </b><a href="https://waterdata.usgs.gov/nwis/uv/?site_no=' + feature.properties.siteID + '" target="_blank">' + feature.properties.siteID + '</a><br><b>Station Name:</b> ' + feature.properties.siteName;

                  if (feature.properties.ahpsURL && feature.properties.ahpsURL.length > 0) {
                    popupContent += '<br><b>NWS AHPS: </b><a href="' + feature.properties.ahpsURL + '" target="_blank">link</a>';
                  }
  
                  if (feature.properties.photoURL && feature.properties.photoURL.length > 0) {
                    popupContent += '<br><b>Site photo (static): </b><img src="' + feature.properties.photoURL + '" width="120px" alt="Site Photo">';
                  }

                  //make this layer on top
                  layer.setZIndexOffset(2000);
  
                }

                layer.bindPopup(popupContent);
              }
            }).addTo(theMap);

            //minimap
            var basemap_minimap = new L.TileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {minZoom: 0, maxZoom: 13, attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ' });
            var sites_minimap = L.geoJson(featureCollection, {
              pointToLayer: function (featuredata, latlng) {
                return new L.CircleMarker(latlng, {radius: 2});
              }
            });
            var layers = new L.LayerGroup([basemap_minimap, sites_minimap]);
            miniMap = new L.Control.MiniMap(layers, { toggleDisplay: true, zoomLevelFixed: 7.4 }).addTo(theMap);

            addToLegend("No backwater from ice", "wmm-square wmm-196F3D wmm-icon-noicon wmm-icon-black wmm-size-25 wmm-borderless");
            addToLegend("Moderate backwater from ice", "wmm-square wmm-F1C40F wmm-icon-noicon wmm-icon-black wmm-size-25 wmm-borderless");
            addToLegend("Significant backwater from ice", "wmm-square wmm-E74C3C wmm-icon-noicon wmm-icon-black wmm-size-25 wmm-borderless");
          
            // call a function on complete 
            $('#loading').hide();
            $('#legend').show();
      });

      var requestData = {
        format: 'json',
        sites: siteList,
        parameterCd: '00065,99067,00060'
      };


      //time and date stuff
      var timeOption = $('input[name=timeSelect]:checked').val();

      //get compare years
      if ($("#compareYears").prop('checked')) {
        compareYears = true;
      }
      
      //convert periods to start and end dates with moment
      if (timeOption === 'period') {
        var period = $('#timePeriodSelect').select2('data')[0].id;
        requestData.endDT = moment().format('YYYY-MM-DD');
        requestData.startDT = moment().subtract(moment.duration(period)).format('YYYY-MM-DD'); 
      }
      else {
        requestData.startDT = $('#startDate').val();
        requestData.endDT = $('#endDate').val();
      }

      //get historical NWIS data
      $.getJSON(NWISivURL,
        requestData
          , function success(data) {
            console.log('NWIS historical IV Data:',data);

            $('.graph-loading').hide();

            var seriesData = [];
     
            if (data.value.timeSeries.length <= 0) {
              alert('Found an NWIS site [' + siteIDs + '] but it had no data in waterservices for [' +  parameterCodes + ']');
              $('.graph-loading').hide();
              return;
            }

            var startTime = data.value.queryInfo.criteria.timeParam.beginDateTime;   
            //var startTime = data.value.timeSeries[0].values[0].value[0].dateTime.split('T')[0];

            $(data.value.timeSeries).each(function (i, siteParamCombo) {

              $(siteParamCombo.values).each(function (i, value) {
                // ---------------------- real function to create new data array ----------------------
                var site = siteParamCombo.name.split(':');

                if (site[2] === '99067') {
                  $(data.value.timeSeries).each(function (i, test) {
                    //look for gage height for same station id
                    var lookupsite = test.name.split(':');

                    //if we have the matching site
                    if (site[1] === lookupsite[1] && lookupsite[2] === '00065') {
                      //console.log('lookupsite', site[1],site[2],lookupsite[1],lookupsite[2]);

                      //outer loop over gage height values for this site
                      $(test.values[0].value).each(function (i,origVal) {

                        //inner loop over offset values for this site
                        $(value.value).each(function (g,diffVal) {
                          //console.log('1111',val.dateTime, diffValue.dateTime);
                          if (origVal.dateTime == diffVal.dateTime) {
                            var diff = diffVal.value;
                            diffVal.value = parseFloat(origVal.value/1 - diff/1).toFixed(2);
                            //console.log("GOTS A MATCH",diffVal.value,origVal,diffVal)
                          }

                        });
                      })
                    }
                  });
                }
                // ---------------------- real function to create new data array ----------------------

                var valueArray = value.value.map(function(item) {
                  var seconds = new Date(item.dateTime)/1;


                  //check for and skip -999999 bad values (ie. from ICE) or values missing values
                  if (item.value !== "-999999" && parseFloat(item.value) > 8.00) {
                    var dataVal = item.value/1;
                    return [seconds,dataVal];
                  }
                  else {
                    console.warn('BAD DATA was found.  Check into it:', item)
                    return [seconds,-999999];
                  }

                });

                lastDateVal = valueArray[valueArray.length -1][0]

                //need to pay values +48 hrs
                var timeInMs = Date.now();
                var timePlus48hr = timeInMs + 172800000;  //48 hours in milliseconds
                var timeInt = 300000;
    
                while (timeInMs <= timePlus48hr) {
                  valueArray.push([timeInMs, null])
                  timeInMs = timeInMs + timeInt;
                }

                // console.log('TEST THIS', keyboardVal, minKeyboardVal,maxKeyboardVal)


                //make sure we bail from loop if there is no data
                if (valueArray.length === 0) return;

                var siteID = siteParamCombo.name.split(':')[1]

                var color;
                //get a new color for each unique siteID
                for (var site in siteColors) {
                  //console.log('here',site,siteColors[site])
                  if (site === siteParamCombo.name.split(':')[1] + ':' + siteParamCombo.name.split(':')[2]) color = siteColors[site];
                };
 
                var suffix;
                var symbol = {
                    symbol: 'circle'
                }

                //console.log('site color:', color)
                //var color = observedColor;
                var modifiedVariableName = "Gage height, ft";

                if (siteParamCombo.variable.variableName == "Gage height, ft") suffix = 'Gage height (Observed)';
                if (siteParamCombo.variable.variableName == "Difference between observed and predicted water surface elevation, feet") {
                  suffix = 'Gage height (Predicted)';
                  symbol = {
                      symbol: 'triangle'
                  };
                  //color = getRandomAssociatedColor(color);
                }
                if (siteParamCombo.variable.variableName == "Streamflow, ft&#179;/s") {
                  suffix = "Discharge";
                  modifiedVariableName = "Discharge, cubic feet per second";
                  //color = getRandomAssociatedColor(color),
                  symbol = {
                      symbol: 'square'
                  };

                }

                var name = siteID + ' | ' + siteParamCombo.sourceInfo.siteName + ' | ' + suffix + ':';
                
                var series = {
                  showInLegend: true,
                  values: value,
                  stickyTracking: false,
                  data: valueArray,
                  color:color,
                  siteID: siteID,
                  siteName: siteParamCombo.sourceInfo.siteName,
                  siteCode: siteParamCombo.name,
                  variableDescription: siteParamCombo.variable.variableDescription,
                  variableName: siteParamCombo.variable.variableName,
                  modifiedVariableName: modifiedVariableName, 
                  unit: siteParamCombo.variable.unit.unitCode,
                  name:name,
                  marker: symbol
                };
              
                seriesData.push(series);
              });
            });

            showGraphAllData(startTime,seriesData, 'graphContainer2');

            $('#bottomChartTitle').html('Observed and Predicted Gage Heights: ' +  requestData.startDT + ' to ' + requestData.endDT);

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

function setDates() {

  var dateObj = new Date();
  var currentDate = formatDate(dateObj);
  var threeDayDate = formatDate(dateObj.getTime() - (3 * 24 * 60 * 60 * 1000));
  console.log('dates:',currentDate,threeDayDate);

  $('#startDate').val(threeDayDate);
  $('#endDate').val(currentDate);

}

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
    return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
}

function isOdd(n) {
  return !!(n % 2);
}

function getRandomAssociatedColor(color) {
  var p = 1,
      temp,
      random = Math.random(),
      result = '#';

  while (p < color.length) {
      temp = parseInt(color.slice(p, p += 2), 16)
      temp += Math.floor((255 - temp) * random);
      result += temp.toString(16).padStart(2, '0');
  }
  return result;
}