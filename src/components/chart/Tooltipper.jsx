import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"
import { accessorPropsType, callAccessor } from "./utils";
import { dimensionsPropsType } from "./utils";

const Tooltipper = ({ data, dimensions, xAccessor, yAccessor, xScale, yScale, a, ab, abc, abcd, ...props }) => {
  const tooltip = d3.select("#tooltipD3")

  const handleMouseEnter = (e, data) => {
    const bounds = d3.select(e.target.parentElement)

    const mousePosition = d3.pointer(e)
    const hoveredDate = xScale.invert(mousePosition[0])

    const getDistanceFromHoveredDate = d => Math.abs(xAccessor(d) - hoveredDate)
    const closestIndex = d3.leastIndex(data, (a, b) => (
      getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b)
    ))
    const closestDataPoint = data[closestIndex]

    const closestXValue = xAccessor(closestDataPoint)
    const closestYValue = yAccessor(closestDataPoint)

    tooltip.select("#tooltipD3-value1")
      .text(a + ": " + "abc(d)")

    tooltip.select("#tooltipD3-value2")
      .text(ab + ": " + "abcd(d)")

    const parentDiv = e.target.parentElement.getBoundingClientRect()

    const x = xScale(closestXValue)
      + dimensions.marginLeft
    const y = yScale(closestYValue)
      + dimensions.marginTop

    tooltip.style("transform", `translate(`
      + `calc( -50% + ${x}px),`
      + `calc(-100% + ${y}px)`
      + `)`)

    const tooltipCircle = bounds.append("circle")
      .attr("class", "tooltip-circle")
      .attr("cx", xScale(closestXValue))
      .attr("cy", yScale(closestYValue))
      .attr("r", 4)
      .attr("stroke", "#af9358")
      .attr("fill", "white")
      .attr("stroke-width", 2)
      .style("opacity", 1)

    tooltip.style("opacity", 1)

    console.log(mousePosition)
    console.log(closestXValue)
    console.log(closestYValue)
  }

  const handleMouseLeave = () => {
    d3.selectAll(".tooltipDot")
      .remove()

    tooltip.style("opacity", 0)
  }

  const delaunay = d3.Delaunay.from(
    data,
    xAccessor,
    yAccessor,
  )
  const voronoi = delaunay.voronoi()
  voronoi.xmax = dimensions.boundedWidth
  voronoi.ymax = dimensions.boundedHeight

  return <React.Fragment>
    <rect {...props}
      className="listening-rect"
      width={dimensions.boundedWidth}
      height={dimensions.boundedHeight}
      onMouseEnter={e => handleMouseEnter(e, data)}
      onMouseLeave={handleMouseLeave}
    />
  </React.Fragment>
}

Tooltipper.propTypes = {
  data: PropTypes.array,
  dimensions: dimensionsPropsType,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  xScale: accessorPropsType,
  yScale: accessorPropsType,
  a: accessorPropsType,
  ab: accessorPropsType,
  abc: accessorPropsType,
  abcd: accessorPropsType,
}


export default Tooltipper
