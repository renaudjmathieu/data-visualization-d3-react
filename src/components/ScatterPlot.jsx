import React from "react"
import * as d3 from "d3"

import Chart from "./chart/Chart"
import { useChartDimensions } from "./chart/utils"

import Circles from "./chart/Circles"
import Voronoi from "./chart/Voronoi"
import Axis from "./chart/Axis"

const ScatterPlot = ({ zoomed, active, outOfFocus, data, xAxis, yAxis, xAxisParser, yAxisParser, xAxisType, yAxisType, handleHighlightData, chartIndex }) => {

  const [ref, dimensions] = useChartDimensions({
    marginBottom: 77
  })

  let xAccessor = d => d[xAxis]
  let yAccessor = d => d[yAxis]

  if (xAxisParser) {
    xAccessor = d => xAxisParser(d[xAxis])
  }

  if (yAxisParser) {
    yAccessor = d => yAxisParser(d[yAxis])
  }

  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()

  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()

  const xAccessorScaled = d => xScale(xAccessor(d))
  const yAccessorScaled = d => yScale(yAccessor(d))
  const keyAccessor = (d, i) => i

  return (
    <div className={`Chart__square ${zoomed ? 'zoomed' : active ? 'active' : ''} ${outOfFocus ? 'outOfFocus' : 'inFocus'}`} ref={ref}>
      <Chart dimensions={dimensions}>
        <Axis
          dimensions={dimensions}
          dimension="x"
          scale={xScale}
          label={xAxis.charAt(0).toUpperCase() + xAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          format={xAxisType}
        />
        <Axis
          dimensions={dimensions}
          dimension="y"
          scale={yScale}
          label={yAxis.charAt(0).toUpperCase() + yAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          format={yAxisType}
        />
        {!outOfFocus && <Voronoi
          outOfFocus={outOfFocus}
          zoomed={zoomed}
          data={data}
          dimensions={dimensions}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
          tooltipValue1Title={xAxis.charAt(0).toUpperCase() + xAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          tooltipValue2Title={yAxis.charAt(0).toUpperCase() + yAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          tooltipValue1Value={xAccessor}
          tooltipValue2Value={yAccessor}
          tooltipValue1ValueFormat={xAxisType}
          tooltipValue2ValueFormat={yAxisType}
        />}
        <Circles
          outOfFocus={outOfFocus}
          zoomed={zoomed}
          data={data}
          dimensions={dimensions}
          keyAccessor={keyAccessor}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
          tooltipValue1Title={xAxis.charAt(0).toUpperCase() + xAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          tooltipValue2Title={yAxis.charAt(0).toUpperCase() + yAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          tooltipValue1Value={xAccessor}
          tooltipValue2Value={yAccessor}
          tooltipValue1ValueFormat={xAxisType}
          tooltipValue2ValueFormat={yAxisType}
          xValue={xAccessor}
          yValue={yAccessor}
          handleHighlightData={handleHighlightData}
          xAxis={xAxis}
          yAxis={yAxis}
          chartIndex={chartIndex}
        />
      </Chart>
    </div>
  )
}

export default ScatterPlot
