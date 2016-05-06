var displayPage;
var cacheData;

function handleInput(e) {
    console.log('in handle');
    e.preventDefault();

    var words = $("#login-info").text().split(" ");
    var username = words[words.length-1];

    //alert(words[words.length-1]);
    //$("#results").css('text-align', 'center');
    //$("#results").css('display', 'block');
    var org = document.getElementById("org_url").value;
    var repo = document.getElementById("repo_url").value;
    var numReq = $("#req-num option:selected").val();
    if (repo == "" || 
        repo == undefined ||
        org == "" ||
        org == undefined ||
        numReq == "" ||
        numReq == undefined) {
        $("#error").css('display','block');
        $("#error").text('Please Fill in all Fields.');
        return;
    } else {
        $("#error").css('display', 'none');
    }

    $("#results").html('');
    $("#wait-icon").css('display', 'block');
    //$("#wait-icon").html('Please Wait');
    //alert('numReq: ' + numReq);
    var state = document.querySelector('input[name="status"]:checked').value;
   
    sendMessage(org, repo, state, numReq, username, 1);
}

function sendMessage(org, repo, state, per_page, username, page_num) {
    console.log('in send message');
    var fd = new FormData(document.getElementById('input_form'));
    fd.append("org", org);
    fd.append("repo", repo);
    fd.append("state", state);
    fd.append("per_page", per_page);
    fd.append("username", username);
    fd.append("page_num", page_num);
    //fd.append("numReq", numReq);

    var req = new XMLHttpRequest();

    req.onreadystatechange = function() {
        console.log("received " + req.readyState + ", " + req.status);
       
        if (req.readyState == 4 && req.status == 200) {
            var data = jQuery.parseJSON(req.responseText);
            cacheData = data;
            var display = '<div class="pull_request">' 
            var options = {weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"};

            $("#results").text("");

            var pull_request_dict = {};
           
            for (var i in data) {
                // created_at = new Date(Date.parse(data[i].created_at)).toLocaleTimeString("en-us", options);
                // updated_at = new Date(Date.parse(data[i].updated_at)).toLocaleTimeString("en-us", options);
                // closed_at = new Date(Date.parse(data[i].closed_at)).toLocaleTimeString("en-us", options);

                created_at = Date.parse(data[i].created_at);
                updated_at = Date.parse(data[i].updated_at);
                closed_at = Date.parse(data[i].closed_at);

                text = ''; 

                if (i == data[data.length-1]) {
                    text += '<div class="single_request" style="margin-bottom: 0px">';
                } else { 
                    text += '<div class="single_request">';
                }
                
                text += '<div id="user-info"><img class="profile_img" src=' + data[i].user.avatar_url + '>' +
                    '<div class="user_login"><a href=\"' + data[i].user.html_url + '\">' + data[i].user.login + '</a></div>' +
                    '<div class="state" >state: ' + data[i].state + '</div>' +
                    '<div class="request_number" >number: ' + data[i].number + '</div>' +
                    '<div class="created_at" >created at ' + new Date(created_at).toLocaleTimeString("en-us", options) + '</div>' +
                    '<div class="updated_at" >updated at ' + new Date(updated_at).toLocaleTimeString("en-us", options) + '</div>';
                
                if (data[i].state == "open"){
                    text += '<div class="closed_at" >open till now</div></div>';
                } else {
                    text += '<div class="closed_at" >closed at ' + new Date(closed_at).toLocaleTimeString("en-us", options) + '</div></div>';
                }

                text += '<div class="request_title" ><a href=\"' + data[i].html_url + '\">' +  data[i].title + '</a></div>' +
                    '<div class="request_body" >  ' + data[i].body + '</div>' +
                    '</div>';  

                pull_request_dict[data[i].number] = {
                    created_at: created_at,
                    updated_at: updated_at,
                    closed_at: closed_at,
                    text: text
                };

                display += text;          	
            }

            console.log(pull_request_dict);
            $("#wait-icon").css('display','none');
            $("#results").css('display', 'block');
            display = display + '</div>'
            $('#results').append(display);
            $("#menu").css('display', 'block');
            
            var minDate = getMinDate(pull_request_dict);
            var maxDate = getMaxDate(pull_request_dict);

            $("#slider").dateRangeSlider({
                bounds: {
                    min: new Date(minDate),
                    max: new Date(maxDate)
                }, 
                defaultValues: {
                    min: new Date(minDate),
                    max: new Date(maxDate)
                }
            });
            $("#slider").on("valuesChanged", function(e, data) {
                minDate = data.values.min;
                maxDate = data.values.max;
                console.log(minDate + ", " + maxDate);
            });

            displayPage = 'user';

            //if ()

            // d3 goes here
            display  = ''

            //timeline_graph(data);

            

        }
    };

    req.open('POST', '/data/' + org + '/' + repo + '/' + state + '/' + per_page + '/' + username + '/' + page_num, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(fd);
}


function timeline_graph(data){

    var visData = new Array(data.length);
    for (var i in data) {
        visData[i] = [data[i].user.login, data[i].number, Date.parse(data[i].created_at), Date.parse(data[i].updated_at), Date.parse(data[i].closed_at)];
    }

    var userList = [];
            // var visDataUser = []

            var startDate = new Date(visData[0][2]);
            var endDate = new Date();
            for (i=0; i<visData.length; i++){
                var createD = new Date(visData[i][2]);
                var closedD = new Date(visData[i][4]);
                if (startDate > createD){
                    startDate = createD;
                }
                var index = userList.indexOf(visData[i][0]);
                if (index == -1){
                    userList.push(visData[i][0]);
                    // visDataUser.push([visData[i][0], visData[i]]);                    
                // }else{
                //     visDataUser[index].push(visData[i]);
                }
                // if (endDate == "Invalid Date"){
                //     endDate = closedD;
                // }else{
                //     if (endDate < closedD){
                //         endDate = closedD;
                //     }
                // }
            }

            // console.log(startDate);
            // console.log(endDate);
            // console.log(endDate - startDate);
            console.log(userList);
            // console.log(visDataUser);

            var range = endDate - startDate;
            // for (i=0; i<visData.length; i++){
            //     var s = new Date(visData[i][2]);
            //     var u = new Date(visData[i][3]);
            //     var c = new Date(visData[i][4]);
            //     visData[i][2] = (s - startDate)/range;
            //     visData[i][3] = (u - startDate)/range;
            //     if (c == "Invalid Date"){
            //         visData[i][4] = 1;
            //     }else{
            //         visData[i][4] = (c - startDate)/range;
            //     }
            //     // console.log(visData[i][2], visData[i][3], visData[i][4]);
            // }

            //Width and height
            var w = 1000;
            var h = 1000;
            var t = 700;
            
    
            //Create SVG element
            var svg = d3.select("body")
                        .append("svg")
                        .attr("width", w)
                        .attr("height", h);

            

            var tooltip = d3.select("body")
              .append("div")
              .style("position", "absolute")
              .style("z-index", "10")
              .style("visibility", "hidden")
              .text("a simple tooltip")
              .style("width", "200px")
              .style("background-color", "yellow")
              .style("font-size", "10px");




            svg.selectAll("rectBackground")
            .data(visData)
            .enter()
            .append("rect")
            .attr("x", 500)
            .attr("y", function(d){
                var i = userList.indexOf(d[0]);
                return 190 + 30*i;
            })
            .attr("width", 800)
            .attr("height", 20)
            .attr("fill", "pink")
            .attr("opacity", "0.9");



            svg.selectAll("rectTime")
            .data(visData)
            .enter()
            .append("rect")
            .attr("x", function(d){
                var s = new Date(d[2]);
                var s2 = (s - startDate)/range;
                return 500 + s2 * t;
            })
            // .attr("x", 0)
            .attr("y", function(d){
                var i = userList.indexOf(d[0]);
                return 190 + 30*i;
            })
            .attr("width", function(d){
                var s = new Date(d[2]);
                var c = new Date(d[4]);
                var s2 = (s - startDate)/range;
                var c2;
                if (c == "Invalid Date"){
                    c2 = 1;
                }else{
                    c2 = (c - startDate)/range;
                }
                return (c2 - s2) * t;
            })
            .attr("height", 20)
            .attr("fill", "blue")
            .attr("opacity", "0.5")
            .on("mouseover", function(d){
                d3.select(this).style({fill:'red',});
                c = new Date(d[2]).toLocaleTimeString("en-us", options);
                e = new Date(d[4]).toLocaleTimeString("en-us", options);
                if (e == "Invalid Date" ){
                    e = "still open now";
                }
                tooltip.text("created at: " + c + " " + "closed at: " + e);
                tooltip.style("visibility", "visible");
            })
            .on("mousemove", function(d){
                d3.select(this).style({fill:'red',});
                c = new Date(d[2]).toLocaleTimeString("en-us", options);
                e = new Date(d[4]).toLocaleTimeString("en-us", options);
                if (e == "Invalid Date" ){
                    e = "still open now";
                }
                tooltip.text("created at: " + c + " " + "closed at: " + e);
                tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
            })
            .on("mouseout", function(){
                d3.select(this).style({fill:'blue',});
                tooltip.style("visibility", "hidden");
            });


            svg.selectAll("text")
               .data(userList)
               .enter()
               .append("text")
               .text(function(d) {
                    return d;
               })
               .attr("x", 380)
               .attr("y", function(d, i) {
                    return 200 + 30*i;
               })
               .attr("font-family", "sans-serif")
               .attr("font-size", "11px")
               .attr("fill", "red");
            
    

               var width = 800,
            height = 160,
            padding = 30;

                  
        // define the x scale (horizontal)
        var mindate = startDate,
            maxdate = endDate;
            
        var xScale = d3.time.scale()
          .domain([mindate, maxdate])    // values between for month of january
    .range([500, 1000]);   // map these the the chart width = total width minus padding at both sides
        
  
        
        // define the y axis
        var xAxis = d3.svg.axis()
            .orient("bottom")
            .scale(xScale);
            

        // draw x axis with labels and move to the bottom of the chart area
        svg.append("g")
            .attr("class", "xaxis")   // give it a class so it can be used to select only xaxis labels  below
            .attr("transform", "translate(0," + (height - padding) + ")")
            .call(xAxis);
            
        // now rotate text on x axis
        // solution based on idea here: https://groups.google.com/forum/?fromgroups#!topic/d3-js/heOBPQF3sAY
        // first move the text left so no longer centered on the tick
        // then rotate up to get 45 degrees.
       svg.selectAll(".xaxis text")  // select all the text elements for the xaxis
          .attr("transform", function(d) {
              return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-35)";
        });
            

}








var minDate;
var maxDate;

function getMinDate(dict) {
    var min = Number.MAX_SAFE_INTEGER;

    for (var key in dict) {
        if (dict[key]['created_at'] < min) {
            min = dict[key]['created_at'];
        }
    }
    return min;
}

function getMaxDate(dict) {
    var max = 0;

    for (var key in dict) {
        if (dict[key]['created_at'] > max) {
            max = dict[key]['created_at'];
        }
    }
    return max;
}

window.addEventListener('load', function(){

    var username = $("#login-info").val();
    console.log('username: ' + username);
    //input_form.addEventListener('submit', handleInput, false);
    $("#send_button").click(handleInput);
    $("#clear-btn").click(function(){
        $("#results").css('display', 'none');
    });

    $("#timeline-graph").click(function(){
        $("#user-search").css('color', '#8181ae');
        $("#user-search").css('background-color', 'white');
        $("#timeline-graph").css('color', 'white');
        $("#timeline-graph").css('background-color', '#8181ae');
        $("#graph2").css('color', '#8181ae');
        $("#graph2").css('background-color', 'white');
        if (displayPage == 'graph') {
            return;
        }
        displayPage = 'graph';
        $("#results").css('display', 'none');
        timeline_graph(cacheData);
        $("graph-panel").css('display', 'block');
    });

    $("#graph2").click(function(){
        $("#user-search").css('color', '#8181ae');
        $("#user-search").css('background-color', 'white');
        $("#timeline-graph").css('color', '#8181ae');
        $("#timeline-graph").css('background-color', 'white');
        $("#graph2").css('color', 'white');
        $("#graph2").css('background-color', '#8181ae');
        $("#results").css('display', 'none');
    });

    $("#user-search").click(function(){
        $("#user-search").css('color', 'white');
        $("#user-search").css('background-color', '#8181ae');
        $("#timeline-graph").css('color', '#8181ae');
        $("#timeline-graph").css('background-color', 'white');
        $("#graph2").css('color', '#8181ae');
        $("#graph2").css('background-color', 'white');
        if(displayPage == 'user') {
            return;
        }
        displayPage = 'user';
        d3.select("svg").remove();
        $("#results").css('display', 'block');
        $("#graph-panel").css('display', 'none');

    });

    // $("#slider").dateRangeSlider();
    // $("#slider").on("valuesChanged", function(e, data) {
    //     minDate = data.values.min;
    //     maxDate = data.values.max;
    //     console.log(minDate + ", " + maxDate);
    // });
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