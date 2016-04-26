var express = require('express');
var app = express();
var url;
var userToken;
var bodyParser = require('body-parser');

var Cookie = require('js-cookie');
var rp = require('request-promise');

var engines = require('consolidate');
app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/templates');
app.use(express.static('public'));

var finalhandler = require('finalhandler');
var http = require('http');
const https = require('https');
var Router = require('router');
const queryString = require('query-string');

var router = Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var req = new XMLHttpRequest();
var request = require('request');

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

	url = 'https://api.github.com/repos/' + org + '/' + repo + '/pulls?state=all';
	req.open('GET', url, true);

	console.log('usertoken: ' + userToken);
	var token = 'feafeb1563e2400d1a0d43126eb9ecec0ca5fd01'; // PUT YOUR PERSONAL TOKEN HERE!!!

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

request('/home', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // Show the HTML for the Google homepage. 
  }
})

//refer to http://blog.csdn.net/yangnianbing110/article/details/42925987.
//var headers;
app.get('/home', function(requ, response) {
	var code = requ.param('code');
	var state = requ.param('state');
	headers = requ.headers;
	path = '/login/oauth/access_token';
	headers.host = 'api.github.com';

	var params = '?client_id=f112d8966964169f6ebb' + 
				 '&client_secret=538d16b411d8a82ba90e26a298a8c40345fab874' + 
				 '&code=' + code;

	path += params;

 	request('https://github.com/login/oauth/access_token' + params, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	var parsed = queryString.parse(body);
	  	console.log('token: ' + parsed.access_token);
	  	userToken = parsed.access_token;
	  	console.log('token: ' + userToken);

 		var userUrl = 'https://api.github.com/user?access_token=';

		var options = {
		    uri: 'https://api.github.com/user',
		    qs: {
		        access_token: userToken // -> uri + '?access_token=xxxxx%20xxxxx' 
		    },
		    headers: {
		        'User-Agent': 'Request-Promise'
		    },
		    json: true // Automatically parses the JSON string in the response 
		};
		 
		rp(options)
		    .then(function (user) {
		        console.log('User login meeeeee: ' +  user.login);
		        response.redirect('/');
		        Cookies.set(user.login, userToken, { expires: 7 });
		        userToken = '';
		        console.log('user cookie: ' + Cookies.get(user.login));
		        //response.redirect('/');
		    })
		    .catch(function (err) {
		        // API call failed... 
		    });

	  }
	});

	// request('https://api.github.com/user?access_token=' + userToken, function (err, resp, bo) {
 //  		if (!err && resp.statusCode == 200) {
 //  			console.log("responsebody: " + bo);
 //  		}
 //  	});
	// app.get('https://api.github.com/user?access_token=' + userToken, function(req, res){
	// 	console.log('in app.get');

	// });

	// var userUrl = 'https://api.github.com/user?access_token=';
	// console.log('before get: ' + userToken);
	// //var req = new XMLHttpRequest();
	// req.open('GET', userUrl + userToken, true);

	// console.log('userUrl: ' + userUrl + userToken);

	// //req.setRequestHeader('Authorization', 'token ' + userToken);
	// req.addEventListener('load', function(e){
	// 	if (req.status == 200) {
	// 		var data = JSON.parse(req.responseText);
	// 		console.log(data);
	// 		//response.json(data);
	// 	}
	// }, false);

	//response.redirect('/');

});

console.log('outside');

app.listen(process.env.PORT, function(){
    console.log('- Server listening on port ' + process.env.PORT);
});
