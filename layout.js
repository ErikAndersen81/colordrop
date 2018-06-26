// data for the rooms
var rooms = [
    {id:"A", x:5, y:5, light:"rgb(255, 0, 0)"},
    {id:"B", x:210, y:5, light:"rgb(0, 0, 0)"},
    {id:"C", x:414, y:5, light:"rgb(255, 128, 0)"},
    {id:"D", x:5, y:210, light:"rgb(128, 0, 128)"},
    {id:"E", x:210, y:210, light:"rgb(0, 0, 255)"},
    {id:"F", x:415, y:210, light:"rgb(255, 0, 0)"}
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
    {id:"slot0A", x:85, y:85, color:"rgb(255, 0, 0)", active:true, room:"A"},
    {id:"slot1A", x:125, y:125, color:"rgb(255, 0, 0)", active:true, room:"A"},
    {id:"slot2A", x:180, y:30, color:"rgb(0, 0, 255)", active:false, room:"A"},
    
    {id:"slot0B", x:290, y:85, color:"rgb(255, 255, 255)", active:true, room:"B"},
    {id:"slot1B", x:330, y:125, color:"rgb(255, 255, 255)", active:true, room:"B"},
    {id:"slot2B", x:385, y:30, color:"rgb(0, 0, 255)", active:false, room:"B"},

    {id:"slot0C", x:495, y:85, color:"rgb(255, 0, 0)", active:true, room:"C"},
    {id:"slot1C", x:535, y:125, color:"rgb(255, 255, 0)", active:true, room:"C"},
    {id:"slot2C", x:590, y:30, color:"rgb(255, 255, 255)", active:false, room:"C"},
    
    {id:"slot0D", x:85, y:290, color:"rgb(255, 0, 0)", active:true, room:"D"},
    {id:"slot1D", x:125, y:330, color:"rgb(0, 0, 255)", active:true, room:"D"},
    {id:"slot2D", x:180, y:235, color:"rgb(255, 255, 255)", active:false, room:"D"},
    
    {id:"slot0E", x:290, y:290, color:"rgb(0, 0, 255)", active:true, room:"E"},
    {id:"slot1E", x:330, y:330, color:"rgb(0, 0, 255)", active:true, room:"E"},
    {id:"slot2E", x:385, y:235, color:"rgb(255, 255, 0)", active:false, room:"E"},
    
    {id:"slot0F", x:495, y:290, color:"rgb(255, 0, 0)", active:true, room:"F"},
    {id:"slot1F", x:535, y:330, color:"rgb(255, 0, 0)", active:true, room:"F"},
    {id:"slot2F", x:590, y:235, color:"rgb(255, 255, 255)", active:false, room:"F"},

    {id:"hand0G", x:280, y:445, color:"rgb(255, 255, 255)", active:false, room:"hand"},
    {id:"hand1G", x:345, y:445, color:"rgb(255, 255, 255)", active:false, room:"hand"},
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
var puzzle = d3.select("#puzzlediv").append("svg")
    .attr("width", "615")
    .attr("height", "475")
    .attr("id", "puzzle");

// Generate rooms
puzzle.selectAll()
    .data(rooms)
    .enter().append("rect")
    .attr("id", function(d){return d.id;})
    .attr("x", function(d){return d.x;})
    .attr("y", function(d){return d.y;})
    .attr("rx", 20)
    .attr("ry", 20)
    .attr("width", 200)
    .attr("height", 200)
    .attr("class", function(d){return "room closed " + d.id;});
    
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


// Generate Lights
puzzle.selectAll()
    .data(rooms).enter()
    .append("circle")
    .attr("class", function(d){return "light closed " + d.id;})
    .attr("cx", function(d){return d.x+100;})
    .attr("cy", function(d){return d.y+100;})
    .attr("r", 50)
    .attr("id", function(d){return "light" + d.id;})
    .style("fill", function(d){return d.light;});

// Generate slots
puzzle.selectAll()
    .data(slots)
    .enter().append("circle")
    .attr("class", d => d.active ? "slot active closed " + d.room : "slot passive closed " + d.room)
    .attr("cx", function(d){return d.x;})
    .attr("cy", function(d){return d.y;})
    .attr("r", 14)
    .attr("id", function(d){return d.id;})
    .style("fill", function(d){return d.color;});

// generate doors
puzzle.selectAll()
    .data(doors).enter()
    .append("rect")
    .attr("id", e=> e.id)
    .attr("class", "door")
    .attr("x", e=> e.x)
    .attr("y", e=> e.y)
    .attr("width", e=> e.horizontal ? 50:9)
    .attr("height", e=> e.horizontal ? 9:50);


// Set start and finishing positions
var startingRoom = "A";
var finishRoom = "F";
