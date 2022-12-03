import React, { useLayoutEffect, useRef } from 'react'
import * as d3 from "d3"
import './styles.css'

const ScrollingLineChartViz = (props) => {
  const ref = useRef()
  const xAccessor = props.xAccessor
  const yAccessor = props.yAccessor
  let data = props.data.sort((a, b) => xAccessor(a) - xAccessor(b)).slice(0, 100)

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

  // Draw canvas
  const wrapper = d3.select(ref.current)
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

  const bounds = wrapper.selectAll("g.bounds")
    .data([null])
    .join("g")
    .attr("class", "bounds")
    .style("transform", `translate(${dimensions.margins.left}px, ${dimensions.margins.top}px)`)

  // init static elements
  bounds.append("rect")
    .attr("class", "freezing")
  bounds.append("path")
    .attr("class", "line")
  bounds.append("g")
    .attr("class", "x-axis")
    .style("transform", `translateY(${dimensions.boundedHeight}px)`)
  bounds.append("g")
    .attr("class", "y-axis")

  const drawLine = (data) => {
    // Create scales
    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, yAccessor))
      .range([dimensions.boundedHeight, 0])

    const freezingTemperaturePlacement = yScale(32)
    const freezingTemperatures = bounds.select(".freezing")
      .attr("x", 0)
      .attr("width", dimensions.boundedWidth)
      .attr("y", freezingTemperaturePlacement)
      .attr("height", dimensions.boundedHeight - freezingTemperaturePlacement)

    const xScale = d3.scaleTime()
      .domain(d3.extent(data, xAccessor))
      .range([0, dimensions.boundedWidth])

    // Draw data
    const lineGenerator = d3.line()
      .x(d => xScale(xAccessor(d)))
      .y(d => yScale(yAccessor(d)))

    const line = bounds.select(".line")
      .attr("d", lineGenerator(data))

    // Draw peripherals
    const yAxisGenerator = d3.axisLeft()
      .scale(yScale)

    const yAxis = bounds.selectAll("g.y-axis")
      .data([null])
      .join("g")
      .attr("class", "y-axis")
      .call(yAxisGenerator)

    const xAxisGenerator = d3.axisBottom()
      .scale(xScale)

    const xAxis = bounds.selectAll("g.x-axis")
      .data([null])
      .join("g")
      .attr("class", "x-axis")
      .call(xAxisGenerator)
  }

  const generateNewDataPoint = (data) => {
    const lastDataPoint = data[data.length - 1]
    const nextDay = d3.timeDay.offset(xAccessor(lastDataPoint), 1)

    return {
      date: d3.timeFormat("%Y-%m-%d")(nextDay),
      temperatureMax: yAccessor(lastDataPoint) + (Math.random() * 6 - 3),
    }
  }

  const addNewDay = () => {
    data = [...data.slice(1), generateNewDataPoint(data)]
    drawLine(data)
  }

  useLayoutEffect(() => {
    // update the line every 1.5 seconds
    const interval = setInterval(() => {
      addNewDay()
    }, 1500);
  }, [props])

  return <svg ref={ref} />
};

export default ScrollingLineChartViz