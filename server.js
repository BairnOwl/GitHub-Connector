var express = require('express');
var app = express();

var engines = require('consolidate');
app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/templates');
app.use(express.static('public'));

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var req = new XMLHttpRequest();

app.get('/', function(request, response){
	response.render('home.html');
});

app.get('/data', function(request, response) {
	var url = 'https://api.github.com/repos/prestodb/presto/pulls';

	req.open('GET', url, true);

	var token = '30151d9b304a70704c20bf735dbf9f668d55545d'; 	// PUT YOUR PERSONAL TOKEN HERE!!!

	req.setRequestHeader('Authorization', 'token ' + token);
	req.addEventListener('load', function(e){
		if (req.status == 200) {
			var data = JSON.parse(req.responseText);
			response.json(data);
		}
	}, false);

	req.send(null); 
});

app.listen(8080, function(){
    console.log('- Server listening on port 8080');
});