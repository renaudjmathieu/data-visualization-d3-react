import React from "react"
import * as d3 from "d3"

import Chart from "./chart/Chart"
import Polyline from "./chart/Polyline"
import Axis from "./chart/Axis"
import Tooltipper from "./chart/Tooltipper";
import { useChartDimensions } from "./chart/utils"

const Timeline = ({ zoomed, active, outOfFocus, data, xAxis, yAxis, xAxisFormat, xAxisParser, yAxisParser, xAxisType, yAxisType, selectedChart, onMouseDown, chartIndex, selectedColumnType, selectedColumn1, selectedColumn2, selectedItem1, selectedItem2 }) => {

  const [ref, dimensions] = useChartDimensions()

  let xAccessor = d => d[xAxis]
  let yAccessor = d => d[yAxis]

  if (xAxisParser) {
    xAccessor = d => xAxisParser(d[xAxis])
  }

  if (yAxisParser) {
    yAccessor = d => yAxisParser(d[yAxis])
  }

  const xScale = d3.scaleTime()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.boundedWidth])

  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()

  const xAccessorScaled = d => xScale(xAccessor(d))
  const yAccessorScaled = d => yScale(yAccessor(d))
  const y0AccessorScaled = yScale(yScale.domain()[0])

  return (
    <div className={`Chart__rectangle__large ${zoomed ? 'zoomed' : active ? 'active' : ''} ${outOfFocus ? 'outOfFocus' : 'inFocus'}`} ref={ref}>
      <Chart dimensions={dimensions}>
        <Axis
          dimension="x"
          scale={xScale}
          format={xAxisType}
        />
        <Axis
          dimension="y"
          scale={yScale}
          label={yAxis.charAt(0).toUpperCase() + yAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          format={yAxisType}
        />
        <Polyline
          type="area"
          data={data}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
          y0Accessor={y0AccessorScaled}
        />
        <Polyline
          data={data}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
        />
        {!outOfFocus && <Tooltipper
          zoomed={zoomed}
          data={data}
          dimensions={dimensions}
          xAccessor={xAccessor}
          yAccessor={yAccessor}
          xScale={xScale}
          yScale={yScale}
          tooltipValue1Title={xAxis.charAt(0).toUpperCase() + xAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          tooltipValue2Title={yAxis.charAt(0).toUpperCase() + yAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          tooltipValue1Value={xAccessor}
          tooltipValue2Value={yAccessor}
          tooltipValue1ValueFormat={xAxisType}
          tooltipValue2ValueFormat={yAxisType}

          onMouseDown={onMouseDown}
          column={xAxis}
          selectedChart={selectedChart}
          chartIndex={chartIndex}
          selectedColumnType={selectedColumnType}
          selectedColumn1={selectedColumn1}
          selectedColumn2={selectedColumn2}
          selectedItem1={selectedItem1}
          selectedItem2={selectedItem2}
          
          xAxisFormat={xAxisFormat}
        />}
      </Chart>
    </div>
  )
}

export default Timeline
