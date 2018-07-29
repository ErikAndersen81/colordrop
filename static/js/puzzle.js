"use strict;"
// The layout of the puzzle
var data2 = [
    {a:"rgb(255, 0, 0)", b:"rgb(255, 0, 0)", c:"rgb(0, 0, 255)", adjacent:[1,3]},
    {a:"rgb(255, 255, 255)", b:"rgb(255, 255, 255)", c:"rgb(0, 0, 255)", adjacent:[0,4,2]},
    {a:"rgb(255, 0, 0)", b:"rgb(255, 255, 0)", c:"rgb(255, 255, 255)", adjacent:[1,5]},
    {a:"rgb(255, 0, 0)", b:"rgb(0, 0, 255)", c:"rgb(255, 255, 255)", adjacent:[0,4]},
    {a:"rgb(0, 0, 255)", b:"rgb(0, 0, 255)", c:"rgb(255, 255, 0)", adjacent:[3,1]},
    {a:"rgb(255, 0, 0)", b:"rgb(255, 0, 0)", c:"rgb(255, 255, 255)", adjacent:[2]}
];
var data3 = [
    {a:"rgb(255, 255, 255)", b:"rgb(255, 0, 0)", c:"rgb(255, 255, 255)", d:"rgb(255, 255, 255)", adjacent:[2,4,5,7]},
    {a:"rgb(255, 0, 0)", b:"rgb(255, 0, 0)", c:"rgb(0, 0, 255)", d:"", adjacent:[2]},
    {a:"rgb(255, 255, 255)", b:"rgb(255, 255, 255)", c:"rgb(255, 0, 0)", d:"", adjacent:[1,0]},
    {a:"rgb(255, 0, 0)", b:"rgb(255, 0, 0)", c:"rgb(255, 255, 0)", d:"", adjacent:[5]},
    {a:"rgb(255, 255, 0)", b:"rgb(0, 0, 255)", c:"rgb(255, 255, 255)", d:"", adjacent:[0,6]},
    {a:"rgb(255, 0, 0)", b:"rgb(0, 0, 255)", c:"", d:"", adjacent:[0,3]},
    {a:"rgb(255, 0, 0)", b:"rgb(0, 0, 255)", c:"rgb(255, 0, 0)", d:"", adjacent:[4]},
    {a:"rgb(255, 255, 0)", b:"rgb(255, 0, 0)", c:"rgb(255, 255, 255)", d:"", adjacent:[0,8]},
    {a:"rgb(255, 0, 0)", b:"rgb(255, 0, 0)", c:"", d:"", adjacent:[7]}
];
var data1 = [{a:"rgb(255, 255, 255)", b:"rgb(255, 0, 0)", c:"rgb(255, 0, 0)", d:"", adjacent:[1]},
    {a:"rgb(255, 0, 0)", b:"rgb(255, 0, 0)", c:"", d:"", adjacent:[0]}]
var levels = [data1, data2, data3];
// Add the levels to the dropdown menu
for (var i = 1; i<=levels.length;i++){
    d3.select("#level").append("a").text(i).attr("class", "dropdown-item").attr("onclick", "playLevel("+i+")");
}
// Global variables to be used in various stuff
var selected;
var target;
var won;
var size;
var links;
var data;
var sim;

// Start the default level.
playLevel(1);

// Removes previous svg and creates a new one with the given level as data
function playLevel(lvl){
    d3.select("svg").remove();
    selected = null;
    target = null;
    won = false;
    data = levels[lvl-1];
    links = [];
    for (let i = 0; i < data.length;i++) {
	data[i].adjacent.forEach(function(e){ if (i<parseInt(e) )links.push({"source":i,"target":parseInt(e)})});
    }
    draw(getSVG());
    d3.selectAll("g.nodes").property("scale", size/12);
    d3.selectAll(".slot.group0").classed("open clickable", true).call(flash);
    activateLight(0);
    animateGoal(data.length-1);
    setSizes();
    sim = getSimulation();
}

// Displays a gratulatory expression in a festive manner.
function winner(){
    console.log("win");
    d3.select("svg").remove();
    var puzzle = getSVG();
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
	.attr("x", size/2)
	.attr("y", size/3)
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

function getSVG(){
    var chartDiv = document.getElementById("chart");
    var svg = d3.select(chartDiv).append("svg");
    // Extract the width and height that was computed by CSS.
    var width = chartDiv.clientWidth;
    var height = chartDiv.clientHeight;
    size = Math.min(height, width);    
    // Use the extracted size to set the size of an SVG element.
    svg
        .attr("width", size)
        .attr("height", size);
    return svg;
}

// Initialize the puzzle    
function draw(puzzle){
    // Create the links
    var link = puzzle.append("g")
	.attr("class", "links")
	.selectAll("line")
	.data(links)
	.enter().append("line");
    // Create the nodes for holding the lights
    var nodes = puzzle.selectAll("g:not(.links)")
	.data(data)
	.enter()
	.append("g")
	.attr("class", "nodes")
	.attr("id", function(d, i){return "group"+i;})
	.attr("open", false)    
    // Draw the lights
    nodes
	.append("circle")
	.attr("r", function(d){return size/7;})
	.style("fill", getColor)
	.attr("class", function(d,i){return "light group"+i;})
	.attr("light", function(d, i){return i;});
    // Set the default radius
    var r = (size/6)*(2.8/7);    
    // Create the slots
    var slots=['a','b','c','d'];
    slots.forEach( function(e) {
	var sz, cls, cx, cy;
	if (e=='a' || e=='b') {
	    sz = r*1;
	    cls = "slot active group";
	    cx = e=='a' ? r : -r;
	    cy = 0;
	}
	else {
	    sz = r*0.8;
	    cls = "slot inactive group";
	    cx = 0;
	    cy = e=='c' ? r : -r;
	}	
	nodes
	    .append("circle")
	    .attr("r", function(d){return sz;})
	    .attr("cx", function(d, i){return cx;})
	    .attr("cy", function(d, i){return cy})
	    .style("fill", function(d){return d[e];})
	    .attr("class", function(d,i){return d[e] != "" ? cls+i:"empty";})
	    .attr("light", function(d, i){return i;})
	    .attr("slot", e);
    });
    // Remove unwanted slots
    d3.selectAll(".empty").remove();    
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
	.attr("xlink:href","static/images/leftHand.svg")
	.attr("width", size/4)
	.attr("height", size/4)
	.attr("y", size*3/4)
	.attr("pointer-events", "none");
    puzzle.append("image")
	.attr("xlink:href","static/images/rightHand.svg")
	.attr("width", size/4)
	.attr("height", size/4)
	.attr("y", size*3/4)
	.attr("x", size*3/4)
	.attr("pointer-events", "none");
}

// Animates the end light
function animateGoal(lightId){
    var light = d3.select(".light.group"+lightId);
    repeat();
    function repeat(){
	light.style("stroke", "rgb(255, 255, 255)")
	    .style("stroke-width", "15px")
	    .transition().duration(1300)
	    .style("stroke-width", "1px")
	    .on("end", repeat);
    }
}

// Makes selectable slots flash
function flash(slots){
    slots.call(d3.drag().on("start", clicked));
    var type = slots.classed("hand") ? ".hand":".slot";
    repeat();
    function repeat(){
	var open = d3.selectAll(type+".clickable");
	if (open.size() != 0 ){
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
	setSizes();
	if (won) winner();
    }
}

// Activate and deactivates light. Argument is the index of the light.
function activateLight(light){
    if (parseInt(light) == data.length-1) {
	won=true;
    }
    d3.selectAll(".slot.group"+light).classed("open clickable", true);
    d3.select("#group"+light)
	.attr("open", true);
}

function deActivateLight(light) {
    d3.selectAll(".slot.group"+light).classed("open clickable", false);
    d3.select("#group"+light)
	.attr("open", false);
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
    setSizes();
    sim.force("collide").radius(function(d){ return d.scale*1.1 });
    sim.alpha(0.02).restart();
}

// A self explanatory function
function getColor(d){
    if (d.a == "rgb(255, 255, 255)" && d.b == "rgb(255, 255, 255)" ) return "rgb(0, 0, 0)";
    if (d.a == "rgb(255, 255, 255)" || d.b == "rgb(255, 255, 255)" ) return "rgb(255, 255, 255)"
    return d3.interpolateCubehelix(d.a,d.b)(0.5);    
}

// Creates the simulation and links for each node
function getSimulation() {
    var nodes = d3.selectAll("g.nodes").nodes();
    var link = d3.forceLink(links);
    var collide = d3.forceCollide()
	.radius(function(d){ return d.scale*1.1 })
	.iterations(9);
    var simulation = d3.forceSimulation(nodes)
	.force("center", d3.forceCenter(size/2,size/3))
	.force("collide", collide)	
	.force("links", link)
	.force("charge", d3.forceManyBody().strength(-1))
	.on("tick", ticked)
    return simulation;
}

// Updates nodes and links at every tick interval
function ticked(){
    var g = d3.selectAll("g.nodes");
    g.attr("transform", function(d,i, nodes){
	var radius = nodes[i].children[0].getAttribute("r");
	var vx = nodes[i].vx,
	    vy = nodes[i].vy,
	    x = Math.max(radius, Math.min(size - radius, nodes[i].x)),
	    y = Math.max(radius, Math.min(size - radius, nodes[i].y)),
	    scale = nodes[i].scale/(size/6);
	nodes[i].x = x+vx;
	nodes[i].y = y+vy;
	return "matrix("+scale+",0,0,"+scale+","+(x+vx)+","+(y+vy)+")";
    })
    var link = d3.selectAll("g.links").selectAll("line");
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
}

// Set size of nodes using a variant of BFS-algorithm
function setSizes(){
    var N = [],
	adj = [],
	distance = 0;
    d3.selectAll("g[open=true]").each(function(d,i, nodes){
	N.push(parseInt(nodes[i].id.slice(5)));
    });
    N.forEach(e => d3.select("#group"+e).property("scale", size/(7)));
    while(N.length != data.length){
	distance++;
	for(var i=0;i<N.length;i++){
	    d3.select("#group"+N[i]).each(function(d) {
		adj = adj.concat([...d.adjacent].filter(x => !N.includes(x)));
	    });
	}
	N = N.concat(adj);
	adj.forEach(e => d3.select("#group"+e).property("scale", size/(7+(5*distance))));
	adj=[];
    }
}
