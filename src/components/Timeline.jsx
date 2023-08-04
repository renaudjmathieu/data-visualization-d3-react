import React from "react"
import * as d3 from "d3"

import Chart from "./chart/Chart"
import { useChartDimensions } from "./chart/utils"
import { useChartsContext } from "../providers/ChartsProvider"

import Axis from "./chart/Axis"
import Polyline from "./chart/Polyline";

const Timeline = (props) => {

  const [ref, dimensions] = useChartDimensions()
  const { charts } = useChartsContext()
  const currentChart = charts[props.chartIndex]

  const xScale = d3.scaleTime()
    .domain(d3.extent(props.data, currentChart.xAxisAccessor))
    .range([0, dimensions.boundedWidth])

  const yScale = d3.scaleLinear()
    .domain(d3.extent(props.data, currentChart.yAxisAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()

  const xAxisAccessorScaled = d => xScale(currentChart.xAxisAccessor(d))
  const yAxisAccessorScaled = d => yScale(currentChart.yAxisAccessor(d))
  const y0AccessorScaled = yScale(yScale.domain()[0])

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
        <Polyline
          outOfFocus={props.outOfFocus}
          type="area"
          data={props.data}
          xAxisAccessorScaled={xAxisAccessorScaled}
          yAxisAccessorScaled={yAxisAccessorScaled}
          y0AccessorScaled={y0AccessorScaled}
          chartIndex={props.chartIndex}
          column={currentChart.xAxis}
        />
        <Polyline
          outOfFocus={props.outOfFocus}
          type={props.data.length === 1 ? "circle" : "line"}
          data={props.data}
          xAxisAccessorScaled={xAxisAccessorScaled}
          yAxisAccessorScaled={yAxisAccessorScaled}
          y0AccessorScaled={null}
          chartIndex={props.chartIndex}
          column={currentChart.xAxis}

          dimensions={dimensions}
          zoomed={props.zoomed}
          xScale={xScale}
          yScale={yScale}
          tooltipValue1Title={currentChart.xAxis.charAt(0).toUpperCase() + currentChart.xAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          tooltipValue2Title={currentChart.yAxis.charAt(0).toUpperCase() + currentChart.yAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          xAxisAccessor={currentChart.xAxisAccessor}
          yAxisAccessor={currentChart.yAxisAccessor}
          tooltipValue1ValueFormat={currentChart.xAxisType}
          tooltipValue2ValueFormat={currentChart.yAxisType}
          handleHighlightData={props.handleHighlightData}
          xAxisFormat={currentChart.xAxisFormat}
        />
      </Chart>
    </div>
  )
}

export default Timeline
