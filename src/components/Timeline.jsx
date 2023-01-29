import React from "react"
import * as d3 from "d3"

import Chart from "./chart/Chart"
import Polyline from "./chart/Polyline"
import Axis from "./chart/Axis"
import Gradient from "./chart/Gradient";
import Tooltipper from "./chart/Tooltipper";
import { useChartDimensions, useUniqueId } from "./chart/utils"
import { useTheme } from '@mui/material/styles';

const Timeline = ({ zoomed, active, outOfFocus, data, xAxis, yAxis, xAxisParser, yAxisParser, xAxisFormatter, yAxisFormatter }) => {
  
  const [ref, dimensions] = useChartDimensions()
  const theme = useTheme();
  const gradientColors = [theme.vars.palette.primary.light, theme.vars.palette.primary.contrastText]
  const gradientId = useUniqueId("Timeline-gradient")

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
        <defs>
          <Gradient
            id={gradientId}
            colors={gradientColors}
            x2="0"
            y2="100%"
          />
        </defs>
        <Axis
          dimension="x"
          scale={xScale}
          formatter={xAxisFormatter}
        />
        <Axis
          dimension="y"
          scale={yScale}
          label={yAxis.charAt(0).toUpperCase() + yAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          formatter={yAxisFormatter}
        />
        <Polyline
          type="area"
          data={data}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
          y0Accessor={y0AccessorScaled}
          style={outOfFocus ? {} : { fill: `url(#${gradientId})` }}
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
          a={xAxis.charAt(0).toUpperCase() + xAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          ab={yAxis.charAt(0).toUpperCase() + yAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          abc={xAccessor}
          abcd={yAccessor}
        //style={{ fill: `transparent` }}
        />}
      </Chart>
    </div>
  )
}

export default Timeline
