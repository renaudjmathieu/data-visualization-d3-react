import React, { useState, useEffect, useRef } from 'react'
import * as d3 from "d3"

const ScatterPlotViz = (props) => {
  const ref = useRef(null)

  useEffect(() => {
    // Accessors
    const xAccessor = (d) => d.dewPoint
    const yAccessor = (d) => d.humidity

    // Dimensions
    const width =  d3.max([d3.min([
      props.Width * 0.9,
      props.Height,
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
        .style(
          "transform", `translate(${
            dimensions.margins.left
          }px, ${ 
            dimensions.margins.top
          }px)`
        )

    // Create scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(props.Data, xAccessor))
      .range([0, dimensions.boundedWidth])
      .nice()

    const yScale = d3.scaleLinear()
      .domain(d3.extent(props.Data, yAccessor))
      .range([dimensions.boundedHeight, 0])
      .nice()

    // Draw data
    const dots = bounds
      .selectAll("circle")
      .data(props.Data)
      .enter()
      .append("circle")
        .attr("cx", d => xScale(xAccessor(d)))
        .attr("cy", d => yScale(yAccessor(d)))
        .attr("r", 5)
        .attr("fill", "cornflowerblue")

    // Draw peripherals
    const xAxisGenerator = d3.axisBottom()
      .scale(xScale)

    const xAxis = bounds
      .append("g")
        .call(xAxisGenerator)
        .style("transform", `translateY(${
          dimensions.boundedHeight
        }px)`)

    const xAxisLabel = xAxis
      .append("text")
        .attr("x", dimensions.boundedWidth / 2)
        .attr("y", dimensions.margins.bottom - 10)
        .attr("fill", "black")
        .style("font-size", "1.4em")
        .html("Dew point (&deg;F)")

    const yAxisGenerator = d3.axisLeft()
      .scale(yScale)
      .ticks(4)

    const yAxis = bounds
      .append("g")
        .call(yAxisGenerator)

    const yAxisLabel = yAxis
      .append("text")
        .attr("x", -dimensions.boundedHeight / 2)
        .attr("y", -dimensions.margins.left + 10)
        .attr("fill", "black")
        .style("font-size", "1.4em")
        .html("Relative humidity")
        .style("transform", "rotate(-90deg)")
        .style("text-anchor", "middle")

  }, [props.Data, props.Width, props.Height, ref.current])

  return <div ref={ref}></div>
};

export default ScatterPlotViz