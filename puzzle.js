data = [
    {a:"rgb(255, 0, 0)", b:"rgb(255, 0, 0)", c:"rgb(0, 0, 255)", adjacent:[1,3]},
    {a:"rgb(255, 255, 255)", b:"rgb(255, 255, 255)", c:"rgb(0, 0, 255)", adjacent:[0,4,2]},
    {a:"rgb(255, 0, 0)", b:"rgb(255, 255, 0)", c:"rgb(255, 255, 255)", adjacent:[1,5]},
    {a:"rgb(255, 0, 0)", b:"rgb(0, 0, 255)", c:"rgb(255, 255, 255)", adjacent:[0,4]},
    {a:"rgb(0, 0, 255)", b:"rgb(0, 0, 255)", c:"rgb(255, 255, 0)", adjacent:[3,1]},
    {a:"rgb(255, 0, 0)", b:"rgb(255, 0, 0)", c:"rgb(0, 0, 0)", adjacent:[]}
];

// Initialize the puzzle    
function draw(){
    var chartDiv = document.getElementById("chart");
    var puzzle = d3.select(chartDiv).append("svg");
    var groups = puzzle
	.selectAll("g")
	.data(data)
	.enter()
	.append("g")
	.attr("class", function(d,i){return "group"+i;});

    // Extract the width and height that was computed by CSS.
    var width = chartDiv.clientWidth;
    var height = chartDiv.clientHeight;
    var size = Math.min(height, width);

    // Use the extracted size to set the size of an SVG element.
    puzzle
        .attr("width", size)
        .attr("height", size);

    // Draw the lights
    groups
	.append("circle")
	.attr("r", function(d){return size/6;})
	.style("fill", getColor)
	.attr("cx", function(d, i){return i%3*size/3+size/6;})
	.attr("cy", function(d, i){return Math.floor(i/3)*size/3 + size/6;})
	.attr("class", function(d,i){return "light group"+i;})
	.attr("light", function(d, i){return i;});

    // Draw the active slots
    groups
	.append("circle")
	.attr("r", function(d){return size/13;})
	.style("fill", function(d){return d.a;})
	.attr("cx", function(d, i){return i%3*size/3+size/9;})
	.attr("cy", function(d, i){return Math.floor(i/3)*size/3 + size/9;})
	.attr("class", function(d,i){return "slot group"+i;})
	.attr("light", function(d, i){return i;})
	.attr("slot", "a");

    groups
	.append("circle")
	.attr("r", function(d){return size/13;})
	.style("fill", function(d){return d.b;})
	.attr("cx", function(d, i){return i%3*size/3+size/4.5;})
	.attr("cy", function(d, i){return Math.floor(i/3)*size/3 + size/4.5})
	.attr("class", function(d,i){return "slot group"+i;})
	.attr("light", function(d, i){return i;})
	.attr("slot", "b");
    
    // Create shape for the inactive slot. (Star)
    var symbolGenerator = d3.symbol()
	.type(d3.symbolStar)
	.size(size*2);
    var sym = symbolGenerator();

    // Draw the inactive slot
    puzzle.selectAll("g")
	.append("path")
	.attr("d", sym)
	.style("fill", function(d){return d.c;})
	.attr("transform", function(d, i){
	    return "translate(" + (i%3*size/3 + size/4.2) +
		"," + (Math.floor(i/3)*size/3 + size/11.6) + ")";})
	.attr("class", function(d,i){return "slot group"+i;})
	.attr("light", function(d, i){return i;})
	.attr("slot", "c");
    // Create the hands below last row of lights
    puzzle
	.append("circle")
	.attr("class", "hand")
	.attr("r", size/15)
	.attr("cx", size/3)
	.attr("cy", (Math.floor(data.length/3)*size)/3)
	.style("fill", "rgb(255, 255, 255)");

    puzzle
	.append("circle")
	.attr("class", "hand")
	.attr("r", size/15)
	.attr("cx", (2*size)/3)
	.attr("cy", (Math.floor(data.length/3)*size)/3)
	.style("fill", "rgb(255, 255, 255)");
}

// Activate light. argument is the index of the light
function activateLight(light){
    if (light+1 == data.length) winner();
    console.log("activatelight: " + light);
    d3.selectAll(".slot.group"+light).classed("open clickable", true);
}

function deActivateLight(light) {
    console.log("deActivatelight: " + light);
    d3.selectAll(".slot.group"+light).classed("open clickable", false);
}

function flash(slots){
    console.log("flash: ", slots);
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

function lightChange(light) {
    d3.select(".light.group"+light).style("fill", getColor);
    var color = d3.select(".light.group"+light).style("fill");
    adjacent = d3.select(".light.group"+light).data()[0]['adjacent'];
    adjacent.forEach(function(i){
	if (d3.select(".light.group"+i).style("fill") == color) activateLight(i);
	else {deActivateLight(i);}
    })
    activateLight(light);
}

function getColor(d){
    if (d.a == "rgb(255, 255, 255)" && d.b == "rgb(255, 255, 255)" ) return "rgb(0, 0, 0)";
    if (d.a == "rgb(255, 255, 255)" || d.b == "rgb(255, 255, 255)" ) return "rgb(255, 255, 255)"
    return d3.interpolate(d.a,d.b)(0.5);
    
}

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

var selected = null;
var target = null;   
draw();
activateLight(0);
d3.selectAll(".slot.group0").classed("open clickable", true).call(flash);
