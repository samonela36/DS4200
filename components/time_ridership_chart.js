// https://bl.ocks.org/harrisoncramer/04dcd9742a2be13d99db5f7a7480b4ca
//https://untangled.io/immutable-js-6-ways-to-merge-maps-with-full-live-examples/#:~:text=merge(),merged%20in%20will%20be%20used.
let rider_dimensions = {
    width: 700,
    height: 660,
    margin: {
        top: 50,
        bottom: 70,
        left: 200,
        right: 100
    }
}

var svgRidership = d3.select(".ridership-time-bar-container")
    .append("svg")
    .attr("width", rider_dimensions.width)
    .attr("height", rider_dimensions.height)

var tooltipDiv = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);


var rider_data
d3.csv("data/ridership_by_time.csv").then(data => {
    data.forEach(d => {
        d.time_period = d['time_period']
    })
    rider_data=data
    drawRidershipChart(data)
});

function unfilterRidershipChart() {
    drawRidershipChart(rider_data)
}

function filterRidershipChart(routes) {
    var data = rider_data.map(d => {
        var filtered_data = {
            time_period : d.time_period
        }
        for (let i = 0; i < routes.length; i ++) {
            filtered_data[routes[i]] = d[routes[i]]
        }
        return filtered_data
    })
    drawRidershipChart(data)
}

function drawRidershipChart(ridership_data) {
    svgRidership.selectAll('*').remove();

    maximumY = findMaxVal(ridership_data)

    containerWidth = rider_dimensions.width - rider_dimensions.margin.left - rider_dimensions.margin.right
    containerHeight = rider_dimensions.height - rider_dimensions.margin.top - rider_dimensions.margin.bottom

    const container = svgRidership.append("g")
        .attr("id", "ridership")
        .attr('transform', `translate(${rail_bar_dimensions.margin.left},${rail_bar_dimensions.margin.top})`)

    var xScale = d3.scaleBand()
        .domain(ridership_data.map(d => d.time_period))
        .rangeRound([0, containerWidth])

    // Notice that the yScale is not inverted on the yScale
    var yScale = d3.scaleLinear()
        .domain([0, findMaxVal(ridership_data)])
        .range([containerHeight, 0])

    // We create a heightscale where the y is inverted
    var heightScale = d3.scaleLinear().domain([0, findMaxVal(ridership_data)]).range([0, containerHeight])

    var lines = [...all_colors_map.keys()]
    var colorScale = d3.scaleOrdinal()
        .domain(lines)
        .range([...all_colors_map.values()])

    yAxis = d3.axisLeft().scale(yScale)

    const yAxisGroup = container.append('g')
        .call(yAxis)
        .selectAll("text")
        .attr('font-size', '15px')

    xAxis = d3.axisBottom().scale(xScale)

    const xAxisGroup = container.append('g')
        .attr('transform', `translate(0, ${containerHeight})`)
        .call(xAxis)
        .selectAll("text")
        .attr('y', '10')
        .attr("x", "-5")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)")
        .attr("font-size", "15px");

    var stackLayout = d3.stack()
        .keys(lines)

    container.selectAll("g.bar")
        .data(stackLayout(ridership_data)) // Pass the sorted data in
        .enter()
        .append("g")
        .attr("class", "bar")
        .each(function (d) {
            d3.select(this).selectAll("rect")
                .data(d)
                .enter()
                .append("rect")
                .attr("width", 40)
                .attr('class', d.key)
                .attr("height", p => heightScale(p[1]) - heightScale(p[0]))
                .attr("x", (p) => xScale(p.data.time_period) + 7)
                .attr("y", p => yScale(p[1]))
                .style("fill", colorScale(d.key))
                .on('mousemove', mousemove)
        })
        .on('mouseover', mouseover)
        .on('mouseleave', mouseleave)

    svgRidership.append('text')
        .attr("transform", "translate(" + (rider_dimensions.width/2 - 80) + " ," + (rider_dimensions.height) + ")")
        .style("text-anchor", "middle")
        .attr("font-size", "14px")
        .text("Time Period");

    svgRidership.append("text")
        .attr("transform", "rotate(-90)")
        .attr("font-size", "14px")
        .attr("x", -(rider_dimensions.height/2))
        .attr("y", 15)
        .style("text-anchor", "middle")
        .text("Average Number of People Getting On");
    
    function mouseover(event, d){
        tooltipDiv	
                .style("opacity", .9);		
    }

    function mousemove(event, d){
        tooltipDiv.html("<strong>Route Name: " + display_name_map.get(d3.select(this).attr('class'))+ "</strong><br>Time Period: "
            + d.data.time_period + "</br>" + time_period_map.get(d.data.time_period)  + "<br>Ridership: "
            + d.data[d3.select(this).attr('class')] + "</br>" + "</p>")
                .style("left", (event.pageX + 20) + "px")
                .style("top", (event.pageY - 25) + "px");
    }

    function mouseleave(event, d){
        tooltipDiv
            .style('opacity', 0)
    }

}

function findMaxVal(data) {
    maxval = 0
    data.forEach(d => {
        rowMax = 0
        for (const key in d) {
            rowMax += parseFloat(d[key]) || 0
        }
        if (rowMax > maxval ) {
            maxval = rowMax
        }
    })
    return maxval

}

