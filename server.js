var express = require('express');
var app = express();

var engines = require('consolidate');
app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/templates');

app.get('*', function(request, response){
	response.render('home.html');
});

app.listen(8080, function(){
    console.log('- Server listening on port 8080');
});