function handleInput() {
    //e.preventDefault();
    var inputurl = document.getElementById("input_url").value;
    sendMessage(inputurl);
}

function sendMessage(inputurl) {
    var fd = new FormData(document.getElementById('input_form'));
    fd.append("company", inputurl);
    var req = new XMLHttpRequest();
    // req.open('GET', '/data', true);
    // req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // req.send();

    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            var data = jQuery.parseJSON(req.responseText);
            console.log(data);
            for (var i in data) {
                console.log(data[i]);
                $('#results').append('<div class="pull-request"><ul>' +
                '<li>ID: ' + data[i].id + '</li>' +
                '<li>Number: ' + data[i].number + '</li>' +
                '<li>Head label: ' + data[i].head.label + '</li>' +
                '<li>State: ' + data[i].state + '</li>' +
                '<li>User login: ' + data[i].user.login + '</li>' +
                '<li>Created at: ' + data[i].created_at + '</li>' +
                '<li>Updated at: ' + data[i].updated_at + '</li>' +
                '<li>Closed at: ' + data[i].closed_at + '</li>' +
                '<li>Merged at: ' + data[i].merged_at + '</li>' +
                '<li>HTML URL: ' + data[i].html_url + '</li>' +
                '</ul></div>');
            }
        }
    };

    req.open('POST', '/data/' + inputurl, true);;
    req.send(fd);
}

window.addEventListener('load', function(){
	var req = new XMLHttpRequest();

	req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            var data = jQuery.parseJSON(req.responseText);

            for (var i in data) {
            	console.log(data[i]);
            	$('#results').append('<div class="pull-request"><ul>' +
            	'<li>ID: ' + data[i].id + '</li>' +
            	'<li>Number: ' + data[i].number + '</li>' +
            	'<li>Head label: ' + data[i].head.label + '</li>' +
            	'<li>State: ' + data[i].state + '</li>' +
            	'<li>User login: ' + data[i].user.login + '</li>' +
            	'<li>Created at: ' + data[i].created_at + '</li>' +
            	'<li>Updated at: ' + data[i].updated_at + '</li>' +
            	'<li>Closed at: ' + data[i].closed_at + '</li>' +
            	'<li>Merged at: ' + data[i].merged_at + '</li>' +
            	'<li>HTML URL: ' + data[i].html_url + '</li>' +
            	'</ul></div>');
            }
        }
    };

    input_form.addEventListener('submit', handleInput, false);

    var input = 'data';
    req.open('POST', '/data/' + "presto", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send();
}, false);