// data for the rooms
var lights = [
    {id:"A", x:"25%", y:"25%", light:"rgb(255, 0, 0)"},
    {id:"B", x:"50%", y:"25%", light:"rgb(0, 0, 0)"},
    {id:"C", x:"75%", y:"25%", light:"rgb(255, 128, 0)"},
    {id:"D", x:"25%", y:"50%", light:"rgb(128, 0, 128)"},
    {id:"E", x:"50%", y:"50%", light:"rgb(0, 0, 255)"},
    {id:"F", x:"75%", y:"50%", light:"rgb(255, 0, 0)"}
];

var adjacentRooms = {A:['B', 'D'],
		     B:['A','C','E'],
		     C:['B','F'],
		     D:['A','E'],
		     E:['B','D'],
		     F:['C']
		    };

// data for the slots
var slots = [
    {id:"slot0A", x:"20.9%", y:"20.9%", color:"rgb(255, 0, 0)", active:true, room:"A"},
    {id:"slot1A", x:"29.1%", y:"29.1%", color:"rgb(255, 0, 0)", active:true, room:"A"},
    {id:"slot2A", x:"36%", y:"15%", color:"rgb(0, 0, 255)", active:false, room:"A"},
    
    {id:"slot0B", x:"45.9%", y:"20.9%", color:"rgb(255, 255, 255)", active:true, room:"B"},
    {id:"slot1B", x:"54.1%", y:"29.1%", color:"rgb(255, 255, 255)", active:true, room:"B"},
    {id:"slot2B", x:"61%", y:"15%", color:"rgb(0, 0, 255)", active:false, room:"B"},

    {id:"slot0C", x:"70.9%", y:"20.9%", color:"rgb(255, 0, 0)", active:true, room:"C"},
    {id:"slot1C", x:"79.1%", y:"29.1%", color:"rgb(255, 255, 0)", active:true, room:"C"},
    {id:"slot2C", x:"86%", y:"15%", color:"rgb(255, 255, 255)", active:false, room:"C"},
    
    {id:"slot0D", x:"20.9%", y:"45.9%", color:"rgb(255, 0, 0)", active:true, room:"D"},
    {id:"slot1D", x:"29.1%", y:"54.1%", color:"rgb(0, 0, 255)", active:true, room:"D"},
    {id:"slot2D", x:"36%", y:"40%", color:"rgb(255, 255, 255)", active:false, room:"D"},
    
    {id:"slot0E", x:"45.9%", y:"45.9%", color:"rgb(0, 0, 255)", active:true, room:"E"},
    {id:"slot1E", x:"54.1%", y:"54.1%", color:"rgb(0, 0, 255)", active:true, room:"E"},
    {id:"slot2E", x:"61%", y:"40%", color:"rgb(255, 255, 0)", active:false, room:"E"},
    
    {id:"slot0F", x:"70.9%", y:"45.9%", color:"rgb(255, 0, 0)", active:true, room:"F"},
    {id:"slot1F", x:"79.1%", y:"54.1%", color:"rgb(255, 0, 0)", active:true, room:"F"},
    {id:"slot2F", x:"86%", y:"40%", color:"rgb(255, 255, 255)", active:false, room:"F"},

    {id:"hand0", x:"65%", y:"75%", color:"rgb(255, 255, 255)", active:false, room:"hand"},
    {id:"hand1", x:"85%", y:"75%", color:"rgb(255, 255, 255)", active:false, room:"hand"},
];

// data for the hands boxes
var hands = [{id:"hand1", x:255, y:420},
	     {id:"hand2", x:320, y:420}
	    ];

// data for the doors
var doors = [{id:"AB", x:203, y:78, horizontal:false},
	     {id:"AD", x:82, y:203, horizontal:true},
	     {id:"BC", x:408, y:78, horizontal:false},
	     {id:"BE", x:282, y:203, horizontal:true},
	     {id:"CF", x:487, y:203, horizontal:true},
	     {id:"DE", x:203, y:278, horizontal:false}
	    ];


// Initialize the puzzle
var puzzle = d3.select("#container")
    .append("svg")
    .attr("width","100%")
    .attr("height", "100%")
    .attr("viewport", "0 0 100 100")
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("id", "puzzle");

/*
// Generate hands
puzzle.selectAll()
    .data(hands)
    .enter().append("rect")
    .attr("id", function(d){return d.id;})
    .attr("x", function(d){return d.x;})
    .attr("y", function(d){return d.y;})
    .attr("width", 50)
    .attr("height", 50)
    .attr("rx", 5)
    .attr("ry", 5)
    .style("fill", "grey")
    .style("stroke", "rgb(0, 0, 0)");
*/

// Generate Lights
puzzle.selectAll()
    .data(lights).enter()
    .append("circle")
    .attr("class", function(d){return "light closed " + d.id;})
    .attr("cx", function(d){return d.x;})
    .attr("cy", function(d){return d.y;})
    .attr("r", "12%")
    .attr("id", function(d){return d.id;})
    .style("fill", function(d){return d.light;});


// Generate slots
puzzle.selectAll()
    .data(slots).enter()
    .append("circle")
    .attr("class", d => d.active ? "slot active closed " + d.room : "slot passive closed " + d.room)
    .attr("cx", function(d){return d.x;})
    .attr("cy", function(d){return d.y;})
    .attr("r", d => d.active ? "5.8%":"3%")
    .attr("id", function(d){return d.id;})
    .style("fill", function(d){return d.color;});

d3.select("#hand0")
    .attr("cx", "22.6%")
    .attr("cy", "73%")
    .attr("r", "6%")
   
puzzle.append("image")
    .attr("x", "10%")
    .attr("y", "66%")
    .attr("width","20%")
    .attr("height", "20%")
    .attr("pointer-events", "none")
    .attr("xlink:href","leftHand.svg");

d3.select("#hand1")
    .attr("cx", "87.5%")
    .attr("cy", "73%")
    .attr("r", "6%")

puzzle.append("image")
    .attr("x", "80%")
    .attr("y", "66%")
    .attr("width","20%")
    .attr("height", "20%")
    .attr("pointer-events", "none")
    .attr("xlink:href","rightHand.svg");

d3.selectAll(".hand").style("fill", "rgb(255, 255, 255)")
// Set start and finishing positions
var startingRoom = "A";
var finishRoom = "F";
