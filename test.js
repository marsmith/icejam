

var request = {
    'dataset':'nysm',
    'stations':['DUAN'],
    'variables':['precip'],
    'start':twoDayDate,
    'end':currentDate
  };


$.ajax({
    url : "https://api.nysmesonet.org/data/dynserv/timeseries2",
    type: 'POST',
    dataType : 'json',
    contentType: 'application/json',
    data : JSON.stringify(request),
    success: function(data)  {
      console.log('data', data)

    }
});