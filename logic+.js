// Sets the appropriate classes for the selected slot and check if the light in that room changes
function clicked(d) {
    if (selected == null){
	selected = d3.select("#" + d.id);
	// Set classes and visualize selection
	d3.select("#"+d.id).raise()
	    .classed("grabbed", true)
	    .classed("active", false)
	    .classed("clickable", false)
	    .transition().style("stroke", "rgb(200, 200, 200)");
	if (d.id.slice(0,4) != "hand"){
	    // Make sure all other rooms are closed
	    d3.selectAll(".room").each(e => closeRoom(e.id));
	    d3.select("." + d.room).each(e => openRoom(e.id));
	}
	markForSelection();
    } else {
	target = d3.select("#" + d.id);
	switchColors();
	console.log(d.id.slice(0,4))
	if (d.id.slice(0,4) != "hand"){
	    setOpenRooms(target.attr("id").slice(5,6));
	} else {
	    setOpenRooms(selected.attr("id").slice(5,6));
	}
	target = null;
	selected = null;
	unmarkForSelection();
    }
    
}


function switchColors(){
    var tempCol = selected.style("fill");
    selected.style("fill",target.style("fill"));
    target.style("fill", tempCol);
    selected.classed("grabbed", false)
	.classed("active", e => e.active)
	.classed("clickable", true)
	.style("stroke", "rgb(0, 0, 0)")
    fixLights();
}


function fixLights(){
    d3.selectAll(".room").each(e => fixLight(e));
}

function fixLight(room){
    room = room.id;
    var sources = d3.selectAll(".active.clickable." + room);
    d3.select("#light" + room).style("fill", getColor(
	d3.select("#slot0" + room).style("fill"),
	d3.select("#slot1" + room).style("fill")));
}


function getColor(a,b){
    if (a==b && a != "rgb(255, 255, 255)" ){ return a; }
    if ((a == "rgb(255, 255, 0)" && b == "rgb(0, 0, 255)" ) || (b == "rgb(255, 255, 0)" && a == "rgb(0, 0, 255)" )){ return "rgb(0, 255, 0)";}
    if ((a == "rgb(255, 0, 0)" && b == "rgb(0, 0, 255)" ) || (b == "rgb(255, 0, 0)" && a == "rgb(0, 0, 255)" )){ return "rgb(128, 0, 128)";}
    if ((a == "rgb(255, 0, 0)" && b == "rgb(255, 255, 0)" ) || (b == "rgb(255, 0, 0)" && a == "rgb(255, 255, 0)" )){ return "rgb(255, 128, 0)";}
    if (a == "rgb(255, 255, 255)" && b == "rgb(255, 255, 255)"){return "rgb(0,0,0)"}
    return "rgb(255, 255, 255)";
}

function setOpenRooms(room){
    adjacentRooms[room].forEach(
	function(a){
	    var col1 = d3.select("#light" + a).style("fill");
	    var col2 = d3.select("#light" + room).style("fill");
	    if ( col1 == col2  && col1 != "rgb(255, 255, 255)"){
		openRoom(a);openRoom(room);} else {closeRoom(a);}
    });
}

function openRoom(roomId){
    d3.select("#"+roomId).classed("closed", false)
    d3.select("#light"+roomId).classed("closed", false);
    for(var i =0;i<3;i++){
	d3.select("#slot"+ i + roomId)
	    .classed("clickable", true)
	    .classed("closed", false)
	    .call(d3.drag()
		  .on("start", clicked))
    }
    if (roomId == finishRoom){
	winner();
    }
}

function closeRoom(roomId){
    d3.select("#"+roomId).classed("closed", true);
    d3.select("#light"+roomId).classed("closed", true);
    for(var i=0;i<3;i++){
	d3.select("#slot"+i+roomId)
	    .classed("clickable", false)
	    .classed("closed", true)
    }
}

function winner(){
    var svgDefs = puzzle.append('defs');

    var mainGradient = svgDefs.append('linearGradient')
        .attr('id', 'mainGradient');

    // Create the stops of the main gradient. Each stop will be assigned
    // a class to style the stop using CSS.
    mainGradient.append('stop')
        .attr('class', 'stop-left')
        .attr('offset', '0');

    mainGradient.append('stop')
        .attr('class', 'stop-right')
        .attr('offset', '1');

    var text = puzzle.append("text")
	.classed('filled', true)
	.attr("x", 300)
	.attr("y", 200)
	.attr("fill", "red")
	.attr("stroke", "black")
	.attr("transform", "rotate(10 380 100)")
	.attr("id", "win")
	.attr("font-size", "1px")
	.attr("text-anchor", "middle")
	.text("Excellent!");
    
    text.transition().duration(600)
	.attr("font-size", "100px")
	.on("end", repeatWin);
    
    function repeatWin(){
	d3.select("#win")
	    .attr("font-size", "100px")
	    .attr("transform", "rotate(10 380 100)")
	    .transition().duration(600)
	    .attr("font-size", "60px")
	    .attr("transform", "rotate(0 380, 100)")
	    .transition().duration(600)
	    .attr("font-size", "100px")
	    .attr("transform", "rotate(-20 380 100)")
	    .transition().duration(600)
	    .attr("font-size", "60px")
	    .attr("transform", "rotate(0 380, 100)")
	    .transition().duration(600)
	    .attr("font-size", "100px")
	    .attr("transform", "rotate(10 380 100)")
	    .on("end", repeatWin);
    }
}

function markForSelection(){
    if (selected.style("fill") == "rgb(255, 255, 255)"){
	var potentialTargets = d3.selectAll(".clickable").filter(e => d3.select("#"+e.id).style("fill") != "rgb(255, 255, 255)");
	var excluded = d3.selectAll(".clickable").filter(e => d3.select("#"+e.id).style("fill") == "rgb(255, 255, 255)");
    } else {
	var potentialTargets = d3.selectAll(".clickable").filter(e => d3.select("#"+e.id).style("fill") == "rgb(255, 255, 255)");
	var excluded = d3.selectAll(".clickable").filter(e => d3.select("#"+e.id).style("fill") != "rgb(255, 255, 255)");
    }
    excluded.classed("clickable", false)
	.classed("closed excluded", true)
	.call(d3.drag()
	      .on("start", null))
    flag = true;
    repeat();
    function repeat(){
	if (flag){
	    potentialTargets
		.style("stroke", "rgb(180, 180, 180)")
		.style("stroke-width", "3px")
		.transition().duration(600)
		.style("stroke", "rgb(0, 0, 0)")
		.style("stroke-width", "1px")
		.on("end", repeat);
	};
    }
}

function unmarkForSelection(){
    flag = false
    d3.selectAll(".excluded")
	.classed("clickable", true)
	.classed("closed excluded", false)
	.call(d3.drag()
	      .on("start", clicked));
    d3.selectAll(".clickable").style("stroke", "rgb(0, 0, 0)");
}

var selected = null;
var target = null;
// activate hands
d3.selectAll(".G").classed("clickable", true)
    .classed("closed", false)
    .call(d3.drag()
	  .on("start", clicked));

var white = null;
var flag = false;
openRoom(startingRoom);
