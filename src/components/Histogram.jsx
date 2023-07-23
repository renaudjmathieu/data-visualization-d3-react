import React from "react"
import * as d3 from "d3"

import Chart from "./chart/Chart"
import Rectangles from "./chart/Rectangles"
import Axis from "./chart/Axis"
import { useChartDimensions } from "./chart/utils"

const Histogram = ({ zoomed, active, outOfFocus, data, xAxis, yAxis, xAxisParser, xAxisFormat, yAxisSummarization }) => {

  const [ref, dimensions] = useChartDimensions({
    marginBottom: 77,
  })

  const numberOfThresholds = 9

  const xAccessor = d => d[xAxis]
  const yAccessor = d => d[yAxis]

  if (xAxisParser) {
    xAccessor = d => xAxisParser(d[xAxis])
  }



  //get data type of x axis
  const xDataType = typeof xAccessor(data[0])

  let items = null
  let xScale = null

  //if x axis can be bin, then bin it
  if (xDataType === "number") {
    xScale = d3.scaleLinear()
      .domain(d3.extent(data, xAccessor))
      .range([0, dimensions.boundedWidth])
      .nice(numberOfThresholds)

    const binsGenerator = d3.bin()
      .domain(xScale.domain())
      .value(xAccessor)
      .thresholds(xScale.ticks(numberOfThresholds))

    items = binsGenerator(data)

    items.forEach(bin => {
      switch (yAxisSummarization) {
        case "sum": bin[yAxisSummarization] = d3.sum(bin, yAccessor); break;
        case "average": bin[yAxisSummarization] = d3.sum(d3.rollup(bin, v => d3.sum(v, yAccessor), yAccessor).values()) / bin.length; break;
        case "min": bin[yAxisSummarization] = d3.min(bin, yAccessor); break;
        case "max": bin[yAxisSummarization] = d3.max(bin, yAccessor); break;
        case "distinct": bin[yAxisSummarization] = d3.group(bin, yAccessor).size; break;
        case "count": bin[yAxisSummarization] = bin.length; break;
        case "median": bin[yAxisSummarization] = d3.median(bin, yAccessor); break;
        default: null;
      }
    })
  }
  else if (xDataType === "string") {
    items = Array.from(d3.group(data, xAccessor))

    xScale = d3.scaleBand()
      .domain(items.map(([key, values]) => key))
      .range([0, dimensions.boundedWidth])
      .padding(0.1)

    items.forEach(categoryData => {
      switch (yAxisSummarization) {
        case "sum": categoryData[1][yAxisSummarization] = d3.sum(categoryData[1], yAccessor); break;
        case "average": categoryData[1][yAxisSummarization] = d3.sum(d3.rollup(categoryData[1], v => d3.sum(v, yAccessor), yAccessor).values()) / categoryData[1].length; break;
        case "min": categoryData[1][yAxisSummarization] = d3.min(categoryData[1], yAccessor); break;
        case "max": categoryData[1][yAxisSummarization] = d3.max(categoryData[1], yAccessor); break;
        case "distinct": categoryData[1][yAxisSummarization] = d3.group(categoryData[1], yAccessor).size; break;
        case "count": categoryData[1][yAxisSummarization] = categoryData[1].length; break;
        case "median": categoryData[1][yAxisSummarization] = d3.median(categoryData[1], yAccessor); break;
        default: null;
      }
    })
  }

  let yAccessorSummarizationFormatter = null
  switch (yAxisSummarization) {
    case "sum": yAccessorSummarizationFormatter = d3.format(",.0f"); break;
    case "average": yAccessorSummarizationFormatter = d3.format(",.2f"); break;
    case "min": yAccessorSummarizationFormatter = d3.format(",.0f"); break;
    case "max": yAccessorSummarizationFormatter = d3.format(",.0f"); break;
    case "distinct": yAccessorSummarizationFormatter = d3.format(",.0f"); break;
    case "count": yAccessorSummarizationFormatter = d3.format(",.0f"); break;
    case "median": yAccessorSummarizationFormatter = d3.format(",.0f"); break;
    default: yAccessorSummarizationFormatter = d3.format(",");
  }

  const yAccessorSummarization = (xDataType === "number") ? d => d[yAxisSummarization] : d => d[1][yAxisSummarization]

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(items, yAccessorSummarization)])
    .range([dimensions.boundedHeight, 0])
    .nice()

  const barPadding = 2

  const xAccessorScaled = d => xScale(d.x0) + barPadding
  const yAccessorScaled = d => yScale(yAccessorSummarization(d))
  const widthAccessorScaled = d => xScale(d.x1) - xScale(d.x0) - barPadding
  const heightAccessorScaled = d => dimensions.boundedHeight - yScale(yAccessorSummarization(d))
  const keyAccessor = (d, i) => i

  const yAxisSummarizationLabel = yAxisSummarization === 'distinct' ? 'count' : yAxisSummarization

  return (
    <div className={`Chart__rectangle ${zoomed ? 'zoomed' : active ? 'active' : ''} ${outOfFocus ? 'outOfFocus' : 'inFocus'}`} ref={ref}>
      <Chart dimensions={dimensions}>
        {xAxis && <Rectangles
          scale={xDataType === "string" ? xScale : null}
          zoomed={zoomed}
          data={items}
          dimensions={dimensions}
          keyAccessor={keyAccessor}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
          widthAccessor={widthAccessorScaled}
          heightAccessor={heightAccessorScaled}
          tooltipValue1Title={xAxis.charAt(0).toUpperCase() + xAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          tooltipValue1ValueFormat={xAxisFormat}
          tooltipValue2Title={yAxisSummarizationLabel.charAt(0).toUpperCase() + yAxisSummarizationLabel.slice(1).replace(/([A-Z])/g, ' $1') + " of " + yAxis.charAt(0).toUpperCase() + yAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          tooltipValue2Value={yAccessorSummarization}
          tooltipValue2ValueFormat={yAccessorSummarizationFormatter}
          outOfFocus={outOfFocus}
        />}
      </Chart>
    </div>
  )
}

export default Histogram
//theme.vars.palette.primary.main
