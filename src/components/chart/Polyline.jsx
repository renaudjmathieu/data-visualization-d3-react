import React from "react"
import * as d3 from "d3"
import { useTheme } from '@mui/material/styles';

const Polyline = ({ type, zoomed, data, dimensions, xAccessorScaled, yAccessorScaled, y0AccessorScaled, selectedChart, chartIndex, selectedColumnType, selectedColumn, column, selectedItem, xScale, yScale, tooltipValue1Title, xAccessor, tooltipValue2Title, yAccessor, tooltipValue1ValueFormat, tooltipValue2ValueFormat, onMouseDown, xAxisFormat, ...props }) => {
  const tooltip = d3.select(`#tooltipD3${zoomed ? 'zoomed' : ''}`)
  const theme = useTheme();

  const [clickedClosestDataPoint, setClickedClosestDataPoint] = React.useState(null)

  const interpolation = d3.curveMonotoneX

  const handleMouseDown = (e, data) => {

    const bounds = d3.select(e.target.parentElement)
    const dot = bounds.selectAll(".yo-circle")
    const mousePosition = d3.pointer(e)
    const hoveredDate = xScale.invert(mousePosition[0])

    const getDistanceFromHoveredDate = d => Math.abs(xAccessor(d) - hoveredDate)
    const closestIndex = d3.leastIndex(data, (a, b) => (
      getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b)
    ))
    const closestDataPoint = data[closestIndex]

    const closestXValue = xAccessor(closestDataPoint)
    const closestYValue = yAccessor(closestDataPoint)

    const formatter = xAxisFormat ? d3.timeFormat(xAxisFormat) : null

    if (selectedChart === chartIndex && selectedColumnType === 'SingleValue' && selectedColumn === column && formatter(selectedItem) === formatter(closestXValue)) {
      onMouseDown(e, null, null, null, null, null, null, null, null)
    }
    else {

      if (selectedChart === chartIndex) {
        dot
          .attr("cx", xScale(closestXValue))
          .attr("cy", yScale(closestYValue))
          .style("opacity", 1)
      }
      else {
        d3.selectAll(".tooltip-circle")
          .style("opacity", 0)

        setClickedClosestDataPoint(closestDataPoint)
      }

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
      .text(tooltipValue1Title + ": " + tooltipValue1ValueFormatter(xAccessor(closestDataPoint)))

    tooltip.select(`#tooltipD3${zoomed ? 'zoomed' : ''}-value2`)
      .text(tooltipValue2Title + ": " + tooltipValue2ValueFormatter(yAccessor(closestDataPoint)))

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

  if (dimensions) {
    const delaunay = d3.Delaunay.from(
      data,
      xAccessor,
      yAccessor,
    )
    const voronoi = delaunay.voronoi()
    voronoi.xmax = dimensions.boundedWidth
    voronoi.ymax = dimensions.boundedHeight
  }


  const lineGenerator = d3[type === "circle" ? "line" : type]()
    .curve(interpolation)

  lineGenerator
    .x(xAccessorScaled)
    .y(yAccessorScaled)

  if (type === "area") {
    lineGenerator
      .y0(y0AccessorScaled)
      .y1(yAccessorScaled)
  }

  if (selectedChart !== chartIndex || selectedColumn !== column) {
    d3.selectAll(".yo-circle")
      .style("opacity", 0)
  }

  if (clickedClosestDataPoint) {
    const dot = d3.selectAll(".yo-circle")
    const closestXValue = xAccessor(clickedClosestDataPoint)
    const closestYValue = yAccessor(clickedClosestDataPoint)

    dot
      .attr("cx", xScale(closestXValue))
      .attr("cy", yScale(closestYValue))
      .style("opacity", 1)

    setClickedClosestDataPoint(null)
  }

  return <React.Fragment>

    <path {...props}
      className={[
        `Polyline Polyline--type-${type}`,
        `Polyline Polyline--type-${type}--is-${selectedChart === chartIndex && selectedColumn === column ? "next-to-selected" : "selected"
        }`
      ].join(" ")}
      d={lineGenerator(data)}
    />

    {dimensions && <>
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
      <circle
        className="yo-circle"
        r={4}
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
    </>
    }
  </React.Fragment>
}

export default Polyline
