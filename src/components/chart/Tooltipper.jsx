import React from "react"
import * as d3 from "d3"
import { useTheme } from '@mui/material/styles';

const Tooltipper = ({ zoomed, data, dimensions, xAccessor, yAccessor, xScale, yScale, tooltipValue1Title, tooltipValue1Value, tooltipValue2Title, tooltipValue2Value, tooltipValue1ValueFormat, tooltipValue2ValueFormat }) => {
  const tooltip = d3.select(`#tooltipD3${zoomed ? 'zoomed' : ''}`)
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

    const tooltipValue1ValueFormatter = tooltipValue1ValueFormat === 'date' ? d3.timeFormat("%B %d, %Y") : tooltipValue1ValueFormat === 'time' ? d3.timeFormat("%H:%M") : d3.format(".2f")
    const tooltipValue2ValueFormatter = tooltipValue2ValueFormat === 'date' ? d3.timeFormat("%B %d, %Y") : tooltipValue2ValueFormat === 'time' ? d3.timeFormat("%H:%M") : d3.format(".2f")

    tooltip.select(`#tooltipD3${zoomed ? 'zoomed' : ''}-value1`)
      .text(tooltipValue1Title + ": " + tooltipValue1ValueFormatter(tooltipValue1Value(closestDataPoint)))

    tooltip.select(`#tooltipD3${zoomed ? 'zoomed' : ''}-value2`)
      .text(tooltipValue2Title + ": " + tooltipValue2ValueFormatter(tooltipValue2Value(closestDataPoint)))

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
    <rect
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

export default Tooltipper
