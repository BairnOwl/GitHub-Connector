function handleInput() {
    //e.preventDefault();
    var inputurl = document.getElementById("input_url").value;
    alert(inputurl);
    sendMessage(inputurl);
}

function sendMessage(inputurl) {
    var fd = new FormData(document.getElementById('input_form'));
    fd.append("company", inputurl);
    var req = new XMLHttpRequest();
    // req.open('GET', '/data', true);
    // req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // req.send();
    req.open('POST', '/' + inputurl, true);;
    req.send(fd);
}

window.addEventListener('load', function(){
	var req = new XMLHttpRequest();

	req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            var data = jQuery.parseJSON(req.responseText);
            console.log(data);
            var display = '<div class="pull-request">' +
                '<table border="1" style="width:100%">' +
                  '<tr>' +
                    '<td>state</td>' +
                    '<td>closed_at</td>' +
                    '<td>comments_url</td>' +      
                    '<td>commits_url</td>' +
                    '<td>created_at</td>' +
                    '<td>diff_url</td>' +
                    '<td>html_url</td>' +
                    '<td>id</td>' +
                    '<td>issue_url</td>' +
                  '</tr>';

            for (var i in data) {
            	// console.log(data[i]);
                display = display + '<tr>' +
                    '<td>' + data[i].state + '</td>' +
                    '<td>' + data[i].closed_at + '</td>' +
                    '<td>' + data[i].comments_url + '</td>' +      
                    '<td>' + data[i].commits_url + '</td>' +
                    '<td>' + data[i].created_at + '</td>' +
                    '<td>' + data[i].diff_url + '</td>' +
                    '<td>' + data[i].html_url + '</td>' +
                    '<td>' + data[i].id + '</td>' +
                    '<td>' + data[i].issue_url + '</td>' +
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

    input_form.addEventListener('submit', handleInput, false);

    var input = 'data';
    req.open('GET', '/data', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send();
}, false);