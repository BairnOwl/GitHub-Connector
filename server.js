var express = require('express');
var app = express();
var url;
var userToken;
var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');

//var cookies = require('cookies');
var rp = require('request-promise');

var engines = require('consolidate');
app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/templates');
app.use(express.static('public'));

app.use(cookieParser());

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

var users = {};

app.get('/cookie',function(req, res){
     res.cookie('user_name' , 'BairnOwl').send('Cookie is set');
});

// GitHub Strategy module
// var passport = require('passport');
// var GitHubStrategy = require('passport-github').Strategy;
 
// passport.use(new GitHubStrategy({
//     clientID: 'f112d8966964169f6ebb',
//     clientSecret: '538d16b411d8a82ba90e26a298a8c40345fab874',
//     callbackURL: 'https://gitbuddy.herokuapp.com/test'
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ githubId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));

// app.get('/auth/github',
//   passport.authenticate('github'));
 
// app.get('/test', 
//   passport.authenticate('github', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     console.log(res.responseText); 
//     res.redirect('/init');
// });

//This function is credit to http://jsfiddle.net/wSQBx/
var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

app.post('/data/:org/:repo/:state', function(request, response) {
	console.log('getting cookie');
	//console.log(cookies.get('BairnOwl'));

	var org = request.params.org;
	var repo = request.params.repo;
	var state = request.params.state;

	url = 'https://api.github.com/repos/' + org + '/' + repo + '/pulls?state=' + state;
	req.open('GET', url, true);

	//console.log('usertoken: ' + users['lmhly']);

	var token = users['BairnOwl']; // PUT YOUR PERSONAL TOKEN HERE!!!

	//console.log('usertoken: ' + users['lmhly']);

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
	response.render('login.html');
});

app.get('/init', function(request, response){
	response.render('home.html');
});

app.get('/login', function(request, response) {
	var req = new XMLHttpRequest();

	var random = randomString(32, chars);
	//var uri = 'localhost:8080/home';
	//console.log("random: " + random);
	var params = '?client_id=f112d8966964169f6ebb&state=' + 
		random + 'scope=user,public_repo';
	//console.log("params: " + params);
	
	var path = 'https://github.com/login/oauth/authorize';
	path += params;
	response.redirect(path);

	req.onreadystatechange = function() {
		//console.log('in req');
		//console.log(req.param);
		if (req.readyState == 4 && req.status == 200) {
			var code = req.responseText;
            //console.log("response: " + req.responseText);
        }
	};

	req.open('GET', 'https://github.com/login/oauth/authorize?' + params, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
});

var userLogin;
app.get('/home', function(requ, response) {
	var code = requ.param('code');
	var state = requ.param('state');
	//var userLogin;
	headers = requ.headers;
	path = '/login/oauth/access_token';
	headers.host = 'api.github.com';

	var params = '?client_id=f112d8966964169f6ebb' + 
				 '&client_secret=538d16b411d8a82ba90e26a298a8c40345fab874' + 
				 '&code=' + code;

	path += params;

	var flag = 0;

 	request('https://github.com/login/oauth/access_token' + params, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	var parsed = queryString.parse(body);
	  	console.log('token: ' + parsed.access_token);
	  	userToken = parsed.access_token;
	  	//console.log('token 2: ' + userToken);

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
		    	userLogin = user.login;
		        console.log('User login meeeeee: ' +  user.login);
		        console.log('User token meeeeee: ' +  userToken);
		        users[userLogin] = userToken;
		       
		        //cookies.set('BairnOwl', userToken);
		        userToken = '';
		        flag = 1;
		    })
		    .catch(function (err) {
		        // API call failed... 
		    });
	  }
	});
	response.render('home.html', {username: userLogin, token: users[userLogin]});

});

app.listen(process.env.PORT, function(){
    console.log('- Server listening on port ' + process.env.PORT);
});
