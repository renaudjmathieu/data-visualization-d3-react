import React from "react"
import * as d3 from "d3"

import Chart from "./chart/Chart"
import { useChartDimensions } from "./chart/utils"
import { useChartsContext } from "../providers/ChartsProvider"

import Circles from "./chart/Circles"
import Voronoi from "./chart/Voronoi"
import Axis from "./chart/Axis"

const ScatterPlot = (props) => {

  const [ref, dimensions] = useChartDimensions({
    marginBottom: 77
  })
  const { charts } = useChartsContext()
  const currentChart = charts[props.chartIndex]

  const xScale = d3.scaleLinear()
    .domain(d3.extent(props.data, currentChart.xAxisAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()

  const yScale = d3.scaleLinear()
    .domain(d3.extent(props.data, currentChart.yAxisAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()

  const xAxisAccessorScaled = d => xScale(currentChart.xAxisAccessor(d))
  const yAxisAccessorScaled = d => yScale(currentChart.yAxisAccessor(d))
  const keyAxisAccessor = (d, i) => i

  return (
    <div className={`Chart__square ${props.zoomed ? 'zoomed' : props.active ? 'active' : ''} ${props.outOfFocus ? 'outOfFocus' : 'inFocus'}`} ref={ref}>
      <Chart dimensions={dimensions}>
        <Axis
          dimension="x"
          scale={xScale}
          label={currentChart.xAxis.charAt(0).toUpperCase() + currentChart.xAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          format={currentChart.xAxisType}
        />
        <Axis
          dimension="y"
          scale={yScale}
          label={currentChart.yAxis.charAt(0).toUpperCase() + currentChart.yAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          format={currentChart.yAxisType}
        />
        {!props.outOfFocus && <Voronoi
          outOfFocus={props.outOfFocus}
          zoomed={props.zoomed}
          data={props.data}
          xAxisAccessor={xAxisAccessorScaled}
          yAxisAccessor={yAxisAccessorScaled}
          tooltipValue1Title={currentChart.xAxis.charAt(0).toUpperCase() + currentChart.xAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          tooltipValue2Title={currentChart.yAxis.charAt(0).toUpperCase() + currentChart.yAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          tooltipValue1Value={currentChart.xAxisAccessor}
          tooltipValue2Value={currentChart.yAxisAccessor}
          tooltipValue1ValueFormat={currentChart.xAxisType}
          tooltipValue2ValueFormat={currentChart.yAxisType}
        />}
        <Circles
          outOfFocus={props.outOfFocus}
          zoomed={props.zoomed}
          data={props.data}
          keyAxisAccessor={keyAxisAccessor}
          xAxisAccessor={xAxisAccessorScaled}
          yAxisAccessor={yAxisAccessorScaled}
          chartIndex={props.chartIndex}
        />
      </Chart>
    </div>
  )
}

export default ScatterPlot
