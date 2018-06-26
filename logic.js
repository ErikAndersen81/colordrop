// Sets the appropriate classes for the selected slot and check if the light in that room changes
function clicked(d) {
    if (selected == null){
	selected = d3.select("#" + d.id);
	console.log(d.id.slice(5,6));
	d3.selectAll(".slot."+d.id.slice(5,6))
	    .classed("clickable", false)
	    .call(d3.drag().on("start", null));
	// Set the hand slots as clickable
	activateHands()
    } else {
	target = d3.select("#" + d.id);
	switchColors();
	setOpenRooms(selected.attr("id").slice(5,6));
	// Set the hands as unclickable
	deactivateHands();
	target = null;
	selected = null;
	if (d3.select("#"+finishRoom).classed("open")){
	    winner();
	}
    }
}

function setOpenRooms(room){
    adjacentRooms[room].forEach(
	function(a){
	    var col1 = d3.select("#light" + a).style("fill");
	    var col2 = d3.select("#light" + room).style("fill");
	    if ( col1 == col2  && col1 != "rgb(255, 255, 255)"){
		openRoom(a);openRoom(room);} else {closeRoom(a);}
	});
    d3.selectAll(".slot."+room)
	.classed("clickable", true)
	.call(d3.drag().on("start", clicked));
    repeat();
    function repeat(){
	var open = d3.selectAll(".slot."+room).classed("clickable");
	if (open){
	    d3.selectAll(".clickable")
		.style("stroke", "rgb(180, 180, 180)")
		.style("stroke-width", "3px")
		.transition().duration(600)
		.style("stroke", "rgb(0, 0, 0)")
		.style("stroke-width", "1px")
		.on("end", repeat);
	}
    }
}

function openRoom(roomId){
    d3.select("#"+roomId).classed("closed", false).classed("open", true);
    d3.select("#light"+roomId).classed("closed", false).classed("open", true);
    d3.selectAll(".slot." + roomId)
	.classed("clickable clickable open", true)
	.classed("closed", false)
	.call(d3.drag()
	      .on("start", clicked));
}

function closeRoom(roomId){
    d3.select("#"+roomId).classed("closed", true).classed("open", false);
    d3.select("#light"+roomId).classed("closed", true).classed("open", false);
    d3.selectAll(".slot.clickable."+roomId)
	.classed("clickable open", false)
	.classed("closed", true);
}

function activateHands(){
    d3.selectAll(".hand")
	.classed("clickable open", true)
	.classed("closed", false)
	.call(d3.drag().on("start", clicked));
    repeat();
    function repeat(){
	var open = d3.selectAll(".hand").classed("clickable");
	if (open){
	    d3.selectAll(".hand")
		.style("stroke", "rgb(180, 180, 180)")
		.style("stroke-width", "3px")
		.transition().duration(600)
		.style("stroke", "rgb(0, 0, 0)")
		.style("stroke-width", "1px")
		.on("end", repeat);
	}
    }
}

function deactivateHands(){
    d3.selectAll(".hand")
	.classed("clickable open", false)
	.classed("closed", true)
	.style("stroke", "rgb(0, 0, 0)")
	.call(d3.drag().on("start", null));
}

function switchColors(){
    var tempCol = selected.style("fill");
    selected.style("fill",target.style("fill"));
    target.style("fill", tempCol);
    selected.classed("active", e => e.active)
	.style("stroke", "rgb(0, 0, 0)")
    fixLights();
}


function fixLights(){
    d3.selectAll(".room.open").each(e => fixLight(e));
}

function fixLight(room){
    room = room.id;
    var sources = d3.selectAll(".active." + room);
    if (sources.size() == 2){
	d3.select("#light" + room).style("fill", getColor(
	    d3.select("#slot0" + room).style("fill"),
	    d3.select("#slot1" + room).style("fill")));
    } else {
	d3.select("#light" + room).style("fill","rgb(255, 255, 255)");
    }
}

function getColor(a,b){
    if (a==b && a != "rgb(255, 255, 255)" ){ return a; }
    if ((a == "rgb(255, 255, 0)" && b == "rgb(0, 0, 255)" ) || (b == "rgb(255, 255, 0)" && a == "rgb(0, 0, 255)" )){ return "rgb(0, 255, 0)";}
    if ((a == "rgb(255, 0, 0)" && b == "rgb(0, 0, 255)" ) || (b == "rgb(255, 0, 0)" && a == "rgb(0, 0, 255)" )){ return "rgb(128, 0, 128)";}
    if ((a == "rgb(255, 0, 0)" && b == "rgb(255, 255, 0)" ) || (b == "rgb(255, 0, 0)" && a == "rgb(255, 255, 0)" )){ return "rgb(255, 128, 0)";}
    if (a == "rgb(255, 255, 255)" && b == "rgb(255, 255, 255)"){return "rgb(0,0,0)"}
    return "rgb(255, 255, 255)";
}


function winner(){
    d3.selectAll(".slot")
	.classed("clickable", false)
	.call(d3.drag().on("start", null));
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
	.attr("x", 380)
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


var selected = null;
var target = null;

var flag = false;
openRoom(startingRoom);
setOpenRooms(startingRoom);
