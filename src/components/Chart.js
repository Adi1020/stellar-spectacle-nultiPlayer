// src/components/Chart.js

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function Chart() {
  const svgRef = useRef();

  useEffect(() => {
    const data = [12, 25, 6, 30, 18, 20, 15, 23, 29, 10];
    const svg = d3.select(svgRef.current)
      .attr('width', 600)
      .attr('height', 400)
      .style('background-color', '#f9f9f9')
      .style('margin', '50px')
      .style('overflow', 'visible');

    const xScale = d3.scaleBand()
      .domain(data.map((val, index) => index))
      .range([0, 600])
      .padding(0.4);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .range([400, 0]);

    const xAxis = d3.axisBottom(xScale).ticks(data.length);
    const yAxis = d3.axisLeft(yScale).ticks(10);

    svg.append('g')
      .call(xAxis)
      .attr('transform', 'translate(0, 400)');

    svg.append('g')
      .call(yAxis);

    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (val, index) => xScale(index))
      .attr('y', yScale)
      .attr('width', xScale.bandwidth)
      .attr('height', val => 400 - yScale(val))
      .attr('fill', '#3e95cd')
      .on('mouseover', function(event, val) {
        d3.select(this)
          .attr('fill', '#ff6347');
      })
      .on('mouseout', function(event, val) {
        d3.select(this)
          .attr('fill', '#3e95cd');
      });

    // Update the chart with new data
    function updateChart(newData) {
      yScale.domain([0, d3.max(newData)]);

      svg.selectAll('.bar')
        .data(newData)
        .transition()
        .duration(500)
        .attr('y', yScale)
        .attr('height', val => 400 - yScale(val));
    }

    // Example: Updating the chart after 2 seconds with new data
    setTimeout(() => {
      const newData = [20, 15, 25, 35, 10, 5, 40, 28, 33, 18];
      updateChart(newData);
    }, 2000);

  }, []);

  return <svg ref={svgRef}></svg>;
}

export default Chart;
