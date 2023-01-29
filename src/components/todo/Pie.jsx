import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"

import Chart from "./chart/Chart"
import Arcs from "./chart/Arcs"
import Gradient from "./chart/Gradient"
import { useChartDimensions, accessorPropsType, useUniqueId } from "./chart/utils"
import { useTheme } from '@mui/material/styles';

const Pie = ({ outOfFocus, active, onClick, data, valueAccessor, entityAccessor, entityFormat }) => {
  const [ref, dimensions] = useChartDimensions({
    marginTop: 20,
    marginRight: 20,
    marginBottom: 20,
    marginLeft: 20,
  })
  const theme = useTheme();
  const gradientColors = [theme.vars.palette.primary.main, theme.vars.palette.primary.contrastText]
  const gradientId = useUniqueId("Histogram-gradient")

  const numberOfThresholds = 4

  const dataByEntity = Array.from(d3.group(data, entityAccessor))
    .sort((a, b) => b[1].length - a[1].length)
  const combinedDataByEntity = [
    ...dataByEntity.slice(0, numberOfThresholds),
    [
      "other",
      d3.merge(dataByEntity.slice(numberOfThresholds).map(d => d[1]))
    ]
  ]

  const barPadding = 2
  const keyAccessor = (d, i) => i

  const arcGenerator = d3.pie()
    .padAngle(0.005)
    .value(([key, values]) => values.length)

  const arcs = arcGenerator(combinedDataByEntity)

  const interpolateWithSteps = numberOfSteps => new Array(numberOfSteps).fill(null).map((d, i) => i / (numberOfSteps - 1))
  const colorScale = d3.scaleOrdinal()
    .domain(arcs.sort((a, b) => a.data[1].length - b.data[1].length).map(d => d.data[0]))
    .range(interpolateWithSteps(dataByEntity.length).map(d3.interpolateLab("#f3a683", "#3dc1d3")))

  return (
    <div onClick={onClick} className={active ? "Chart__square inFocus active" : outOfFocus ? "Chart__square outOfFocus" : "Chart__square inFocus"} ref={ref}>
      <Chart dimensions={dimensions}>
        <g transform={`translate(${dimensions.boundedWidth / 2}, ${dimensions.boundedHeight / 2})`}>
          <defs>
            <Gradient
              id={gradientId}
              colors={gradientColors}
            />
          </defs>
          <Arcs
            type="donut"
            data={arcs}
            keyAccessor={keyAccessor}
            radius={dimensions.boundedWidth / 2}
            style={outOfFocus ? {} : {fill: `url(#${gradientId})`}}
          />
        </g>
      </Chart>
    </div>
  )
}

Pie.propTypes = {
  xAccessor: accessorPropsType,
  xLabel: PropTypes.string,
}

Pie.defaultProps = {
  xAccessor: d => d.x,
}
export default Pie
