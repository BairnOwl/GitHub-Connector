function handleInput(e) {
    console.log('in handle');
    e.preventDefault();

    var words = $("#login-info").text().split(" ");
    var username = words[words.length-1];

    //alert(words[words.length-1]);

    $("#results").html('<p id="wait-icon">Please Wait</p>');
    //$("#results").css('text-align', 'center');
    $("#results").css('display', 'block');
    var org = document.getElementById("org_url").value;
    var repo = document.getElementById("repo_url").value;
    var state = document.querySelector('input[name="status"]:checked').value;
    console.log(org + " " + repo + " ");
    sendMessage(org, repo, state, username);
}

function sendMessage(org, repo, state, username) {
    console.log('in send message');
    var fd = new FormData(document.getElementById('input_form'));
    fd.append("org", org);
    fd.append("repo", repo);
    fd.append("state", state);
    fd.append("username", username);

    var req = new XMLHttpRequest();

    req.onreadystatechange = function() {
        console.log("received " + req.readyState + ", " + req.status);
       
        if (req.readyState == 4 && req.status == 200) {
            var data = jQuery.parseJSON(req.responseText);
            //console.log(data);
            var display = '<div class="pull_request">' 
            var options = {weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"};

            $("#results").text("");
            //$("#results").css('text-align', '');

            for (var i in data) {
                created_at = new Date(Date.parse(data[i].created_at)).toLocaleTimeString("en-us", options);
                updated_at = new Date(Date.parse(data[i].updated_at)).toLocaleTimeString("en-us", options);
                closed_at = new Date(Date.parse(data[i].closed_at)).toLocaleTimeString("en-us", options);

                if (i == data[data.length-1]) {
                    display = display + '<div class="single_request" style="margin-bottom: 0px">';
                    // '<div id="user-info"><img class="profile_img" src=' + data[i].user.avatar_url + '>' +
                    // '<div class="user_login"><a href=\"' + data[i].user.html_url + '\">' + data[i].user.login + '</a></div>' +
                    // '<div class="state" >state: ' + data[i].state + '</div>' +
                    // '<div class="request_number" >number: ' + data[i].number + '</div>' +
                    // '<div class="created_at" >created at ' + created_at + '</div>' +
                    // '<div class="updated_at" >updated at ' + updated_at + '</div>';
                
                    // if (data[i].state == "open"){
                    //     display = display + '<div class="closed_at" >open till now</div></div>';
                    // }else{
                    //     display = display + '<div class="closed_at" >closed at ' + closed_at + '</div></div>';
                    // }

                    // display = display + '<div class="request_title" ><a href=\"' + data[i].html_url + '\">' +  data[i].title + '</a></div>' +
                    //     '<div class="request_body" >  ' + data[i].body + '</div>' +
                    //     '</div>';

                    // break;
                }else{
                    display = display + '<div class="single_request">';
                }

                
                display = display + '<div id="user-info"><img class="profile_img" src=' + data[i].user.avatar_url + '>' +
                    '<div class="user_login"><a href=\"' + data[i].user.html_url + '\">' + data[i].user.login + '</a></div>' +
                    '<div class="state" >state: ' + data[i].state + '</div>' +
                    '<div class="request_number" >number: ' + data[i].number + '</div>' +
                    '<div class="created_at" >created at ' + created_at + '</div>' +
                    '<div class="updated_at" >updated at ' + updated_at + '</div>';
                
                if (data[i].state == "open"){
                    display = display + '<div class="closed_at" >open till now</div></div>';
                }else{
                    display = display + '<div class="closed_at" >closed at ' + closed_at + '</div></div>';
                }

                display = display + '<div class="request_title" ><a href=\"' + data[i].html_url + '\">' +  data[i].title + '</a></div>' +
                    '<div class="request_body" >  ' + data[i].body + '</div>' +
                    '</div>';            	
            }

            display = display + '</div>'
            $('#results').append(display);
        }
    };

    req.open('POST', '/data/' + org + '/' + repo + '/' + state + '/' + username, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(fd);
}

var minDate;
var maxDate;

window.addEventListener('load', function(){

    var username = $("#login-info").val();
    console.log('username: ' + username);
    //input_form.addEventListener('submit', handleInput, false);
    $("#send_button").click(handleInput);
    $("#clear-btn").click(function(){
        $("#results").css('display', 'none');
    });


    $("#slider").dateRangeSlider();
    $("#slider").on("valuesChanged", function(e, data) {
        minDate = data.values.min;
        maxDate = data.values.max;
        console.log(minDate + ", " + maxDate);
    });
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