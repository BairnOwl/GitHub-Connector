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

	var con = req.open('GET', url, true);

	var token = 'fa5fcc0d9bedde34dd3f541c70bf0547092da7cb'; 	// PUT YOUR PERSONAL TOKEN HERE!!!

	req.setRequestHeader('Authorization', 'token ' + token);
	// req.setRequestHeader('state', 'closed');
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

app.listen(8080, function(){
    console.log('- Server listening on port 8080');
});