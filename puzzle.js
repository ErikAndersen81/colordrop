// The layout of the puzzle
data = [
    {a:"rgb(255, 0, 0)", b:"rgb(255, 0, 0)", c:"rgb(0, 0, 255)", adjacent:[1,3]},
    {a:"rgb(255, 255, 255)", b:"rgb(255, 255, 255)", c:"rgb(0, 0, 255)", adjacent:[0,4,2]},
    {a:"rgb(255, 0, 0)", b:"rgb(255, 255, 0)", c:"rgb(255, 255, 255)", adjacent:[1,5]},
    {a:"rgb(255, 0, 0)", b:"rgb(0, 0, 255)", c:"rgb(255, 255, 255)", adjacent:[0,4]},
    {a:"rgb(0, 0, 255)", b:"rgb(0, 0, 255)", c:"rgb(255, 255, 0)", adjacent:[3,1]},
    {a:"rgb(255, 0, 0)", b:"rgb(255, 0, 0)", c:"rgb(0, 0, 0)", adjacent:[2]}
];

// Global variables to be used in various stuff
var selected = null;
var target = null;
var size;
var links = [];
for (let i = 0; i < data.length;i++) {
    data[i].adjacent.forEach(e => links.push({"source":i,"target":parseInt(e)}));
}
draw();
d3.selectAll("g.nodes").property("scale", size/12);
d3.selectAll(".slot.group0").classed("open clickable", true).call(flash);

activateLight(0);
var simulation = move();


 // Displays a gratulatory expression in a festive manner.
function winner(){
    d3.selectAll(".slot")
	.classed("clickable", false)
	.call(d3.drag().on("start", null));
    var puzzle = d3.select("svg");
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
	.attr("y", "35%")
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

// Initialize the puzzle    
function draw(){
    var chartDiv = document.getElementById("chart");
    var puzzle = d3.select(chartDiv).append("svg");

    // Create the links
    var link = puzzle.append("g")
	.attr("class", "links")
	.selectAll("line")
	.data(links)
	.enter().append("line")
	.attr("stroke-width", 5)
	.attr("stroke", "#090")
	.attr("stroke-opacity", 0.6);

    // Create the nodes for holding the lights
    var nodes = puzzle.selectAll("g:not(.links)")
	.data(data)
	.enter()
	.append("g")
	.attr("class", "nodes")
	.attr("id", function(d, i){return "group"+i;})
	.attr("open", false)
    
    // Extract the width and height that was computed by CSS.
    var width = chartDiv.clientWidth;
    var height = chartDiv.clientHeight;
    size = Math.min(height, width);

    // Use the extracted size to set the size of an SVG element.
    puzzle
        .attr("width", size)
        .attr("height", size);

    // Draw the lights
    nodes
	.append("circle")
	.attr("r", function(d){return size/6;})
	.style("fill", getColor)
	.attr("class", function(d,i){return "light group"+i;})
	.attr("light", function(d, i){return i;});

    var r = (size/6)*(2.8/7),
	p = size/12,
	q = p*6/7,
	s = p*4/7;
    
    // Draw the active slots
    nodes
	.append("circle")
	.attr("r", function(d){return r;})
	.style("fill", function(d){return d.a;})
	.attr("cx", function(d, i){return q})
	.attr("cy", function(d, i){return -s})
	.attr("class", function(d,i){return "slot group"+i;})
	.attr("light", function(d, i){return i;})
	.attr("slot", "a");

    nodes
	.append("circle")
	.attr("r", function(d){return r;})
	.style("fill", function(d){return d.b;})
	.attr("cx", function(d, i){return -q;})
	.attr("cy", function(d, i){return -s})
	.attr("class", function(d,i){return "slot group"+i;})
	.attr("light", function(d, i){return i;})
	.attr("slot", "b");
    
    // Draw the inactive slot
    nodes
	.append("circle")
	.attr("r", function(d){return r})
	.attr("cx", function(d, i){return 0;})
	.attr("cy", function(d, i){return p})
	.style("fill", function(d){return d.c;})
	.attr("class", function(d,i){return "slot group"+i;})
	.attr("light", function(d, i){return i;})
	.attr("slot", "c");
    
    // Create the 'hands'.
    puzzle
	.append("circle")
	.attr("class", "hand")
	.attr("r", size/15)
	.attr("cx", size*0.93/6)
	.attr("cy", 5.07*size/6)
	.style("fill", "rgb(255, 255, 255)");

    puzzle
	.append("circle")
	.attr("class", "hand")
	.attr("r", size/15)
	.attr("cx", size-size*0.93/6)
	.attr("cy", 5.07*size/6)
	.style("fill", "rgb(255, 255, 255)");

    // Add the drawings of actual hands
    puzzle.append("image")
	.attr("xlink:href","leftHand.svg")
	.attr("width", size/4)
	.attr("height", size/4)
	.attr("y", size*3/4);

    puzzle.append("image")
	.attr("xlink:href","rightHand.svg")
	.attr("width", size/4)
	.attr("height", size/4)
	.attr("y", size*3/4)
	.attr("x", size*3/4);
}

// Makes selectable slots flash
function flash(slots){
    slots.call(d3.drag().on("start", clicked));
    var type = slots.classed("hand") ? ".hand":".slot";
    repeat();
    function repeat(){
	var open = d3.selectAll(type+".clickable");
	if (open.size() != 0){
	    d3.selectAll(type+".clickable")
		.style("stroke", "rgb(180, 180, 180)")
		.style("stroke-width", "3px")
		.transition().duration(600)
		.style("stroke", "rgb(0, 0, 0)")
		.style("stroke-width", "1px")
		.on("end", repeat);
	}
	else {
	    slots.call(d3.drag().on("start", null));
	}
    }
}

// Handles user clicking
function clicked(d, i, nodes){
    if (selected === null) {
	selected = d3.select(nodes[i]);
	d3.selectAll(".slot").classed("clickable", false);
	d3.selectAll(".hand").classed("clickable", true).call(flash);
    }
    else {
	target = d3.select(nodes[i]);
	var col1 = selected.style("fill"),
	    col2 = target.style("fill");
	selected.style("fill", col2);	
	target.style("fill", col1);
	var data = selected.data();
	data[0][selected.attr("slot")] = col2;
	selected.data(data).enter();
	d3.selectAll(".hand").classed("clickable", false);
	lightChange(selected.attr("light"));
	d3.selectAll(".open").classed("clickable", true).call(flash)
	selected = target = null;
    }
}

// Activate and deactivates light. Argument is the index of the light.
function activateLight(light){
    console.log("activate: " + light);
    if (parseInt(light) == data.length-1) {
	winner();
    }
    d3.selectAll(".slot.group"+light).classed("open clickable", true);
    d3.select("#group"+light)
	.attr("open", true)
	.property("scale", size/6);
}

function deActivateLight(light) {
    console.log("deactivate: " + light);
    d3.selectAll(".slot.group"+light).classed("open clickable", false);
    d3.select("#group"+light)
	.attr("open", false)
	.property("scale", size/12);
}

// Changes the light's color and set the force to fit the new size.
function lightChange(light) {
    d3.select(".light.group"+light).style("fill", getColor);
    var color = d3.select(".light.group"+light).style("fill");
    adjacent = d3.select(".light.group"+light).data()[0]['adjacent'];
    adjacent.forEach(function(i){
	if (d3.select(".light.group"+i).style("fill") == color) activateLight(i);
	else {deActivateLight(i);}
    })
    activateLight(light);
    simulation
	.force("center", d3.forceCenter(size/2,size/3))
	.force("charge", d3.forceManyBody()
	       .strength(size/12))
	.force("collide", d3.forceCollide()
		     .radius(function(d){return d.scale})
		     .iterations(9));
    simulation.restart();
}

// A self explanatory function
function getColor(d){
    if (d.a == "rgb(255, 255, 255)" && d.b == "rgb(255, 255, 255)" ) return "rgb(0, 0, 0)";
    if (d.a == "rgb(255, 255, 255)" || d.b == "rgb(255, 255, 255)" ) return "rgb(255, 255, 255)"
    return d3.interpolate(d.a,d.b)(0.5);
    
}


function move() {
    var nodes = d3.selectAll("g.nodes").nodes();
    var l = d3.forceLink(links);
    
    var simulation = d3.forceSimulation(nodes)
	.force("center", d3.forceCenter(size/2,size/3))
	.force("charge", d3.forceManyBody().strength(size/12))
	.force("collide", d3.forceCollide()
	       .radius(function(d){return d.scale})
	       .iterations(9)
	      )
	
	.force("links", l)
	
	.on("tick", ticked)
    return simulation;
}

function ticked(){
    var link = d3.selectAll("g.links").selectAll("line");
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    var g = d3.selectAll("g.nodes");
    g.attr("transform", function(d,i, nodes){
	var vx = nodes[i].vx,
	    vy = nodes[i].vy,
	    x = nodes[i].x,
	    y = nodes[i].y,
	    scale = nodes[i].scale/(size/6);
	return "matrix("+scale+",0,0,"+scale+","+(x+vx)+","+(y+vy)+")";
    })
}

