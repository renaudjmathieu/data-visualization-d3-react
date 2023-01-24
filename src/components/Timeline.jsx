import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"

import Chart from "./chart/Chart"
import Polyline from "./chart/Polyline"
import Axis from "./chart/Axis"
import Gradient from "./chart/Gradient";
import { useChartDimensions, accessorPropsType, useUniqueId } from "./chart/utils"
import { useTheme } from '@mui/material/styles';

const Timeline = ({ outOfFocus, active, onClick,data, xAccessor, yAccessor, xLabel, yLabel, xFormat, yFormat }) => {
  const [ref, dimensions] = useChartDimensions()
  const theme = useTheme();
  const gradientColors = [theme.palette.primary.light, theme.palette.primary.contrastText]
  const gradientId = useUniqueId("Timeline-gradient")

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
    <div onClick={onClick} className={active ? "Chart__rectangle__large active" : outOfFocus ? "Chart__rectangle__large outOfFocus" : "Chart__rectangle__large"} ref={ref}>
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
          formatTick={xFormat}
        />
        <Axis
          dimension="y"
          scale={yScale}
          label={yLabel}
          formatTick={yFormat}
        />
        <Polyline
          type="area"
          data={data}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
          y0Accessor={y0AccessorScaled}
          style={outOfFocus ? {} : {fill: `url(#${gradientId})`}}
        />
        <Polyline
          data={data}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
        />
      </Chart>
    </div>
  )
}

Timeline.propTypes = {
    xAccessor: accessorPropsType,
    yAccessor: accessorPropsType,
    xLabel: PropTypes.string,
    yLabel: PropTypes.string,
    xFormat: PropTypes.func,
    yFormat: PropTypes.func,
}

Timeline.defaultProps = {
    xAccessor: d => d.x,
    yAccessor: d => d.y,
}
export default Timeline
