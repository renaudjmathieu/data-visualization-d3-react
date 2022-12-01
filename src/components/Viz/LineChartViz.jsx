import React, { useEffect, useRef } from 'react'
import * as d3 from "d3"

const LineChartViz = (props) => {
  const ref = useRef(null)

  useEffect(() => {
    // Dimensions
    const width = d3.max([
      props.width,
      800,
    ])
    const height = d3.max([
      props.height > 600 ? 600 : props.height,
      400,
    ])
    let dimensions = {
      width,
      height,
      margins: {
        top: 10,
        right: 100,
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
    const xScale = d3.scaleTime()
      .domain(d3.extent(props.data, props.xAccessor))
      .range([0, dimensions.boundedWidth])
      .nice()

    const yScale = d3.scaleLinear()
      .domain(d3.extent(props.data, props.yAccessor))
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
      .x(d => xScale(props.xAccessor(d)))
      .y(d => yScale(props.yAccessor(d)))

    const line = bounds
      .append("path")
      .attr("d", lineGenerator(props.data))
      .attr("fill", "none")
      .attr("stroke", "#af9358")
      .attr("stroke-width", 2)

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

  }, [props, ref.current])

  return <div ref={ref}></div>
}

export default LineChartViz