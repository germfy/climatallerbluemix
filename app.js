var http = require('http');
var express = require('express');
var cfenv = require('cfenv');
var url = require('url');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();
var vcap_services = JSON.parse(process.env.VCAP_SERVICES);
//var wCredentials = vcap_services.weatherinsights[0].credentials;
var wCredentialsHost = appEnv.services["weatherinsights"]? appEnv.services["weatherinsights"][0].credentials.url : "";

app.get('/weather',function(req,res) {
  var queryStr = url.parse(req.url,true).query;
  var optionsgetmsg = {
    host : wCredentialsHost,
    path : '/api/weather/v1/geocode/'+queryStr.lat+'/'+queryStr.lon+'/observations.json?language=es-MX&units=m',
    //path: '/v1/geocode/'+queryStr.lat+'/'+queryStr.lon+'/observations.json',
    //path : '/api/weather/v2/observations/current?units=m&language=es-MX&geocode='+ queryStr.latlon,
    method : 'GET',
    headers : {
      "Content-Type": "application/json;charset=utf-8",
      "Accept": "application/json"
    }
  };
  var reqGet = http.request(optionsgetmsg, function(res1) {
    var cond="";
    res1.on('data', function(d) {
      cond+=d;
    });
    res1.on('end', function() {
      res.json(JSON.parse(cond));
    });
  });
  reqGet.end();
  reqGet.on('error', function(e) {
    console.error(e);
  });
});


// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);


});
