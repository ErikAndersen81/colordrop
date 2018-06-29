// Variables holding the clicked slots and the selected room.
var selected = null;
var target = null;
var selectedRoom = null;
init();

// Sets the appropriate classes for the selected slot and check if the light in that room changes
function clicked(d) {
    if (selected == null){
	selectedRoom = d.room;
	selected = d3.select("#"+d.id);
	d3.selectAll(".slot")
	    .classed("clickable", false)
	    .call(d3.drag().on("start", null));
	// Set the hand slots as clickable
	activateHands()
    } else {
	target = d3.select("#"+d.id);
	switchColors();
	setOpenRooms(selected.attr("id"));
	// Set the hands as unclickable
	deactivateHands();
	target = null;
	selected = null;
	if (d3.select("#"+finishRoom).classed("open")){
	    winner();
	}
    }
}


// Checks whether rooms adjacent to currently open rooms have similar color
// and opens or closes them accordingly
function setOpenRooms(){
    adjacentRooms[selectedRoom].forEach(
	function(a){
	    var col1 = d3.select("#" + a).style("fill");
	    var col2 = d3.select("#" + selectedRoom).style("fill");
	    if ( col1 == col2  && col1 != "rgb(255, 255, 255)"){
		openRoom(a);openRoom(selectedRoom);} else {closeRoom(a);}
	});
    d3.selectAll(".slot.open")
	.classed("clickable", true)
	.call(d3.drag()
	      .on("start", clicked));
    repeat();
    function repeat(){
	var open = d3.selectAll(".slot."+selectedRoom).classed("clickable");
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
    //d3.select("#group"+roomId).attr("transform", "scale(1.5, 1.5)");
    var group = d3.select("#group"+roomId);
    group.selectAll("circle").classed("closed", false).classed("open", true);
}

function closeRoom(roomId){
    //d3.select("#group"+roomId).attr("transform", "scale(0.66666, 0.66666)");
    d3.select("#"+roomId).classed("closed", true).classed("open", false);
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
    d3.selectAll(".light.open").each(e => fixLight(e));
}

function fixLight(light){
    light = light.id;
    var sources = d3.selectAll(".active." + light);
    if (sources.size() == 2){
	d3.select("#" + light).style("fill", getColor(
	    d3.select("#slot0" + light).style("fill"),
	    d3.select("#slot1" + light).style("fill")));
    } else {
	d3.select("#light" + light).style("fill","rgb(255, 255, 255)");
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
	.attr("x", "50%")
	.attr("y", "50%")
	.attr("fill", "red")
	.attr("stroke", "black")
	.attr("id", "win")
	.attr("font-size", "0em")
	.attr("text-anchor", "middle")
	.text("Excellent!");
    repeatWin();
    function repeatWin(){
	d3.select("#win")
	    .transition().ease(d3.easeElastic).duration(800)
	    .attr("font-size", "5em")
	    .transition().duration(200)
	    .attr("font-size", "2em")
	    .on("end", repeatWin);
    }
}

function init(){
    selectedRoom = startingRoom;
    openRoom(startingRoom);
    setOpenRooms(startingRoom);
}
