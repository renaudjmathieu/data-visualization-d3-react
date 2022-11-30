import React, { useEffect, useRef } from 'react'
import * as d3 from "d3"
import './styles.css'

const ScatterPlotViz = (props) => {
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
        top: 30,
        right: 100,
        bottom: 50,
        left: 10,
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

    const bounds = wrapper.append("g")
      .style("transform", `translate(${dimensions.margins.left}px, ${dimensions.margins.top}px)`)

    // Create scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(props.data, props.xAccessor))
      .range([0, dimensions.boundedWidth])
      .nice()

    const binsGenerator = d3.bin()
      .domain(xScale.domain())
      .value(props.xAccessor)
      .thresholds(12)

    const bins = binsGenerator(props.data)

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(bins, props.yAccessor)])
      .range([dimensions.boundedHeight, 0])
      .nice()

    // Draw data
    const binGroup = bounds.append("g")
    const binGroups = binGroup.selectAll("g")
      .data(bins)
      .join("g")
      .attr("class", "bin")

    const barPadding = 1
    const barRects = binGroups.append("rect")
      .attr("x", d => xScale(d.x0) + barPadding / 2)
      .attr("y", d => yScale(props.yAccessor(d)))
      .attr("width", d => d3.max([
        0,
        xScale(d.x1) - xScale(d.x0) - barPadding
      ]))
      .attr("height", d => dimensions.boundedHeight
        - yScale(props.yAccessor(d))
      )

    const barText = binGroups.filter(props.yAccessor)
      .append("text")
      .attr("x", d => xScale(d.x0)
        + (xScale(d.x1) - xScale(d.x0)) / 2
      )
      .attr("y", d => yScale(props.yAccessor(d)) - 5)
      .text(props.yAccessor)

    // Draw peripherals
    const mean = d3.mean(props.data, props.xAccessor)
    const meanLine = bounds.append("line")
      .attr("x1", xScale(mean))
      .attr("x2", xScale(mean))
      .attr("y1", -15)
      .attr("y2", dimensions.boundedHeight)
      .attr("class", "mean")

    const meanLabel = bounds.append("text")
      .attr("x", xScale(mean))
      .attr("y", -20)
      .text("mean")
      .attr("class", "mean-label")

    const xAxisGenerator = d3.axisBottom()
      .scale(xScale)

    const xAxis = bounds.append("g")
      .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)

    const xAxisLabel = xAxis.append("text")
      .attr("x", dimensions.boundedWidth / 2)
      .attr("y", dimensions.margins.bottom - 10)
      .attr("class", "x-axis-label")
      .text(props.xAxisLabel)

  }, [props, ref.current])

  return <div ref={ref}></div>
};

export default ScatterPlotViz