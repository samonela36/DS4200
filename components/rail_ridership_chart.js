// Source: In class work

let rail_bar_dimensions = {
    width: 600,
    height: 200,
    margin: {
        top: 10,
        bottom: 110,
        left: 70,
        right: 60
    }
}

const rail_bar = d3.select(".rail-ridership-bar-container")
    .append('svg')
    .attr('width', rail_bar_dimensions.width)
    .attr('height', rail_bar_dimensions.height)

function drawRailRidership() {
//Data
    const data = d3.csv('data/rail_average_on_day.csv').then(data => {
        data.forEach(d => {
            d.avg_ons = d["average_ons_total_day"]
            d.line_name = d["route_name"]
        })

//Dimension

        const container = rail_bar.append('g')
            .attr('transform', `translate(${rail_bar_dimensions.margin.left},${rail_bar_dimensions.margin.top})`)

        containerWidth = rail_bar_dimensions.width - rail_bar_dimensions.margin.left - rail_bar_dimensions.margin.right
        containerHeight = rail_bar_dimensions.height - rail_bar_dimensions.margin.top - rail_bar_dimensions.margin.bottom

        const xScale = d3.scaleLinear()
            .domain([0, 6000])
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
        const yAxis = d3.axisLeft(yScale).tickFormat(d => display_name_map.get(d))

        const yAxisGroup = container.append('g')
            .call(yAxis)
            .selectAll("text")
            .attr('font-size', '15px')

        /*container.append('text')
                  .attr('x', -containerHeight/2)
                  .attr('y', -70)
                  .attr('font-size', '20px')
                  .attr('text-anchor', 'middle')
                  .attr('transform', 'rotate(-90)')
                  .text('Bus Line')
        */

// Add Data
        container.selectAll('rect')
            .data(data)
            .join('rect')
            .attr('y', (d) => yScale(d.line_name))
            .attr('x', (d => 0))
            .attr('width', d => {
                return xScale(+d.avg_ons)
            })
            .attr('height', yScale.bandwidth)
            .attr('fill', d => train_color_map.get(d.line_name))
            .on('mousemove', mousemove)
            .on('mouseover', mouseover)
            .on('mouseleave', mouseleave)

// Title
        /*container.append('text')
                    .attr('x', containerWidth/2)
                    .attr('font-size', '30px')
                    .attr('font-weight', 'bold')
                    .attr('text-anchor', 'middle')
                    .text('Daily Average Ridership of Rail')



         */
    })

    function mouseover(){
        tooltipDiv2
                .style("opacity", .9);
    }

    function mousemove(event, d){
        tooltipDiv2.html("<strong>Rail Route Name: " + display_name_map.get(d.route_name) + "</strong><br>Daily Avg Ridership: "
        + Math.round(d.average_ons_total_day))
                .style("left", (event.pageX + 20) + "px")
                .style("top", (event.pageY - 25) + "px");
    }

    function mouseleave(){
        tooltipDiv2
            .style('opacity', 0)
    }
}

drawRailRidership()

function filter_rail_chart(route_names) {
    console.log(route_names)
    rail_bar.selectAll('rect').classed('unselected', d => !route_names.includes(d.line_name))
}

function unfilter_rail_chart() {
    rail_bar.selectAll('.unselected').classed('unselected', false)
}