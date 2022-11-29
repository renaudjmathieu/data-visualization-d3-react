import React, { useState, useEffect, useRef } from 'react'
import * as d3 from "d3"

const LineChartViz = (props) => {
  const ref = useRef(null)

  useEffect(() => {
    // Accessors
    const parseDate = d3.timeParse("%Y-%m-%d")
    const xAccessor = (d) => parseDate(d.date)
    const yAccessor = (d) => d.temperatureMax

    // Dimensions
    const width = d3.max([
      props.Width,
      800,
    ])
    const height = d3.max([
      props.Height > 600 ? 600 : props.Height,
      400,
    ])
    
    let dimensions = {
      width,
      height,
      margins: {
        top: 10,
        right: 80,
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
    const xScale = d3.scaleTime()
      .domain(d3.extent(props.Data, xAccessor))
      .range([0, dimensions.boundedWidth])
      .nice()

    const yScale = d3.scaleLinear()
      .domain(d3.extent(props.Data, yAccessor))
      .range([dimensions.boundedHeight, 0])
      .nice()
      
    const freezingTemperaturePlacement = yScale(32)
    const freezingTemperatures = bounds
      .append("rect")
        .attr("x", 0)
        .attr("width", dimensions.boundedWidth)
        .attr("y", freezingTemperaturePlacement)
        .attr("height", dimensions.boundedHeight - freezingTemperaturePlacement)
        .attr("fill", "#e0f3f3")

    // Draw data
    const lineGenerator = d3.line()
      .x(d => xScale(xAccessor(d)))
      .y(d => yScale(yAccessor(d)))
      
    const line = bounds
      .append("path")
        .attr("d", lineGenerator(props.Data))
        .attr("fill", "none")
        .attr("stroke", "#af9358")
        .attr("stroke-width", 2)

    // Draw peripherals
    const xAxisGenerator = d3.axisBottom()
      .scale(xScale)  

    const xAxis = bounds
      .append("g")
        .call(xAxisGenerator)
          .style(
            "transform", `translateY(${
              dimensions.boundedHeight
            }px)`)

    const yAxisGenerator = d3.axisLeft()
      .scale(yScale)
      
    const yAxis = bounds
      .append("g")
        .call(yAxisGenerator)

  }, [props.Data, props.Width, props.Height, ref.current])

  return <div ref={ref}></div>
}

export default LineChartViz