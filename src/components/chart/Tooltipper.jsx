import React from "react"
import * as d3 from "d3"
import { useTheme } from '@mui/material/styles';

const Tooltipper = ({ zoomed, data, dimensions, xAccessor, yAccessor, xScale, yScale, tooltipValue1Title, tooltipValue1Value, tooltipValue2Title, tooltipValue2Value, tooltipValue1ValueFormat, tooltipValue2ValueFormat, onMouseDown, column, selectedChart, chartIndex, selectedColumnType, selectedColumn1, selectedColumn2, selectedItem1, selectedItem2, xAxisFormat}) => {
  const tooltip = d3.select(`#tooltipD3${zoomed ? 'zoomed' : ''}`)
  const theme = useTheme();

  const handleMouseDown = (e, data) => {
    const mousePosition = d3.pointer(e)
    const hoveredDate = xScale.invert(mousePosition[0])

    const getDistanceFromHoveredDate = d => Math.abs(xAccessor(d) - hoveredDate)
    const closestIndex = d3.leastIndex(data, (a, b) => (
      getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b)
    ))
    const closestDataPoint = data[closestIndex]

    const closestXValue = xAccessor(closestDataPoint)

    if (selectedColumnType == 'SingleValue' && selectedColumn1 === column && selectedItem1 === closestXValue) {
      onMouseDown(e, null, null, null, null, null, null, null, null)
    }
    else {
      onMouseDown(e, chartIndex, 'SingleValue', column, null, closestXValue, null, xAxisFormat, null)
    }

  }

  const handleMouseMove = (e, data) => {

    const bounds = d3.select(e.target.parentElement)
    const tooltipDot = bounds.selectAll(".tooltip-circle")
    const tooltipLine = bounds.selectAll(".tooltip-line")

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

    tooltipLine
      .attr("x", xScale(closestXValue))
      .style("opacity", 1)
  }

  const handleMouseLeave = () => {
    tooltip.style("opacity", 0)

    d3.selectAll(".tooltip-circle")
      .style("opacity", 0)

    d3.selectAll(".tooltip-line")
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
      id="tooltipLine"
      className="tooltip-line"
      y={0}
      width={1}
      height={dimensions.boundedHeight}
    />
    <circle
      id="tooltipDot"
      className="tooltip-circle"
      r={4}
      fill={theme.vars.palette.primary.main}
      opacity={0}
    />
    <rect
      className="listening-rect"
      width={dimensions.boundedWidth}
      height={dimensions.boundedHeight}
      onMouseMove={e => handleMouseMove(e, data)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={e => handleMouseDown(e, data)}
    />
  </React.Fragment>
}

export default Tooltipper
