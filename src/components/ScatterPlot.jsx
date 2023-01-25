import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"

import Chart from "./chart/Chart"
import Circles from "./chart/Circles"
import Axis from "./chart/Axis"
import { useChartDimensions, accessorPropsType } from "./chart/utils"

const ScatterPlot = ({ outOfFocus, active, onClick, data, xAxis, yAxis, xAxisParser, yAxisParser, xAxisFormatter, yAxisFormatter }) => {
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
    <div onClick={onClick} className={active ? "Chart__square active" : outOfFocus ? "Chart__square outOfFocus" : "Chart__square"} ref={ref}>
      <Chart dimensions={dimensions}>
        <Axis
          dimensions={dimensions}
          dimension="x"
          scale={xScale}
          label={xAxis}
          formatter={xAxisFormatter}
        />
        <Axis
          dimensions={dimensions}
          dimension="y"
          scale={yScale}
          label={yAxis}
          formatter={yAxisFormatter}
        />
        <Circles
          data={data}
          keyAccessor={keyAccessor}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
        />
      </Chart>
    </div>
  )
}

ScatterPlot.propTypes = {
  xAxis: PropTypes.string,
  yAxis: PropTypes.string,
  xAxisParser: PropTypes.func,
  yAxisParser: PropTypes.func,
  xAxisFormatter: PropTypes.func,
  yAxisFormatter: PropTypes.func,
}

export default ScatterPlot
