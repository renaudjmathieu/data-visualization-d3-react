import React from "react"
import * as d3 from "d3"

import Chart from "./chart/Chart"
import { useChartDimensions } from "./chart/utils"

import Arcs from "./chart/Arcs"

const PieChart = ({ zoomed, active, outOfFocus, data, category, value, categoryParser, valueParser, categoryFormat, valueFormat, valueSummarization }) => {

  const [ref, dimensions] = useChartDimensions({
    marginTop: 20,
    marginRight: 20,
    marginBottom: 20,
    marginLeft: 20,
  })

  const categoryAccessor = d => d[category]
  const valueAccessor = d => d[value]

  const numberOfThresholds = 8
  const dataByCategory = Array.from(d3.group(data, categoryAccessor))
  const combinedDataByCategory = [
    ...dataByCategory.slice(0, numberOfThresholds),
    [
      "other",
      d3.merge(dataByCategory.slice(numberOfThresholds).map(d => d[1]))
    ]
  ]

  dataByCategory.forEach(categoryData => {
    switch (valueSummarization) {
      case "sum": categoryData[1][valueSummarization] = d3.sum(categoryData[1], valueAccessor); break;
      case "average": categoryData[1][valueSummarization] = d3.sum(d3.rollup(categoryData[1], v => d3.sum(v, valueAccessor), valueAccessor).values()) / categoryData[1].length; break;
      case "min": categoryData[1][valueSummarization] = d3.min(categoryData[1], valueAccessor); break;
      case "max": categoryData[1][valueSummarization] = d3.max(categoryData[1], valueAccessor); break;
      case "distinct": categoryData[1][valueSummarization] = d3.group(categoryData[1], valueAccessor).size; break;
      case "count": categoryData[1][valueSummarization] = categoryData[1].length; break;
      case "median": categoryData[1][valueSummarization] = d3.median(categoryData[1], valueAccessor); break;
      default: null;
    }
  })

  const valueSummarizationAccessor = ([key, values]) => values[valueSummarization]

  const arcGenerator = d3.pie()
    .padAngle(0.005)
    .value(valueSummarizationAccessor)

  const arcs = arcGenerator(combinedDataByCategory)

  const keyAccessor = (d, i) => i

  return (
    <div className={`Chart__square ${zoomed ? 'zoomed' : active ? 'active' : ''} ${outOfFocus ? 'outOfFocus' : 'inFocus'}`} ref={ref}>
      <Chart dimensions={dimensions}>
        <g transform={`translate(${dimensions.boundedWidth / 2}, ${dimensions.boundedHeight / 2})`}>
          <Arcs
            type="donut"
            data={arcs}
            keyAccessor={keyAccessor}
            value={valueSummarization}
            radius={dimensions.boundedWidth / 2}
          />
        </g>
      </Chart>
    </div>
  )
}

export default PieChart