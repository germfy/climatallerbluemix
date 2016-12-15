var request = require('request');
var express = require('express');
var cfenv = require('cfenv');
var url = require('url');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();


app.get('/weather',function(req,res) {
  //console.log(wHost +" "+ wUsername +" "+ wPassword);
  var wCredentialsHost = appEnv.services["weatherinsights"]? appEnv.services["weatherinsights"][0].credentials.url : "";
  var queryStr = url.parse(req.url,true).query;
  var urlweather = wCredentialsHost + '/api/weather/v1/geocode/'+parseFloat(queryStr.lat)+'/'+parseFloat(queryStr.lon)+'/observations.json?language=es-MX&units=m'
  console.log("urlweather" + urlweather);
  var jsonrequest = {
    url : urlweather,
    method : 'GET',
    headers : {
      'Content-Type': 'application/json;charset=utf-8',
      'Accept': 'application/json'
    }
  };
  console.log("JsonRequest" + JSON.stringify(jsonrequest));
  request(jsonrequest, function(error, response, body){
    if(error && response.statusCode !=200){
      console.log("error " + JSON.stringify(err));
      res.send(err.message);
    }else{
      //console.log("Dentro de no error " + JSON.stringify(response));
      //console.log("Dentro de no error 2 " + JSON.stringify(body));

      res.json({ message: response.statusCode, data: JSON.parse(body)});
    }
  });
});



// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);


});
