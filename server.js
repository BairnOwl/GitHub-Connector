var express = require('express');
var app = express();
var url;

var engines = require('consolidate');
app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/templates');
app.use(express.static('public'));

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var req = new XMLHttpRequest();

// function getDataInput(url, response) {
// 	req.open('GET', url, true);

// 	var token = 'f73a348b548c80c4675caad03698cc47fc74703f'; 	// PUT YOUR PERSONAL TOKEN HERE!!!

// 	req.setRequestHeader('Authorization', 'token ' + token);
// 	req.addEventListener('load', function(e){
// 		if (req.status == 200) {
// 			var data = JSON.parse(req.responseText);
// 			response.json(data);
// 		}
// 	}, false);

// 	req.send(null);
// }

app.post('/:inputurl', function(request, response){
	console.log(request.params.inputurl);
	url = 'https://api.github.com/repos/Teradata/' + request.params.inputurl + '/pulls';
	console.log(url, response);
	// req.open('GET', url, true);

	// var token = 'f73a348b548c80c4675caad03698cc47fc74703f'; 	// PUT YOUR PERSONAL TOKEN HERE!!!

	// req.setRequestHeader('Authorization', 'token ' + token);
	// req.addEventListener('load', function(e){
	// 	if (req.status == 200) {
	// 		var data = JSON.parse(req.responseText);
	// 		response.json(data);
	// 	}
	// }, false);

	// req.send(null);
	//console.log("server: " + url);
});

app.get('/', function(request, response){
	response.render('home.html');
});

app.get('/data', function(request, response) {

	//console.log('post' + request.params.data);
	var url = 'https://api.github.com/repos/Teradata/presto/pulls';
	//getDataInput(url, res);
	req.open('GET', url, true);

	var token = '3d5943bd7a782110eca24500e3e01b2510eadf3a';// PUT YOUR PERSONAL TOKEN HERE!!!

	req.setRequestHeader('Authorization', 'token ' + token);
	//req.setRequestHeader('state', 'closed');
	// req.setRequestHeader('per_page', 100);
	// req.params.state = "closed";
	console.log(req);


	req.addEventListener('load', function(e){
		if (req.status == 200) {
			var data = JSON.parse(req.responseText);
			response.json(data);
		}
	}, false);

	// req.send(null); 
	req.send();
});

// app.get('/data', function(request, response) {
// 	var url = 'https://api.github.com/repos/Teradata/presto/pulls';
// 	req.open('GET', url, true);

// 	var token = 'b971c66a6876555d225ac25abed8dc177af18c61'; // PUT YOUR PERSONAL TOKEN HERE!!!

// 	req.setRequestHeader('Authorization', 'token ' + token);
// 	req.addEventListener('load', function(e){
// 		if (req.status == 200) {
// 			var data = JSON.parse(req.responseText);
// 			response.json(data);
// 		}
// 	}, false);

// 	req.send(null); 
// });

app.listen(process.env.PORT, function(){
    console.log('- Server listening on port 8080');
});

// app.listen(8080, function(){
//     console.log('- Server listening on port 8080');
// });