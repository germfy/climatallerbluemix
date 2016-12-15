//var http = require('http');
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
var vcap_services = JSON.parse(process.env.VCAP_SERVICES);
/*var vcap_services = {
  "weatherinsights": [
    {
      "credentials": {
        "username": "529ce117-3eaa-4654-b325-e192143c8314",
        "password": "HKVaFNTyPG",
        "host": "twcservice.mybluemix.net",
        "port": 443,
        "url": "https://529ce117-3eaa-4654-b325-e192143c8314:HKVaFNTyPG@twcservice.mybluemix.net"
      },
      "syslog_drain_url": null,
      "label": "weatherinsights",
      "provider": null,
      "plan": "Free-v2",
      "name": "Weather Company Data for IBM Bluemix-to",
      "tags": [
        "big_data",
        "ibm_created",
        "ibm_dedicated_public"
      ]
    }
  ]
};*/




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

router.get('/voz', function(req, res, next){
	var appEnv = cfenv.getAppEnv();
	var appService = appEnv.getService("Texto a voz-ut");

	var url = appService.credentials.url;
	var username = appService.credentials.username;
	var password = appService.credentials.password;

	var texttospeech = watson.text_to_speech({
		version:'v1',
		username: username,
		password: password
	});

	console.log("Dentro de voz");
	console.log(req.query);
	var transcript = texttospeech.synthesize({text:req.query.texto, voice:"es-ES_EnriqueVoice", accept:"audio/wav"});

	transcript.on('response', function(response) {
		    if (req.query.download) {
					response.headers['Access-Control-Allow-Origin'] = '*';
		      response.headers['content-disposition'] = 'attachment; filename=audio.wav';

		    }
		  });
		  transcript.on('error', function(error) {
			  next(error);
		  });
			res.setHeader("Access-Control-Allow-Origin", "*");
		  transcript.pipe(res);
});

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);


});
