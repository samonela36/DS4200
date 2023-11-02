// Source: https://bl.ocks.org/officeofjane/a70f4b44013d06b9c0a973f163d8ab7a

// bubbleChart creation function; instantiate new bubble chart given a DOM element to display it in and a dataset to visualise
function bubbleChart() {
    const width = 550;
    const height = 550;

    // location to centre the bubbles
    const centre = {x: width / 2, y: height / 2};

    // strength to apply to the position forces
    const forceStrength = 0.03;

    // these will be set in createNodes and chart functions
    let svg = null;
    let bubbles = null;
    let labels = null;
    let nodes = [];

    // charge is dependent on size of the bubble, so bigger towards the middle
    function charge(d) {
        return Math.pow(d.radius, 2.0) * 0.01
    }

    // create a force simulation and add forces to it
    const simulation = d3.forceSimulation()
        .force('charge', d3.forceManyBody().strength(charge))
        // .force('center', d3.forceCenter(centre.x, centre.y))
        .force('x', d3.forceX().strength(forceStrength).x(centre.x))
        .force('y', d3.forceY().strength(forceStrength).y(centre.y))
        .force('collision', d3.forceCollide().radius(d => d.radius + 1));

    // force simulation starts up automatically, which we don't want as there aren't any nodes yet
    simulation.stop();

    // set up colour scale
    const fillColour = d3.scaleOrdinal()
        .domain(["1", "2", "3", "5", "99"])
        .range(["#0074D9", "#7FDBFF", "#39CCCC", "#3D9970", "#AAAAAA"]);

    // data manipulation function takes raw data from csv and converts it into an array of node objects
    // each node will store data and visualisation values to draw a bubble
    // rawData is expected to be an array of data objects, read in d3.csv
    // function returns the new node array, with a node for each element in the rawData input
    function createNodes(rawData) {
        // use max size in the data as the max in the scale's domain
        // note we have to ensure that size is a number
        const maxSize = d3.max(rawData, d => +d.average_ons_total_day);

        // size bubbles based on area
        const radiusScale = d3.scaleSqrt()
            .domain([0, maxSize])
            .range([0, 80])

        // use map() to convert raw data into node data
        const myNodes = rawData.map(d => ({
            ...d,
            radius: radiusScale(Math.sqrt(+d.average_ons_total_day) * 200),
            size: +d.average_ons_total_day,
            x: Math.random() * width,
            y: Math.random() * height
        }))

        return myNodes;
    }

    // main entry point to bubble chart, returned by parent closure
    // prepares rawData for visualisation and adds an svg element to the provided selector and starts the visualisation process
    let chart = function chart(selector, rawData) {
        function mouseover(event, d){
            tooltipDiv2	
                    .style("opacity", .9);
        }
    
        function mousemove(event, d){
            tooltipDiv2.html("<strong>Route Name: " + display_name_map.get(d.route_name) + "</strong><br>Daily Avg Ridership: "
            + d.average_ons_total_day)
                    .style("left", (event.pageX + 20) + "px")
                    .style("top", (event.pageY - 25) + "px");
        }
    
        function mouseleave(event, d){
            tooltipDiv2
                .style('opacity', 0)
        }

        // convert raw data into nodes data
        nodes = createNodes(rawData);

        // create svg element inside provided selector
        svg = d3.select(selector)
            .append('svg')
            .attr('width', width)
            .attr('height', height)

        // bind nodes data to circle elements
        const elements = svg.selectAll('.bubble')
            .data(nodes, d => d.id)
            .enter()
            .append('g')

        bubbles = elements
            .append('circle')
            .classed('bubble', true)
            .attr('r', d => d.radius)
            .attr('stroke', d => {
                if (bus_color_map.get(d.route_name) != undefined) {
                    return bus_color_map.get(d.route_name)
                }
                return train_color_map.get(d.route_name)
            })
            .attr('fill', 'white')
            .attr('stroke-width', '2px')
            .on("click", function (d) {
                if (d3.select(this).attr('fill') == 'white') {
                    d3.selectAll('.bubble').attr('fill', 'white')
                    d3.select(this).attr("fill", d => {
                        if (bus_color_map.get(d.route_name) != undefined) {
                            return bus_color_map.get(d.route_name)
                        }
                        return train_color_map.get(d.route_name)
                    })
                    filter_bus_chart(d3.select(this)._groups[0][0].__data__.route_name)
                    filter_rail_chart(d3.select(this)._groups[0][0].__data__.route_name)
                    filterRidershipChart([d3.select(this)._groups[0][0].__data__.route_name])
                } else {
                    d3.select(this)
                        .attr("fill", 'white')
                    unfilter_rail_chart()
                    unfilter_bus_chart()
                    unfilterRidershipChart()
                }
                // Linking function here with route name above as input
            })
            // Add hover feature to make interaction more obvious
            .on("mouseenter", function(d) {
                d3.select(this).attr("stroke-width", "8px")
                d3.select(this).style("cursor", "pointer");
            })
            .on("mouseleave", function(d) {
                d3.select(this).attr("stroke-width", "2px")
                d3.select(this).style("cursor", "default");
                mouseleave(d)
            })
            .on('mouseover', mouseover)
            .on('mousemove', mousemove)
            
        // labels
        labels = elements
            .append('text')
            .attr('class', 'unselectable')
            .attr('dy', '.3em')
            .style('text-anchor', 'middle')
            .style('font-size', d => d.radius / 2)
            .text(d => {
                if (d.radius > 5) {
                    return display_name_map.get(d.route_name)
                }
            })

        // set simulation's nodes to our newly created nodes array
        // simulation starts running automatically once nodes are set
        simulation.nodes(nodes)
            .on('tick', ticked)
            .restart();
    }

    // callback function called after every tick of the force simulation
    // here we do the actual repositioning of the circles based on current x and y value of their bound node data
    // x and y values are modified by the force simulation
    function ticked() {
        bubbles
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)

        labels
            .attr('x', d => d.x)
            .attr('y', d => d.y)
    }

    // return chart function from closure
    return chart;
}

// new bubble chart instance
let myBubbleChart = bubbleChart();

// function called once promise is resolved and data is loaded from csv
// calls bubble chart function to display inside #vis div
function display(data) {
    myBubbleChart('.ridership-bubble-container', data);
}

// load data
d3.csv('data/bus_rail_average_ons.csv').then(data => {
    data.forEach(function(d) {
        d.route_name = d['route_name']
        d.average_ons_total_day = d['average_ons_total_day']
    });
    display(data)
});
