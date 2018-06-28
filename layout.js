/* 
   Data section
*/
var lights = [
    {id:"A", x:"25%", y:"25%", light:"rgb(255, 0, 0)", slots:[
	{id:"slot0A", x:"20.9%", y:"20.9%", color:"rgb(255, 0, 0)", active:true, room:"A"},
	{id:"slot1A", x:"29.1%", y:"29.1%", color:"rgb(255, 0, 0)", active:true, room:"A"},
	{id:"slot2A", x:"36%", y:"15%", color:"rgb(0, 0, 255)", active:false, room:"A"}]},
    {id:"B", x:"50%", y:"25%", light:"rgb(0, 0, 0)", slots:[
	{id:"slot0B", x:"45.9%", y:"20.9%", color:"rgb(255, 255, 255)", active:true, room:"B"},
	{id:"slot1B", x:"54.1%", y:"29.1%", color:"rgb(255, 255, 255)", active:true, room:"B"},
	{id:"slot2B", x:"61%", y:"15%", color:"rgb(0, 0, 255)", active:false, room:"B"}]},
     {id:"C", x:"75%", y:"25%", light:"rgb(255, 128, 0)", slots:[
	 {id:"slot0C", x:"70.9%", y:"20.9%", color:"rgb(255, 0, 0)", active:true, room:"C"},
	 {id:"slot1C", x:"79.1%", y:"29.1%", color:"rgb(255, 255, 0)", active:true, room:"C"},
	 {id:"slot2C", x:"86%", y:"15%", color:"rgb(255, 255, 255)", active:false, room:"C"}]},
    {id:"D", x:"25%", y:"50%", light:"rgb(128, 0, 128)", slots:[
	{id:"slot0D", x:"20.9%", y:"45.9%", color:"rgb(255, 0, 0)", active:true, room:"D"},
	{id:"slot1D", x:"29.1%", y:"54.1%", color:"rgb(0, 0, 255)", active:true, room:"D"},
	{id:"slot2D", x:"36%", y:"40%", color:"rgb(255, 255, 255)", active:false, room:"D"}]},
    {id:"E", x:"50%", y:"50%", light:"rgb(0, 0, 255)", slots:[
	{id:"slot0E", x:"45.9%", y:"45.9%", color:"rgb(0, 0, 255)", active:true, room:"E"},
	{id:"slot1E", x:"54.1%", y:"54.1%", color:"rgb(0, 0, 255)", active:true, room:"E"},
	{id:"slot2E", x:"61%", y:"40%", color:"rgb(255, 255, 0)", active:false, room:"E"}]},
    {id:"F", x:"75%", y:"50%", light:"rgb(255, 0, 0)", slots:[
	{id:"slot0F", x:"70.9%", y:"45.9%", color:"rgb(255, 0, 0)", active:true, room:"F"},
	{id:"slot1F", x:"79.1%", y:"54.1%", color:"rgb(255, 0, 0)", active:true, room:"F"},
	{id:"slot2F", x:"86%", y:"40%", color:"rgb(255, 255, 255)", active:false, room:"F"}]}
];

var adjacentRooms = {A:['B', 'D'],
		     B:['A','C','E'],
		     C:['B','F'],
		     D:['A','E'],
		     E:['B','D'],
		     F:['C']
		    };

var hands = [{id:"hand0", x:"22.6%", color:"rgb(255, 255, 255)"},
	     {id:"hand1", x:"77.5%", color:"rgb(255, 255, 255)"}];

/* 
   Initialization section 
*/

// Initialize the puzzle
var puzzle = d3.select("#container")
    .append("svg")
    .attr("width","100%")
    .attr("height", "100%")
    .attr("viewport", "0 0 100 100")
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("id", "puzzle");

var groups = puzzle.selectAll()
    .data(lights).enter()
    .append("g")
    .attr("id", e => "group" + e.id);

// Generate lights
d3.selectAll("g")
    .insert("circle")
    .attr("class", function(d){return "light closed " + d.id;})
    .attr("cx", function(d){return d.x;})
    .attr("cy", function(d){return d.y;})
    .attr("r", "12%")
    .attr("id", function(d){return d.id;})
    .style("fill", function(d){return d.light;});

// Generate slots
for (i=0;i<3;i++){
d3.selectAll("g")
    .insert("circle")
    .attr("class",d => d.slots[i].active ? "slot active closed " + d.slots[i].room : "slot passive closed " + d.slots[i].room)
    .attr("cx", function(d){return d.slots[i].x;})
    .attr("cy", function(d){return d.slots[i].y;})
    .attr("r", d => d.slots[i].active ? "5.8%":"3%")
    .attr("id", function(d){return d.slots[i].id;})
    .style("fill", function(d){return d.slots[i].color;});
}

// Generate hands
puzzle.selectAll()
    .data(hands).enter()
    .append("circle")
    .attr("class", "slot passive closed hand")
    .attr("cx", function(d){return d.x;})
    .attr("cy", "73%")
    .attr("r", "6%")
    .attr("id", function(d){return d.id;})
    .style("fill", function(d){return d.color;});

puzzle.append("image")
    .attr("x", "10%")
    .attr("y", "66%")
    .attr("width","20%")
    .attr("height", "20%")
    .attr("pointer-events", "none")
    .attr("xlink:href","leftHand.svg");

puzzle.append("image")
    .attr("x", "70%")
    .attr("y", "66%")
    .attr("width","20%")
    .attr("height", "20%")
    .attr("pointer-events", "none")
    .attr("xlink:href","rightHand.svg");

// Set start and finishing positions
var startingRoom = "A";
var finishRoom = "F";
