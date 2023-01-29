import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"
import { accessorPropsType, callAccessor } from "./utils";
import { dimensionsPropsType } from "./utils";
import { useTheme } from '@mui/material/styles';

const Tooltipper = ({ data, dimensions, xAccessor, yAccessor, xScale, yScale, a, ab, abc, abcd, ...props }) => {
  const tooltip = d3.select("#tooltipD3")
  const theme = useTheme();

  const handleMouseMove = (e, data) => {

    const bounds = d3.select(e.target.parentElement)
    const tooltipDot = bounds.selectAll(".tooltip-circle")
    
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
      .text(a + ": " + abc(closestDataPoint))

    tooltip.select("#tooltipD3-value2")
      .text(ab + ": " + abcd(closestDataPoint))

    const x = dimensions.offsetLeft + 16 + dimensions.marginLeft + xScale(closestXValue)
    const y = dimensions.offsetTop + 8 + dimensions.marginTop + yScale(closestYValue)

    tooltip.style("transform", `translate(`
      + `calc( -50% + ${x}px),`
      + `calc(-100% + ${y}px)`
      + `)`)

    tooltip.style("opacity", 1)

    tooltipDot
      .attr("cx", xScale(closestXValue))
      .attr("cy", yScale(closestYValue))
      .style("opacity", 1)
  }

  const handleMouseLeave = () => {
    tooltip.style("opacity", 0)

    d3.selectAll(".tooltip-circle")
      .style("opacity", 0)
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
      onMouseMove={e => handleMouseMove(e, data)}
      onMouseLeave={handleMouseLeave}
    />
    <circle
      id="tooltipDot"
      className="tooltip-circle"
      r={6}
      stroke={theme.vars.palette.primary.complementaryColor}
      fill="white"
      stroke-width={2}
      opacity={0}
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
