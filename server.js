var express = require('express');
var app = express();
var url;
var bodyParser = require('body-parser');

var engines = require('consolidate');
app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/templates');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var req = new XMLHttpRequest();

app.post('/data/:org/:repo', function(request, response) {
	var org = request.params.org;
	var repo = request.params.repo;

	url = 'https://api.github.com/repos/' + org + '/' + repo + '/pulls';
	req.open('GET', url, true);

	var token = 'a05b8999d221e3898b8b8919438ccdb5fc3d586e'; // PUT YOUR PERSONAL TOKEN HERE!!!

	req.setRequestHeader('Authorization', 'token ' + token);
	req.addEventListener('load', function(e){
		if (req.status == 200) {
			var data = JSON.parse(req.responseText);
			response.json(data);
		}
	}, false);

	req.send(null); 
});

app.get('/', function(request, response){
	response.render('home.html');
});

app.get('/login', function(request, response) {
	var req = new XMLHttpRequest();

	var params = 'client_id=f112d8966964169f6ebb';
	req.onreadystatechange = function() {
		if (req.readyState == 4 && req.status == 200) {
            response.send(req.responseText);
        }
	};

	req.open('GET', 'https://github.com/login/oauth/authorize', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(params);

});

app.post('/session', function(request, response) {
	//console.log(request.body);
	var code = request.body['authenticity_token'];
	//console.log(code);
	var req = new XMLHttpRequest();

	var params = 'client_id=f112d8966964169f6ebb&client_secret=538d16b411d8a82ba90e26a298a8c40345fab874&code=' + code;
	req.onreadystatechange = function() {
		//console.log(req.readyState);
		//console.log(req.status);
		if (req.readyState == 4 && req.status == 200) {
            //console.log(req.responseText);
        } else {
        	//console.log(req);
        }
	};

	req.open('POST', 'https://github.com/login/oauth/access_token', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(params);
});

app.listen(process.env.PORT, function(){
    console.log('- Server listening on port ' + process.env.PORT);
});

// app.listen(8080, function(){
//     console.log('- Server listening on port 8080');
// });

