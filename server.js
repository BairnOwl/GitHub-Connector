var express = require('express');
var app = express();
var url;

var engines = require('consolidate');
app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/templates');
app.use(express.static('public'));

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var req = new XMLHttpRequest();

app.post('/data/:inputurl', function(request, response) {
	url = 'https://api.github.com/repos/Teradata/' + request.params.inputurl + '/pulls';
	req.open('GET', url, true);

	var token = ''; // PUT YOUR PERSONAL TOKEN HERE!!!

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

	var params = 'client_id=' + 'f112d8966964169f6ebb';
	req.onreadystatechange = function() {
		if (req.readyState == 4 && req.status == 200) {
            console.log("all good");
        }
	};

	req.open('GET', 'https://github.com/login/oauth/authorize', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(params);

});

// app.listen(process.env.PORT, function(){
//     console.log('- Server listening on port 8080');
// });

app.listen(8080, function(){
    console.log('- Server listening on port 8080');
});