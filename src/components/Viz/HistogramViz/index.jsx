import React, { useEffect, useRef } from 'react'
import * as d3 from "d3"
import './styles.css'

const HistogramViz = (props) => {
  const ref = useRef()

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

    // Draw canvas
    const wrapper = d3.select(ref.current)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

    const bounds = wrapper.selectAll("g.bounds")
      .data([null])
      .join("g")
      .attr("class", "bounds")
      .style("transform", `translate(${dimensions.margins.left}px, ${dimensions.margins.top}px)`)

    bounds.append("g")
      .attr("class", "bins")

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
    const barPadding = 1

    const updateTransition = d3.transition()
      .duration(1000)
      .delay(1000)
      .ease(d3.easeCubicInOut)
    const exitTransition = d3.transition()
      .duration(1000)
      .ease(d3.easeCubicInOut)


    const barRects = bounds.select(".bins")
      .selectAll(".bin")
      .data(bins)
      .join(
        enter => (
          enter.append("g")
                .attr("class", "bin")
              .append("rect")
                .attr("class", "bar")
                .attr("x", d => xScale(d.x0) + barPadding)
                .attr("y", d => dimensions.boundedHeight)
                .attr("width", d => d3.max([0,xScale(d.x1) - xScale(d.x0) - barPadding]))
                .attr("height", 0)
                .style("fill", "yellowgreen")
            .call(enter => (
              enter.transition(updateTransition)
                .attr("x", d => xScale(d.x0) + barPadding)
                .attr("y", d => yScale(props.yAccessor(d)))
                .attr("width", d => d3.max([0,xScale(d.x1) - xScale(d.x0) - barPadding]))
                .attr("height", d => dimensions.boundedHeight - yScale(props.yAccessor(d)))
                .transition()
                  .style("fill", "cornflowerblue")
              ))
        ),
        update => (
          update.select(".bar")
                  .transition(updateTransition)
                    .attr("x", d => xScale(d.x0) + barPadding)
                    .attr("y", d => yScale(props.yAccessor(d)))
                    .attr("width", d => d3.max([0,xScale(d.x1) - xScale(d.x0) - barPadding]))
                    .attr("height", d => dimensions.boundedHeight - yScale(props.yAccessor(d)))
                    .style("fill", "cornflowerblue")
        ),
        exit => (
          exit.select(".bar")
                .transition(exitTransition)
                  .attr("height", 0)
                  .attr("y", d => dimensions.boundedHeight)
                  .remove()
        ),
      )

    // Draw peripherals
    const mean = d3.mean(props.data, props.xAccessor)
    const meanLine = bounds.selectAll("line.mean")
      .data([null])
      .join("line")
      .attr("class", "mean")
      .attr("x1", xScale(mean))
      .attr("x2", xScale(mean))
      .attr("y1", -15)
      .attr("y2", dimensions.boundedHeight)

    const meanLabel = bounds.selectAll("text.mean-label")
      .data([null])
      .join("text")
      .attr("class", "mean-label")
      .attr("x", xScale(mean))
      .attr("y", -20)
      .text("mean")

    const xAxisGenerator = d3.axisBottom()
      .scale(xScale)

    const xAxis = bounds.selectAll("g.x-axis")
      .data([null])
      .join("g")
      .attr("class", "x-axis")
      .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)

    const xAxisLabel = xAxis.selectAll("text.x-axis-label")
      .data([null])
      .join("text")
      .attr("class", "x-axis-label")
      .attr("x", dimensions.boundedWidth / 2)
      .attr("y", dimensions.margins.bottom - 10)
      .text(props.xAxisLabel)

  }, [props])

  return <svg ref={ref} />
};

export default HistogramViz