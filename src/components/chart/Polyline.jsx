import React from "react"
import * as d3 from "d3"
import { useTheme } from '@mui/material/styles';
import { useDataContext } from "../../providers/DataProvider"
import { useChartDimensions } from "./Chart";

const Polyline = (props) => {
  
  const theme = useTheme();
  const dimensions = useChartDimensions()
  const { selectedChartIndex, selectedColumnType, selectedColumn1, selectedItem1 } = useDataContext()

  const tooltip = d3.select(`#tooltipD3${props.zoomed ? 'zoomed' : ''}`)

  const [clickedClosestDataPoint, setClickedClosestDataPoint] = React.useState(null)

  const interpolation = d3.curveLinear
  
  const handleMouseDown = (e, data) => {
    const bounds = d3.select(e.target.parentElement)
    const dot = bounds.selectAll(".yo-circle")
    const mousePosition = d3.pointer(e)
    const hoveredDate = props.xScale.invert(mousePosition[0])

    const getDistanceFromHoveredDate = d => Math.abs(props.xAxisAccessor(d) - hoveredDate)
    const closestIndex = d3.leastIndex(props.data, (a, b) => (
      getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b)
    ))
    const closestDataPoint = props.data[closestIndex]

    const closestXValue = props.xAxisAccessor(closestDataPoint)
    const closestYValue = props.yAxisAccessor(closestDataPoint)

    const formatter = props.xAxisFormat ? d3.timeFormat(props.xAxisFormat) : null

    if (selectedChartIndex === props.chartIndex && selectedColumnType === 'SingleValue' && selectedColumn1 === props.column && formatter(selectedItem1) === formatter(closestXValue)) {
      props.handleHighlightData(e, null, null, null, null, null, null, null, null)
    }
    else {
      if (selectedChartIndex === props.chartIndex) {
        dot
          .attr("cx", props.xScale(closestXValue))
          .attr("cy", props.yScale(closestYValue))
          .style("opacity", 1)
      }
      else {
        d3.selectAll(".tooltip-circle")
          .style("opacity", 0)

        setClickedClosestDataPoint(closestDataPoint)
      }
      props.handleHighlightData(e, props.chartIndex, 'SingleValue', props.column, null, closestXValue, null, props.xAxisFormat, null)
    }

  }

  const handleMouseMove = (e, data) => {

    const bounds = d3.select(e.target.parentElement)
    const tooltipDot = bounds.selectAll(".tooltip-circle")
    const tooltipLine = bounds.selectAll(".tooltip-line")

    const mousePosition = d3.pointer(e)
    const hoveredDate = props.xScale.invert(mousePosition[0])

    const getDistanceFromHoveredDate = d => Math.abs(props.xAxisAccessor(d) - hoveredDate)
    const closestIndex = d3.leastIndex(props.data, (a, b) => (
      getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b)
    ))
    const closestDataPoint = props.data[closestIndex]

    const closestXValue = props.xAxisAccessor(closestDataPoint)
    const closestYValue = props.yAxisAccessor(closestDataPoint)

    const tooltipValue1ValueFormatter = props.tooltipValue1ValueFormat === 'date' ? d3.timeFormat("%B %d, %Y") : props.tooltipValue1ValueFormat === 'time' ? d3.timeFormat("%H:%M") : d3.format(".2f")
    const tooltipValue2ValueFormatter = props.tooltipValue2ValueFormat === 'date' ? d3.timeFormat("%B %d, %Y") : props.tooltipValue2ValueFormat === 'time' ? d3.timeFormat("%H:%M") : d3.format(".2f")

    tooltip.select(`#tooltipD3${props.zoomed ? 'zoomed' : ''}-value1`)
      .text(props.tooltipValue1Title + ": " + tooltipValue1ValueFormatter(props.xAxisAccessor(closestDataPoint)))

    tooltip.select(`#tooltipD3${props.zoomed ? 'zoomed' : ''}-value2`)
      .text(props.tooltipValue2Title + ": " + tooltipValue2ValueFormatter(props.yAxisAccessor(closestDataPoint)))

    const x = dimensions.offsetLeft + 16 + dimensions.marginLeft + props.xScale(closestXValue)
    const y = dimensions.offsetTop + 8 + dimensions.marginTop + props.yScale(closestYValue)

    tooltip.style("transform", `translate(`
      + `calc( -50% + ${x}px),`
      + `calc(-100% + ${y}px)`
      + `)`)

    tooltip.style("opacity", 1)

    tooltipDot
      .attr("cx", props.xScale(closestXValue))
      .attr("cy", props.yScale(closestYValue))
      .style("opacity", 1)

    tooltipLine
      .attr("x", props.xScale(closestXValue))
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
      props.data,
      props.xAxisAccessor,
      props.yAxisAccessor,
    )
    const voronoi = delaunay.voronoi()
    voronoi.xmax = dimensions.boundedWidth
    voronoi.ymax = dimensions.boundedHeight
  }


  const lineGenerator = d3[props.type === "circle" ? "line" : props.type]()
    .curve(interpolation)

  lineGenerator
    .x(props.xAxisAccessorScaled)
    .y(props.yAxisAccessorScaled)

  if (props.type === "area") {
    lineGenerator
      .y0(props.y0AccessorScaled)
      .y1(props.yAxisAccessorScaled)
  }

  if (selectedChartIndex !== props.chartIndex || selectedColumn1 !== props.column) {
    d3.selectAll(".yo-circle")
      .style("opacity", 0)
  }

  if (clickedClosestDataPoint) {
    const dot = d3.selectAll(".yo-circle")
    const closestXValue = props.xAxisAccessor(clickedClosestDataPoint)
    const closestYValue = props.yAxisAccessor(clickedClosestDataPoint)

    dot
      .attr("cx", props.xScale(closestXValue))
      .attr("cy", props.yScale(closestYValue))
      .style("opacity", 1)

    setClickedClosestDataPoint(null)
  }

  return <React.Fragment>

    <path {...props}
      className={[
        `Polyline Polyline--type-${props.type}`,
        `Polyline Polyline--type-${props.type}--is-${selectedChartIndex === props.chartIndex && selectedColumn1 === props.column ? "next-to-selected" : "selected"
        }`
      ].join(" ")}
      d={lineGenerator(props.data)}
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
        onMouseMove={!props.outOfFocus ? (e => handleMouseMove(e, props.data)) : null}
        onMouseLeave={!props.outOfFocus ? handleMouseLeave : null}
        onMouseDown={!props.outOfFocus ? (e => handleMouseDown(e, props.data)) : null}
      />
    </>
    }
  </React.Fragment>
}

export default Polyline
