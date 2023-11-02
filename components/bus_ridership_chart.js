// Source: In class work
let dimensions = {
    width: 600,
    height: 500,
    margin: {
        top: 50,
        bottom: 65,
        left: 70,
        right: 60
    }
}

var tooltipDiv2 = d3.select("body").append("div")	
    .attr("class", "tooltip2")				
    .style("opacity", 0);

const bus_bar = d3.select(".bus-ridership-bar-container")
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height)

function drawBusRidership() {
//Data
    const data = d3.csv('data/bus_average_on_day.csv').then(data => {
        data.forEach(d => {
            d.avg_ons = d["average_ons_total_day"]
            d.line_name = d["route_name"]
        })

//Dimension


        const container = bus_bar.append('g')
            .attr('transform', `translate(${dimensions.margin.left},${dimensions.margin.top})`)

        containerWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
        containerHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

        const xScale = d3.scaleLinear()
            .domain([0, 300])
            .rangeRound([0, containerWidth]);

        const yScale = d3.scaleBand()
            .domain(data.map(d => d.line_name))
            .range([0, containerHeight])
            .paddingInner(0.3)
            .paddingOuter(0.2)


// X Axis and Label
        const xAxis = d3.axisBottom(xScale).tickFormat(d => d)

        const xAxisGroup = container.append('g')
            .attr('transform', `translate(0, ${containerHeight})`)
            .call(xAxis)
            .selectAll("text")
            .attr('y', '10')
            .attr("x", "-5")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-40)")
            .attr("font-size", "15px");

        container.append('text')
            .attr('x', containerWidth / 2)
            .attr('y', containerHeight + 60)
            .attr('font-size', '14px')
            .attr('text-anchor', 'middle')
            .text('Ridership')

// Y Axis and Label
        const yAxis = d3.axisLeft(yScale)

        const yAxisGroup = container.append('g')
            .call(yAxis)
            .selectAll("text")
            .attr('font-size', '15px')

        container.append('text')
            .attr('x', -containerHeight / 2)
            .attr('y', -50)
            .attr('font-size', '14px')
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .text('Bus Route')

// Add Data
        container.selectAll('rect')
            .data(data)
            .join('rect')
            .attr('y', (d) => yScale(d.line_name))
            .attr('x', (d => 0))
            .attr('width', d => xScale(d.avg_ons))
            .attr('height', yScale.bandwidth)
            .attr('fill', d => bus_color_map.get(d.line_name))
            .on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseleave', mouseleave)

// Title
        container.append('text')
            .attr('x', 0)
            .attr('y', -15)
            .attr('font-size', '18px')
            //.attr('font-weight', 'bold')
            .attr('text-anchor', 'left')
            .text('Daily Average Ridership of MBTA Bus Routes and Rail Lines')

    })

    // Add tooltip
        function mouseover(){
            tooltipDiv2
                    .style("opacity", .9)
        }

        function mousemove(event, d){
            tooltipDiv2.html("<strong>Bus Route Name: " + display_name_map.get(d.route_name) + "</strong><br>Daily Avg Ridership: "
            + Math.round(d.average_ons_total_day))
                    .style("left", (event.pageX + 20) + "px")
                    .style("top", (event.pageY - 25) + "px");
        }

        function mouseleave(){
            tooltipDiv2
                .style('opacity', 0)
        }
}

drawBusRidership()

function filter_bus_chart(route_names) {
    bus_bar.selectAll('rect').classed('unselected', d => {
        if (Array.isArray(route_names)) {
            for (let i = 0; i < route_names.length; i++) {
                if (route_names[i] === d.line_name) {
                    return false
                }
            }
            return true
        }
        else {
            return !(d.line_name === route_names)
        }


    })
}

function unfilter_bus_chart() {
    bus_bar.selectAll('rect').classed('unselected', false)
}