import React from "react"
import * as d3 from "d3"

import Chart from "./chart/Chart"
import Rectangles from "./chart/Rectangles"
import Axis from "./chart/Axis"
import { useChartDimensions } from "./chart/utils"

const Histogram = ({ zoomed, active, outOfFocus, data, handleHighlightData, xAxis, yAxis, xAccessor, yAccessor, xAxisParser, xAxisType, yAxisSummarization, chartIndex }) => {

  const [ref, dimensions] = useChartDimensions({
    marginBottom: 77,
  })

  const numberOfThresholds = 9

  const calculateXScale = (data, dataType, numberOfThresholds) => {
    switch (dataType) {
      case "number":
        return d3.scaleLinear()
          .domain(d3.extent(data, xAccessor))
          .range([0, dimensions.boundedWidth])
          .nice(numberOfThresholds)
      default:
        return d3.scaleBand()
          .domain(Array.from(d3.group(data, xAccessor)).map(([key, values]) => key))
          .range([0, dimensions.boundedWidth])
          .padding(0.1)
    }
  }

  const calculateItems = (data, dataType, xScale, numberOfThresholds) => {
    switch (dataType) {
      case "number":
        const binsGenerator = d3.bin()
          .domain(xScale.domain())
          .value(xAccessor)
          .thresholds(xScale.ticks(numberOfThresholds))

        return binsGenerator(data)
      default:
        return Array.from(d3.group(data, xAccessor))
    }
  }

  const calculateYAxisSummarization = (items, dataType, summarization) => {
    items.forEach(item => {
      const currentItem = dataType === "number" ? item : item[1]
      switch (yAxisSummarization) {
        case "sum":
          currentItem[yAxisSummarization] = d3.sum(currentItem, yAccessor);
          currentItem[`highlighted ${yAxisSummarization}`] = d3.sum(_.filter(currentItem, ['highlighted', true]), yAccessor);
          break;
        case "average":
          currentItem[yAxisSummarization] = d3.sum(d3.rollup(currentItem, v => d3.sum(v, yAccessor), yAccessor).values()) / currentItem.length;
          currentItem[`highlighted ${yAxisSummarization}`] = d3.sum(d3.rollup(_.filter(currentItem, ['highlighted', true]), v => d3.sum(v, yAccessor), yAccessor).values()) / _.filter(currentItem, ['highlighted', true]).length;
          break;
        case "min":
          currentItem[yAxisSummarization] = d3.min(currentItem, yAccessor);
          currentItem[`highlighted ${yAxisSummarization}`] = d3.min(_.filter(currentItem, ['highlighted', true]), yAccessor);
          break;
        case "max":
          currentItem[yAxisSummarization] = d3.max(currentItem, yAccessor);
          currentItem[`highlighted ${yAxisSummarization}`] = d3.max(_.filter(currentItem, ['highlighted', true]), yAccessor);
          break;
        case "distinct":
          currentItem[yAxisSummarization] = d3.group(currentItem, yAccessor).size;
          currentItem[`highlighted ${yAxisSummarization}`] = d3.group(_.filter(currentItem, ['highlighted', true]), yAccessor).size;
          break;
        case "count":
          currentItem[yAxisSummarization] = currentItem.length;
          currentItem[`highlighted ${yAxisSummarization}`] = _.filter(currentItem, ['highlighted', true]).length;
          break;
        case "median":
          currentItem[yAxisSummarization] = d3.median(currentItem, yAccessor);
          currentItem[`highlighted ${yAxisSummarization}`] = d3.median(_.filter(currentItem, ['highlighted', true]), yAccessor);
          break;
        default: null;
      }
    })
    return items
  }

  const xScale = calculateXScale(data, xAxisType, numberOfThresholds)
  const items = calculateYAxisSummarization(calculateItems(data, xAxisType, xScale, numberOfThresholds), xAxisType, yAxisSummarization)

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

  const yAccessorSummarization = (xAxisType === "number") ? d => d[yAxisSummarization] : d => d[1][yAxisSummarization]
  const yAccessorSummarizationMarked = (xAxisType === "number") ? d => d[`highlighted ${yAxisSummarization}`] : d => d[1][`highlighted ${yAxisSummarization}`]

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(items, yAccessorSummarization)])
    .range([dimensions.boundedHeight, 0])
    .nice()

  const barPadding = 2

  const xAccessorScaled = xAxisType === "number" ? d => xScale(d.x0) + barPadding : d => xScale(d[0])
  const yAccessorScaled = d => yScale(yAccessorSummarization(d))
  const yAccessorScaledMarked = d => yScale(yAccessorSummarizationMarked(d))
  const widthAccessorScaled = xAxisType === "number" ? d => xScale(d.x1) - xScale(d.x0) - barPadding : d => xScale.bandwidth()
  const heightAccessorScaled = d => dimensions.boundedHeight - yScale(yAccessorSummarization(d))
  const heightAccessorScaledMarked = d => dimensions.boundedHeight - yScale(yAccessorSummarizationMarked(d))
  const keyAccessor = (d, i) => i

  const yAxisSummarizationLabel = yAxisSummarization === 'distinct' ? 'count' : yAxisSummarization

  return (
    <div className={`Chart__rectangle ${zoomed ? 'zoomed' : active ? 'active' : ''} ${outOfFocus ? 'outOfFocus' : 'inFocus'}`} ref={ref}>
      <Chart dimensions={dimensions}>
        <Axis
          dimensions={dimensions}
          dimension="x"
          scale={xScale}
          label={xAxis.charAt(0).toUpperCase() + xAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          format={xAxisType}
          data={items}
          keyAccessor={keyAccessor}
          xAccessor={xAccessorScaled}
          widthAccessor={widthAccessorScaled}
        />
        <Axis
          dimensions={dimensions}
          dimension="y"
          scale={yScale}
          label={yAxisSummarizationLabel.charAt(0).toUpperCase() + yAxisSummarizationLabel.slice(1).replace(/([A-Z])/g, ' $1') + " of " + yAxis.charAt(0).toUpperCase() + yAxis.slice(1).replace(/([A-Z])/g, ' $1')}
        />
        {xAxis && <Rectangles
          zoomed={zoomed}
          active={active}
          data={items}
          dimensions={dimensions}
          keyAccessor={keyAccessor}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaledMarked}
          widthAccessor={widthAccessorScaled}
          heightAccessor={heightAccessorScaledMarked}
          tooltipValue1Title={xAxis.charAt(0).toUpperCase() + xAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          xAxisType={xAxisType}
          tooltipValue2Title={yAxisSummarizationLabel.charAt(0).toUpperCase() + yAxisSummarizationLabel.slice(1).replace(/([A-Z])/g, ' $1') + " of " + yAxis.charAt(0).toUpperCase() + yAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          tooltipValue2Value={yAccessorSummarization}
          tooltipValue2ValueFormat={yAccessorSummarizationFormatter}
          tooltipValue3Value={null}
          outOfFocus={outOfFocus}
          handleHighlightData={handleHighlightData}
          column={xAxis}
          chartIndex={chartIndex}
          color={'red'}
        />}
        {xAxis && <Rectangles
          zoomed={zoomed}
          active={active}
          data={items}
          dimensions={dimensions}
          keyAccessor={keyAccessor}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
          widthAccessor={widthAccessorScaled}
          heightAccessor={heightAccessorScaled}
          tooltipValue1Title={xAxis.charAt(0).toUpperCase() + xAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          xAxisType={xAxisType}
          tooltipValue2Title={yAxisSummarizationLabel.charAt(0).toUpperCase() + yAxisSummarizationLabel.slice(1).replace(/([A-Z])/g, ' $1') + " of " + yAxis.charAt(0).toUpperCase() + yAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          tooltipValue2Value={yAccessorSummarization}
          tooltipValue2ValueFormat={yAccessorSummarizationFormatter}
          tooltipValue3Value={yAccessorSummarizationMarked}
          outOfFocus={outOfFocus}
          handleHighlightData={handleHighlightData}
          column={xAxis}
          chartIndex={chartIndex}
        />}
      </Chart>
    </div>
  )
}

export default Histogram
//theme.vars.palette.primary.main
