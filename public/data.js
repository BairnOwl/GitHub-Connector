function handleInput(e) {
    e.preventDefault();

    var org = document.getElementById("org_url").value;
    var repo = document.getElementById("repo_url").value;
    console.log("input");
    sendMessage(org, repo);
}

function sendMessage(org, repo) {
    var fd = new FormData(document.getElementById('input_form'));
    fd.append("org", org);
    fd.append("repo", repo);
    console.log("sending message");

    var req = new XMLHttpRequest();
    // req.open('GET', '/data', true);
    // req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // req.send();

    req.onreadystatechange = function() {
        console.log("received");
        console.log(req.readyState);
        console.log(req.status);
        if (req.readyState == 4 && req.status == 200) {
            var data = jQuery.parseJSON(req.responseText);
            console.log(data);
            var display = '<div class="pull-request">' +
                '<table border="1" style="width:100%">' +
                  '<tr>' +
                    '<td>id</td>' +
                    '<td>state</td>' +
                    '<td>number</td>' +
                    '<td>head label</td>' +
                    '<td>user login</td>' +
                    '<td>created_at</td>' +
                    '<td>updated at</td>' +
                    '<td>closed_at</td>' +
                    '<td>merged at</td>' +
                    '<td>comments_url</td>' +      
                    '<td>commits_url</td>' +
                    '<td>diff_url</td>' +
                    '<td>html_url</td>' +
                    '<td>issue_url</td>' +
                  '</tr>';

            for (var i in data) {
            	// console.log(data[i]);
                display = display + '<tr>' +
                    '<td>' + data[i].id + '</td>' +
                    '<td>' + data[i].state + '</td>' +
                    '<td>' + data[i].number + '</td>' +
                    '<td>' + data[i].head.label + '</td>' +
                    '<td>' + data[i].user.login + '</td>' +
                    '<td>' + data[i].created_at + '</td>' +
                    '<td>' + data[i].updated_at + '</td>' +
                    '<td>' + data[i].closed_at + '</td>' +
                    '<td>' + data[i].merged_at + '</td>' +
                    '<td><a href=\"' + data[i].comments_url + '\">Comments</a></td>' +      
                    '<td><a href=\"' + data[i].commits_url + '\">Commits</a></td>' +
                    '<td><a href=\"' + data[i].diff_url + '\">Diffs</a></td>' +
                    '<td><a href=\"' + data[i].html_url + '\">HTML</a></td>' +
                    '<td><a href=\"' + data[i].issue_url + '\">Issues</a></td>' +
                  '</tr>';

            	// $('#results').append('<div class="pull-request"><ul>' +
             //    '<div class="head">Head label:' + data[i].head.label +'</div>' +
             //    '<img src=' + data[i].user.avatar_url + '>' +
            	// '<li>ID: ' + data[i].id + '</li>' +
            	// '<li>Number: ' + data[i].number + '</li>' +
            	// // '<li>Head label: ' + data[i].head.label + '</li>' +
            	// '<li>State: ' + data[i].state + '</li>' +
            	// '<li>User login: ' + data[i].user.login + '</li>' +
            	// '<li>Created at: ' + data[i].created_at + '</li>' +
            	// '<li>Updated at: ' + data[i].updated_at + '</li>' +
            	// '<li>Closed at: ' + data[i].closed_at + '</li>' +
            	// '<li>Merged at: ' + data[i].merged_at + '</li>' +
            	// '<li>HTML URL: ' + data[i].html_url + '</li>' +
            	// '</ul></div>');

                // $('#results').append(


                // );
            }

            display = display+'</table></div>'
            $('#results').append(display);
        }
    };

    req.open('POST', '/data/' + org + '/' + repo, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(fd);
}

window.addEventListener('load', function(){
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

    input_form.addEventListener('submit', handleInput, false);

    // var input = 'data';
    // req.open('POST', '/data/' + "presto", true);
    // req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // req.send();
}, false);