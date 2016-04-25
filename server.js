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
var request = require('request');

//This function is credit to http://jsfiddle.net/wSQBx/
var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

app.post('/data/:org/:repo/:state', function(request, response) {
	var org = request.params.org;
	var repo = request.params.repo;
	var state = request.params.state;

	url = 'https://api.github.com/repos/' + org + '/' + repo + '/pulls?state=' + state;
	req.open('GET', url, true);

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

// app.get('/login', function(request, response) {
// 	var req = new XMLHttpRequest();

// 	var random = randomString(32, chars);
// 	//var uri = 'localhost:8080/home';
// 	console.log("random: " + random);
// 	var params = '?client_id=f112d8966964169f6ebb&state=' + 
// 		random + 'scope=user,public_repo';
// 	console.log("params: " + params);
	
// 	var path = 'https://github.com/login/oauth/authorize';
// 	path += params;
// 	response.redirect(path);

// 	req.onreadystatechange = function() {
// 		console.log('in req');
// 		//console.log(req.param);
// 		if (req.readyState == 4 && req.status == 200) {
// 			var code = req.responseText;
//             console.log("response: " + req.responseText);
//         }
// 	};

// 	req.open('GET', 'https://github.com/login/oauth/authorize?' + params, true);
//     req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//  //    req.send(params);

// });

//OAuth1.0 - 3-legged server side flow (Twitter example) 
//step 1 
app.get('/login', function(request, response) {
	var random = randomString(32, chars);
	var qs = require('querystring')
	  , oauth =
	    { client_id: 'f112d8966964169f6ebb'
	    , state: random.toString()
	    }
	  , url = 'https://github.com/login/oauth/authorize'
	  ;
	request.get({url:url, oauth:oauth}, function (e, r, body) {
	  console.log('in authorize: ');
	  // Ideally, you would take the body in the response 
	  // and construct a URL that a user clicks on (like a sign in button). 
	  // The verifier is only available in the response after a user has 
	  // verified with twitter that they are authorizing your app. 
	 
	  // step 2 
	  // var req_data = qs.parse(body)
	  // var uri = 'https://api.github.com/user'
	  //   + '?' + qs.stringify({access_token: req_data.code})
	  // redirect the user to the authorize uri 
	 
	  // step 3 
	  // after the user is redirected back to your server 
	  var auth_data = qs.parse(body)
	    , oauth =
	      { client_id: 'f112d8966964169f6ebb'
	      , client_secret: '538d16b411d8a82ba90e26a298a8c40345fab874'
	      , code: auth_data.code
	      }
	    , url = 'https://github.com/login/oauth/access_token'
	    ;
	   console.log("auth_data.code: " + auth_data.code);
	  request.post({url:url, oauth:oauth}, function (e, r, body) {
	  	console.log('get token');
	  	//console.log('body: ' +);
	    // ready to make signed requests on behalf of the user 
	    // var perm_data = qs.parse(body)
	    //   , oauth =
	    //     { access_token: perm_data.access_token;
	    //     }
	    //   , url = 'https://api.github.com/user'
	    //   , qs =
	    //     { screen_name: perm_data.screen_name
	    //     , user_id: perm_data.user_id
	    //     }
	    //   ;
	    // request.get({url:url, oauth:oauth, qs:qs, json:true}, function (e, r, user) {
	    //   console.log(user)
	    //})
	  })
	})
});

app.get('/', function(request, response){
	response.render('home.html');
});

// app.get('/login', function(request, response) {
// 	var req = new XMLHttpRequest();

// 	var random = randomString(32, chars);
// 	//var uri = 'localhost:8080/home';
// 	console.log("random: " + random);
// 	var params = '?client_id=f112d8966964169f6ebb&state=' + 
// 		random + 'scope=user,public_repo';
// 	console.log("params: " + params);
	
// 	var path = 'https://github.com/login/oauth/authorize';
// 	path += params;
// 	response.redirect(path);

// 	req.onreadystatechange = function() {
// 		console.log('in req');
// 		//console.log(req.param);
// 		if (req.readyState == 4 && req.status == 200) {
// 			var code = req.responseText;
//             console.log("response: " + req.responseText);
//         }
// 	};

// 	req.open('GET', 'https://github.com/login/oauth/authorize?' + params, true);
//     req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//  //    req.send(params);

// });

// //var url = 'https://gitbuddy.herokuapp.com/home?';


// //refer to http://blog.csdn.net/yangnianbing110/article/details/42925987.
// app.get('/home', function(request, response) {
// 	var code = request.param('code');
// 	var state = request.param('state');
// 	//response.render('dummy.html', {code: code, state: state});
// 	var headers = request.headers;
// 	path = '/login/oauth/access_token';
// 	headers.host = 'github.com';
	
// 	// //var req = new XMLHttpRequest();

// 	var params = '?client_id=f112d8966964169f6ebb' + 
// 				 '&client_secret=538d16b411d8a82ba90e26a298a8c40345fab874' + 
// 				 '&code=' + code;

// 	path += params;

// 	//response.render('dummy.html', {code: code, state: state, data: path});

// 	var opts = {
// 		hostname:'github.com',
// 		port:'443',
// 		path: path,
// 		headers: headers,
// 		method: 'POST'
// 	}
// 	var token;
// 	var args = 'args';
// 	var req = https.request(opts, function(res){
// 		//console.log('in http');
// 		//res.render('dummy.html', {code: 'code', state: 'state'});
// 		res.setEncoding('utf8');
// 		//res.render('dummy.html', {code: 'code', state: 'state'});
// 		res.on('data', function(data){
// 			args = data;
// 			console.log('data in data: ' + data);
// 			// var tokenInfo = args[0].split('=');
// 			// token = tokenInfo[1];
// 			//response.render('dummy.html', {code: code, state: state});
// 		});
// 	});
// 	response.render('dummy.html', {code: 'code', state: 'state', data: 'data: ' + args});
// 	// 	//console.log(response.param('access_toke'));
// 	// });
// 	// var data;
// 	// req.onreadystatechange = function() {
// 	// 	//console.log(req.readyState);
// 	// 	//console.log(req.status);
// 	// 	//response.render('dummy.html', {code: req.responseText, state: 'state'});
// 	// 	if (req.readyState == 4 && req.status == 200) {
// 	// 		data = req.responseText;
// 	// 		//response.render('dummy.html', {code: 'code', state: 'state'});
// 	// 		//console.log(req.responseText.access_token);
//  //            console.log('owls');
//  //        } else {
//  //        	//console.log(req);
//  //        }
// 	// };
// 	// //response.render('dummy.html', {code: 'code', state: 'state', data: data});

// 	// req.open('POST', 'https://github.com/login/oauth/access_token' + params, true);
//  //    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//  //    response.render('dummy.html', {code: 'code', state: 'state', data: 'data: ' + data});
//  //    req.send(params);
// });

console.log('outside');
// app.get('')

app.listen(process.env.PORT, function(){
    console.log('- Server listening on port ' + process.env.PORT);
});
