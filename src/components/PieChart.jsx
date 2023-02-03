import React from "react"
import * as d3 from "d3"

import Chart from "./chart/Chart"
import { useChartDimensions, useUniqueId } from "./chart/utils"

import { useTheme } from '@mui/material/styles';
import Gradient from "./chart/Gradient"
import Arcs from "./chart/Arcs"

const PieChart = ({ zoomed, active, outOfFocus, data, category, value, categoryParser, valueParser, categoryFormat, valueFormat, valueSummarization }) => {

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

  let categoryAccessor = d => d[category]

  const dataByCategory = Array.from(d3.group(data, categoryAccessor))
    .sort((a, b) => b[1].length - a[1].length)
  const combinedDataByCategory = [
    ...dataByCategory.slice(0, numberOfThresholds),
    [
      "other",
      d3.merge(dataByCategory.slice(numberOfThresholds).map(d => d[1]))
    ]
  ]

  const barPadding = 2
  const keyAccessor = (d, i) => i

  const arcGenerator = d3.pie()
    .padAngle(0.005)
    .value(([key, values]) => values.length)

  const arcs = arcGenerator(combinedDataByCategory)

  const interpolateWithSteps = numberOfSteps => new Array(numberOfSteps).fill(null).map((d, i) => i / (numberOfSteps - 1))
  const colorScale = d3.scaleOrdinal()
    .domain(arcs.sort((a, b) => a.data[1].length - b.data[1].length).map(d => d.data[0]))
    .range(interpolateWithSteps(dataByCategory.length).map(d3.interpolateLab("#f3a683", "#3dc1d3")))

  return (
    <div className={`Chart__square ${zoomed ? 'zoomed' : active ? 'active' : ''} ${outOfFocus ? 'outOfFocus' : 'inFocus'}`} ref={ref}>
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

export default PieChart