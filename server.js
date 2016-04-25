var express = require('express');
var app = express();
var url;
var bodyParser = require('body-parser');

var engines = require('consolidate');
app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/templates');
app.use(express.static('public'));

var finalhandler = require('finalhandler');
var http = require('http');
var https = require('https');
var Router = require('router');

var router = Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var req = new XMLHttpRequest();

//This function is credit to http://jsfiddle.net/wSQBx/
var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

app.post('/data/:org/:repo', function(request, response) {
	var org = request.params.org;
	var repo = request.params.repo;

	url = 'https://api.github.com/repos/' + org + '/' + repo + '/pulls';
	req.open('GET', url, true);


	var token = '174b490e8d6d79ea483af3d5fa6f0f0d34e91e4e'; // PUT YOUR PERSONAL TOKEN HERE!!!

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

	var random = randomString(32, chars);
	//var uri = 'localhost:8080/home';
	console.log("random: " + random);
	var params = '?client_id=f112d8966964169f6ebb&state=' + 
		random + 'scope=user,public_repo';
	console.log("params: " + params);
	
	var path = 'https://github.com/login/oauth/authorize';
	path += params;
	response.redirect(path);

	req.onreadystatechange = function() {
		console.log('in req');
		//console.log(req.param);
		if (req.readyState == 4 && req.status == 200) {
			var code = req.responseText;
            console.log("response: " + req.responseText);
        }
	};

	req.open('GET', 'https://github.com/login/oauth/authorize?' + params, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
 //    req.send(params);

});

//var url = 'https://gitbuddy.herokuapp.com/home?';


//refer to http://blog.csdn.net/yangnianbing110/article/details/42925987.
app.get('/home', function(request, response) {
	var code = request.param('code');
	var state = request.param('state');
	//response.render('dummy.html', {code: code, state: state});
	var headers = request.headers;
	path = '/login/oauth/access_token';
	headers.host = 'github.com';
	
	// //var req = new XMLHttpRequest();

	var params = '?client_id=f112d8966964169f6ebb' + 
				 '&client_secret=538d16b411d8a82ba90e26a298a8c40345fab874' + 
				 '&code=' + code;

	path += params;

	//response.render('dummy.html', {code: code, state: state, data: path});

	// var opts = {
	// 	hostname:'github.com',
	// 	port:'443',
	// 	path: path,
	// 	headers: headers,
	// 	method: 'POST'
	// }
	// var req = https.request(opts, function(response){
	// 	//console.log('in http');
	// 	response.setEncoding('utf8');
	// 	response.on('data', function(data){
	// 		response.render('dummy.html', {code: code, state: state});
	// 	});
	// });
	// 	//console.log(response.param('access_toke'));
	// });
	req.onreadystatechange = function() {
		//console.log(req.readyState);
		//console.log(req.status);
		response.render('dummy.html', {code: req.responseText, state: 'state'});
		if (req.readyState == 4 && req.status == 200) {
			response.render('dummy.html', {code: 'code', state: 'state'});
			//console.log(req.responseText.access_token);
            //console.log(req.responseText);
        } else {
        	//console.log(req);
        }
	};

	req.open('POST', 'https://github.com/login/oauth/access_token' + params, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
 //    req.send(params);
});

app.get('')

app.listen(process.env.PORT, function(){
    console.log('- Server listening on port ' + process.env.PORT);
});

// app.listen(8080, function(){
//     console.log('- Server listening on port 8080');
// });

