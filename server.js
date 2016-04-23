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


app.post('/data/:inputurl', function(request, response) {
	url = 'https://api.github.com/repos/Teradata/' + request.params.inputurl + '/pulls';
	req.open('GET', url, true);

	var token = '7f9be1a12a655c6ce0d94e413c06759d6223b6dc'; // PUT YOUR PERSONAL TOKEN HERE!!!

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
	//var uri = '';
	console.log("random: " + random);
	var params = '?client_id=f112d8966964169f6ebb&state=' + 
		random + 'scope=user,public_repo';
	console.log("params: " + params);
	
	var path = 'https://github.com/login/oauth/authorize';
	path += params;
	response.redirect(path);

	req.onreadystatechange = function() {
		console.log('in req');
		//console.log(req.responseText);
		if (req.readyState == 4 && req.status == 200) {
			var code = req.responseText;
            console.log("response: " + req.responseText);
        }
	};

	req.open('GET', 'https://github.com/login/oauth/authorize?' + params, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
 //    req.send(params);

});

app.get('/home', function(request, response) {
	console.log('in get code');
	var code = request.param('code');
	//console.log("req body: " + req.params('state'));
	console.log("code: " + code);
	// var req = new XMLHttpRequest();

	// var params = '?client_id=f112d8966964169f6ebb&client_secret=538d16b411d8a82ba90e26a298a8c40345fab874&code=' + code;
	// req.onreadystatechange = function() {
	// 	//console.log(req.readyState);
	// 	//console.log(req.status);
	// 	if (req.readyState == 4 && req.status == 200) {
	// 		console.log(req.responseText.access_token);
 //            console.log(req.responseText);
 //        } else {
 //        	//console.log(req);
 //        }
	// };

	// req.open('POST', 'https://github.com/login/oauth/access_token', true);
 //    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
 //    req.send(params);
});

app.listen(process.env.PORT, function(){
    console.log('- Server listening on port ' + process.env.PORT);
});

// app.listen(8080, function(){
//     console.log('- Server listening on port 8080');
// });

