function handleInput(e) {
    console.log('in handle');
    e.preventDefault();

    $("#results").css('display', 'block');
    var org = document.getElementById("org_url").value;
    var repo = document.getElementById("repo_url").value;
    var state = document.querySelector('input[name="status"]:checked').value;

    sendMessage(org, repo, state);
}

function sendMessage(org, repo, state) {
    console.log('in send message');
    var fd = new FormData(document.getElementById('input_form'));
    fd.append("org", org);
    fd.append("repo", repo);
    fd.append("state", state);

    var req = new XMLHttpRequest();

    req.onreadystatechange = function() {
        console.log("received " + req.readyState + ", " + req.status);
       
        if (req.readyState == 4 && req.status == 200) {
            var data = jQuery.parseJSON(req.responseText);
            console.log(data);
            var display = '<div class="pull_request">' 

            for (var i in data) {
                display = display + '<div class="single_request">' +
                    '<img class="profile_img" src=' + data[i].user.avatar_url + '>' +
                    '<div class="user_login"><a href=\"' + data[i].user.html_url + '\">' + data[i].user.login + '</a></div>' +
                    '<div class="request_title" ><a href=\"' + data[i].html_url + '\">' +  data[i].title + '</a></div>' +
                    '<div class="state" >state: ' + data[i].state + '</div>' +
                    '<div class="request_body" >  ' + data[i].body + '</div>' +
                    '<div class="request_number" >number: ' + data[i].number + '</div>' +
                    '<div class="created_at" >created at ' + data[i].created_at + '</div>' +
                    '<div class="updated_at" >updated at ' + data[i].updated_at + '</div>' +
                    '<div class="closed_at" >closed at ' + data[i].closed_at + '</div>' +
                    + '</div>';            	
            }

            display = display + '</div>'
            $('#results').append(display);
        }
    };

    req.open('POST', '/data/' + org + '/' + repo + '/' + state, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(fd);
}

window.addEventListener('load', function(){

    var username = $("#login-info").val();
    console.log('username: ' + username);
    input_form.addEventListener('submit', handleInput, false);
    $("#clear-btn").click(function(){
        $("#results").css('display', 'none');
    });

    //$("#slider").dateRangeSlider();
    // var username = $("#login-info").val();
    // console.log('username: ' + username);
	// var req = new XMLHttpRequest();

	// req.onreadystatechange = function() {
 //        if (req.readyState == 4 && req.status == 200) {
 //            var data = jQuery.parseJSON(req.responseText);

 //            for (var i in data) {
 //            	console.log(data[i]);
 //            	$('#results').append('<div class="pull-request"><ul>' +
 //            	'<li>ID: ' + data[i].id + '</li>' +
 //            	'<li>Number: ' + data[i].number + '</li>' +
 //            	'<li>Head label: ' + data[i].head.label + '</li>' +
 //            	'<li>State: ' + data[i].state + '</li>' +
 //            	'<li>User login: ' + data[i].user.login + '</li>' +
 //            	'<li>Created at: ' + data[i].created_at + '</li>' +
 //            	'<li>Updated at: ' + data[i].updated_at + '</li>' +
 //            	'<li>Closed at: ' + data[i].closed_at + '</li>' +
 //            	'<li>Merged at: ' + data[i].merged_at + '</li>' +
 //            	'<li>HTML URL: ' + data[i].html_url + '</li>' +
 //            	'</ul></div>');
 //            }
 //        }
 //    };

    //input_form.addEventListener('submit', handleInput, false);

    // var input = 'data';
    // req.open('POST', '/data/' + "presto", true);
    // req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // req.send();
}, false);