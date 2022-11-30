import React, { useEffect, useRef } from 'react'
import * as d3 from "d3"

const ScatterPlotViz = (props) => {
  const ref = useRef(null)

  useEffect(() => {
    // Dimensions
    const width = d3.max([d3.min([
      props.width * 0.9,
      props.height,
    ]), 400])
    let dimensions = {
      width,
      height: width,
      margins: {
        top: 10,
        right: 10,
        bottom: 50,
        left: 50,
      }
    }
    dimensions.boundedWidth = dimensions.width
      - dimensions.margins.left
      - dimensions.margins.right
    dimensions.boundedHeight = dimensions.height
      - dimensions.margins.top
      - dimensions.margins.bottom

    // Clear canvas
    d3.select(ref.current).selectAll("*").remove()

    // Draw canvas
    const wrapper = d3.select(ref.current)
      .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

    const bounds = wrapper
      .append("g")
      .style("transform", `translate(${dimensions.margins.left}px, ${dimensions.margins.top}px)`)

    // Create scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(props.data, props.xAccessor))
      .range([0, dimensions.boundedWidth])
      .nice()

    const yScale = d3.scaleLinear()
      .domain(d3.extent(props.data, props.yAccessor))
      .range([dimensions.boundedHeight, 0])
      .nice()

    const colorScale = d3.scaleLinear()
      .domain(d3.extent(props.data, props.colorAccessor))
      .range(["skyblue", "darkslategrey"])

    // Draw data
    const dots = bounds.selectAll("circle")
      .data(props.data)
      .join("circle")
      .attr("cx", d => xScale(props.xAccessor(d)))
      .attr("cy", d => yScale(props.yAccessor(d)))
      .attr("r", 5)
      .attr("fill", d => colorScale(props.colorAccessor(d)))

    // Draw peripherals
    const xAxisGenerator = d3.axisBottom()
      .scale(xScale)

    const xAxis = bounds.append("g")
      .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)

    const xAxisLabel = xAxis.append("text")
      .attr("x", dimensions.boundedWidth / 2)
      .attr("y", dimensions.margins.bottom - 10)
      .attr("fill", "black")
      .style("font-size", "1.4em")
      .html(props.xAxisLabel)

    const yAxisGenerator = d3.axisLeft()
      .scale(yScale)
      .ticks(4)

    const yAxis = bounds.append("g")
      .call(yAxisGenerator)

    const yAxisLabel = yAxis.append("text")
      .attr("x", -dimensions.boundedHeight / 2)
      .attr("y", -dimensions.margins.left + 10)
      .attr("fill", "black")
      .style("font-size", "1.4em")
      .html(props.yAxisLabel)
      .style("transform", "rotate(-90deg)")
      .style("text-anchor", "middle")

    const legend = wrapper.append("g")
      .style("transform", `translate(${dimensions.width - 150}px, ${dimensions.height - 150}px)`)

    const legendTitle = legend.append("text")
      .attr("x", 0)
      .attr("y", -10)
      .attr("fill", "black")
      .style("font-size", "1.4em")
      .html(props.colorLegendLabel)

    const legendScale = d3.scaleLinear()
      .domain(colorScale.domain())
      .range([0, 100])

    const legendAxisGenerator = d3.axisRight()
      .scale(legendScale)
      .tickSize(13)
      .ticks(3)
      .tickFormat(d3.format(".2s"))

    const legendAxis = legend.append("g")
      .call(legendAxisGenerator)
      .style("transform", `translateX(100px)`)

    const legendRect = legend.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 100)
      .attr("height", 80)
      .attr("fill", "none")
      .attr("stroke", "black")

  }, [props, ref.current])

  return <div ref={ref}></div>
};

export default ScatterPlotViz