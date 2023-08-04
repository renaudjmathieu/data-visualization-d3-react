import React from "react"
import * as d3 from "d3"

import { useTheme } from '@mui/material/styles';
import { useNewChartDimensions, Chart } from "../providers/ChartDimensionsProvider"
import { useChartsContext } from "../providers/ChartsProvider"
import { useDataContext } from "../providers/DataProvider"

import Axis from "./Axis"

const Timeline = (props) => {

  const theme = useTheme();
  const [ref, dimensions] = useNewChartDimensions()
  const { charts } = useChartsContext()
  const { selectedChartIndex, selectedColumnType, selectedColumn1, selectedItem1 } = useDataContext()
  const currentChart = charts[props.chartIndex]

  const xScale = d3.scaleTime()
    .domain(d3.extent(props.data, currentChart.xAxisAccessor))
    .range([0, dimensions.boundedWidth])

  const yScale = d3.scaleLinear()
    .domain(d3.extent(props.data, currentChart.yAxisAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()


  const tooltip = d3.select(`#tooltipD3${props.zoomed ? 'zoomed' : ''}`)

  const [clickedClosestDataPoint, setClickedClosestDataPoint] = React.useState(null)

  const interpolation = d3.curveLinear

  const handleMouseDown = (e) => {
    const bounds = d3.select(e.target.parentElement)
    const dot = bounds.selectAll(".yo-circle")
    const mousePosition = d3.pointer(e)
    const hoveredDate = xScale.invert(mousePosition[0])

    const getDistanceFromHoveredDate = d => Math.abs(currentChart.xAxisAccessor(d) - hoveredDate)
    const closestIndex = d3.leastIndex(props.data, (a, b) => (
      getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b)
    ))
    const closestDataPoint = props.data[closestIndex]

    const closestXValue = currentChart.xAxisAccessor(closestDataPoint)
    const closestYValue = currentChart.yAxisAccessor(closestDataPoint)

    const formatter = currentChart.xAxisFormat ? d3.timeFormat(currentChart.xAxisFormat) : null

    if (selectedChartIndex === props.chartIndex && selectedColumnType === 'SingleValue' && selectedColumn1 === currentChart.xAxis && formatter(selectedItem1) === formatter(closestXValue)) {
      props.handleHighlightData(e, null, null, null, null, null, null, null, null)
    }
    else {
      if (selectedChartIndex === props.chartIndex) {
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
      props.handleHighlightData(e, props.chartIndex, 'SingleValue', currentChart.xAxis, null, closestXValue, null, currentChart.xAxisFormat, null)
    }

  }

  const handleMouseMove = (e) => {
    const bounds = d3.select(e.target.parentElement)
    const tooltipDot = bounds.selectAll(".tooltip-circle")
    const tooltipLine = bounds.selectAll(".tooltip-line")

    const mousePosition = d3.pointer(e)
    const hoveredDate = xScale.invert(mousePosition[0])

    const getDistanceFromHoveredDate = d => Math.abs(currentChart.xAxisAccessor(d) - hoveredDate)
    const closestIndex = d3.leastIndex(props.data, (a, b) => (
      getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b)
    ))
    const closestDataPoint = props.data[closestIndex]

    const closestXValue = currentChart.xAxisAccessor(closestDataPoint)
    const closestYValue = currentChart.yAxisAccessor(closestDataPoint)

    const tooltipValue1ValueFormatter = currentChart.xAxisType === 'date' ? d3.timeFormat("%B %d, %Y") : currentChart.xAxisType === 'time' ? d3.timeFormat("%H:%M") : d3.format(".2f")
    const tooltipValue2ValueFormatter = currentChart.yAxisType === 'date' ? d3.timeFormat("%B %d, %Y") : currentChart.yAxisType === 'time' ? d3.timeFormat("%H:%M") : d3.format(".2f")

    tooltip.select(`#tooltipD3${props.zoomed ? 'zoomed' : ''}-value1`)
      .text(currentChart.xAxis.charAt(0).toUpperCase() + currentChart.xAxis.slice(1).replace(/([A-Z])/g, ' $1') + ": " + tooltipValue1ValueFormatter(currentChart.xAxisAccessor(closestDataPoint)))

    tooltip.select(`#tooltipD3${props.zoomed ? 'zoomed' : ''}-value2`)
      .text(currentChart.yAxis.charAt(0).toUpperCase() + currentChart.yAxis.slice(1).replace(/([A-Z])/g, ' $1') + ": " + tooltipValue2ValueFormatter(currentChart.yAxisAccessor(closestDataPoint)))

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

  const xAxisAccessorScaled = d => xScale(currentChart.xAxisAccessor(d))
  const yAxisAccessorScaled = d => yScale(currentChart.yAxisAccessor(d))
  const y0AccessorScaled = yScale(yScale.domain()[0])

  const lineGenerator = d3.line()
    .curve(interpolation)
    .x(xAxisAccessorScaled)
    .y(yAxisAccessorScaled)

  const areaGenerator = d3.area()
    .curve(interpolation)
    .x(xAxisAccessorScaled)
    .y(yAxisAccessorScaled)
    .y0(y0AccessorScaled)
    .y1(yAxisAccessorScaled)

  if (selectedChartIndex !== props.chartIndex || selectedColumn1 !== currentChart.xAxis) {
    d3.selectAll(".yo-circle")
      .style("opacity", 0)
  }

  if (clickedClosestDataPoint) {
    const dot = d3.selectAll(".yo-circle")
    const closestXValue = currentChart.xAxisAccessor(clickedClosestDataPoint)
    const closestYValue = currentChart.yAxisAccessor(clickedClosestDataPoint)

    dot
      .attr("cx", xScale(closestXValue))
      .attr("cy", yScale(closestYValue))
      .style("opacity", 1)

    setClickedClosestDataPoint(null)
  }


  return (
    <div className={`Chart__rectangle__large ${props.zoomed ? 'zoomed' : props.active ? 'active' : ''} ${props.outOfFocus ? 'outOfFocus' : 'inFocus'}`} ref={ref}>
      <Chart dimensions={dimensions}>
        <Axis
          dimension="x"
          scale={xScale}
          format={currentChart.xAxisType}
        />
        <Axis
          dimension="y"
          scale={yScale}
          label={currentChart.yAxis.charAt(0).toUpperCase() + currentChart.yAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          format={currentChart.yAxisType}
        />
        <path
          className={[
            `Polyline Polyline--type-area`,
            `Polyline Polyline--type-area--is-${selectedChartIndex === props.chartIndex && selectedColumn1 === currentChart.xAxis ? "next-to-selected" : "selected"
            }`
          ].join(" ")}
          d={areaGenerator(props.data)}
        />
        <path
          className={[
            `Polyline Polyline--type-${props.data.length === 1 ? "circle" : "line"}`,
            `Polyline Polyline--type-${props.data.length === 1 ? "circle" : "line"}--is-${selectedChartIndex === props.chartIndex && selectedColumn1 === currentChart.xAxis ? "next-to-selected" : "selected"
            }`
          ].join(" ")}
          d={lineGenerator(props.data)}
        />
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
          onMouseMove={!props.outOfFocus ? (e => handleMouseMove(e)) : null}
          onMouseLeave={!props.outOfFocus ? handleMouseLeave : null}
          onMouseDown={!props.outOfFocus ? (e => handleMouseDown(e)) : null}
        />
      </Chart>
    </div>
  )
}

export default Timeline
