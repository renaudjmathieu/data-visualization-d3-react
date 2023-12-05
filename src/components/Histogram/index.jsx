import React from "react"
import * as d3 from "d3"

import { useNewChartDimensions, Chart } from "../../providers/ChartDimensionsProvider"
import { callAccessor } from "../../utils"
import { useChartsContext } from "../../providers/ChartsProvider"
import { useDataContext } from "../../providers/DataProvider"

import Axis from "../Axis"

import "./style.css"

const Histogram = (props) => {

  const { selectedChartIndex, selectedColumnType, selectedColumn1, selectedItem1, selectedItem2 } = useDataContext()
  const { charts } = useChartsContext()
  const currentChart = charts[props.chartIndex]

  const [ref, dimensions] = useNewChartDimensions({
    marginBottom: 67 - (currentChart.xAxisType == 'number' ? 30 : 0) - props.marginPadding,
    marginLeft: 38 - props.marginPadding,
    marginRight: 10 - props.marginPadding,
    marginTop: 20 - props.marginPadding,
  })
  
  const numberOfThresholds = 9

  const CalculateXScale = (numberOfThresholds) => {
    switch (currentChart.xAxisType) {
      case "number":
        return d3.scaleLinear()
          .domain(d3.extent(props.data, currentChart.xAxisAccessor))
          .range([0, dimensions.boundedWidth])
          .nice(numberOfThresholds)
      default:
        return d3.scaleBand()
          .domain(Array.from(d3.group(props.data, currentChart.xAxisAccessor)).map(([key, values]) => key))
          .range([0, dimensions.boundedWidth])
          .padding(0.1)
    }
  }

  const calculateItems = (xScale, numberOfThresholds) => {
    switch (currentChart.xAxisType) {
      case "number":
        const binsGenerator = d3.bin()
          .domain(xScale.domain())
          .value(currentChart.xAxisAccessor)
          .thresholds(xScale.ticks(numberOfThresholds))

        return binsGenerator(props.data)
      default:
        return Array.from(d3.group(props.data, currentChart.xAxisAccessor))
    }
  }

  const calculateYAxisSummarization = (items) => {
    items.forEach(item => {
      const currentItem = currentChart.xAxisType === "number" ? item : item[1]
      switch (currentChart.yAxisSummarization) {
        case "sum":
          currentItem['-summarization-'] = d3.sum(currentItem, currentChart.yAxisAccessor);
          currentItem['-highlighted summarization-'] = d3.sum(_.filter(currentItem, ['highlighted', true]), currentChart.yAxisAccessor);
          break;
        case "average":
          currentItem['-summarization-'] = d3.sum(d3.rollup(currentItem, v => d3.sum(v, currentChart.yAxisAccessor), currentChart.yAxisAccessor).values()) / currentItem.length;
          currentItem['-highlighted summarization-'] = d3.sum(d3.rollup(_.filter(currentItem, ['highlighted', true]), v => d3.sum(v, currentChart.yAxisAccessor), currentChart.yAxisAccessor).values()) / _.filter(currentItem, ['highlighted', true]).length;
          break;
        case "min":
          currentItem['-summarization-'] = d3.min(currentItem, currentChart.yAxisAccessor);
          currentItem['-highlighted summarization-'] = d3.min(_.filter(currentItem, ['highlighted', true]), currentChart.yAxisAccessor);
          break;
        case "max":
          currentItem['-summarization-'] = d3.max(currentItem, currentChart.yAxisAccessor);
          currentItem['-highlighted summarization-'] = d3.max(_.filter(currentItem, ['highlighted', true]), currentChart.yAxisAccessor);
          break;
        case "distinct":
          currentItem['-summarization-'] = d3.group(currentItem, currentChart.yAxisAccessor).size;
          currentItem['-highlighted summarization-'] = d3.group(_.filter(currentItem, ['highlighted', true]), currentChart.yAxisAccessor).size;
          break;
        case "count":
          currentItem['-summarization-'] = currentItem.length;
          currentItem['-highlighted summarization-'] = _.filter(currentItem, ['highlighted', true]).length;
          break;
        case "median":
          currentItem['-summarization-'] = d3.median(currentItem, currentChart.yAxisAccessor);
          currentItem['-highlighted summarization-'] = d3.median(_.filter(currentItem, ['highlighted', true]), currentChart.yAxisAccessor);
          break;
        default: null;
      }
    })
    return items
  }

  const xScale = CalculateXScale(numberOfThresholds)
  const items = calculateYAxisSummarization(calculateItems(xScale, numberOfThresholds))

  let yAxisAccessorSummarizationFormatter = null
  switch (currentChart.yAxisSummarization) {
    case "sum": yAxisAccessorSummarizationFormatter = d3.format(",.0f"); break;
    case "average": yAxisAccessorSummarizationFormatter = d3.format(",.2f"); break;
    case "min": yAxisAccessorSummarizationFormatter = d3.format(",.0f"); break;
    case "max": yAxisAccessorSummarizationFormatter = d3.format(",.0f"); break;
    case "distinct": yAxisAccessorSummarizationFormatter = d3.format(",.0f"); break;
    case "count": yAxisAccessorSummarizationFormatter = d3.format(",.0f"); break;
    case "median": yAxisAccessorSummarizationFormatter = d3.format(",.0f"); break;
    default: yAxisAccessorSummarizationFormatter = d3.format(",");
  }

  const yAxisAccessorSummarization = (currentChart.xAxisType === "number") ? d => d['-summarization-'] : d => d[1]['-summarization-']
  const yAxisAccessorSummarizationMarked = (currentChart.xAxisType === "number") ? d => d['-highlighted summarization-'] : d => d[1]['-highlighted summarization-']

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(items, yAxisAccessorSummarization)])
    .range([dimensions.boundedHeight, 0])
    .nice()

  const barPadding = 2

  const xAxisAccessorScaled = currentChart.xAxisType === "number" ? d => xScale(d.x0) + barPadding : d => xScale(d[0])
  const yAxisAccessorScaled = d => yScale(yAxisAccessorSummarization(d))
  const yAxisAccessorScaledMarked = d => yScale(yAxisAccessorSummarizationMarked(d))
  const widthAccessorScaled = currentChart.xAxisType === "number" ? d => xScale(d.x1) - xScale(d.x0) - barPadding : d => xScale.bandwidth()
  const heightAccessorScaled = d => dimensions.boundedHeight - yScale(yAxisAccessorSummarization(d))
  const heightAccessorScaledMarked = d => dimensions.boundedHeight - yScale(yAxisAccessorSummarizationMarked(d))
  const keyAxisAccessor = (d, i) => i

  const yAxisSummarizationLabel = currentChart.yAxisSummarization === 'distinct' ? 'count' : currentChart.yAxisSummarization ? currentChart.yAxisSummarization : ''

  const xAxisTypeter = currentChart.xAxisType === 'date' ? d3.timeFormat("%B %d, %Y") : currentChart.xAxisType === 'time' ? d3.timeFormat("%H:%M") : d3.format(".2f")

  const isLastBin = (d, i) => {
    return i === items.length - 2
  }

  const handleMouseEnter = (e, d, i) => {
    const tooltipData = [
      {
        label: currentChart.xAxis.charAt(0).toUpperCase() + currentChart.xAxis.slice(1).replace(/([A-Z])/g, ' $1'),
        value: [
          xAxisTypeter(d.x0),
          xAxisTypeter(d.x1)
        ].join(" - "),
      },
      {
        label: yAxisSummarizationLabel.charAt(0).toUpperCase() + yAxisSummarizationLabel.slice(1).replace(/([A-Z])/g, ' $1') + " of " + currentChart.yAxis.charAt(0).toUpperCase() + currentChart.yAxis.slice(1).replace(/([A-Z])/g, ' $1'),
        value: yAxisAccessorSummarizationFormatter(yAxisAccessorSummarization(d)),
      }
    ]

    if (yAxisAccessorSummarizationFormatter(yAxisAccessorSummarization(d)) !== yAxisAccessorSummarizationFormatter(yAxisAccessorSummarizationMarked(d))) {
      tooltipData.push({
        label: 'Highlighted',
        value: yAxisAccessorSummarizationFormatter(yAxisAccessorSummarizationMarked(d)),
      })
    }

    props.handleShowTooltip(e, tooltipData,
      dimensions.offsetLeft + 16 + dimensions.marginLeft + callAccessor(xAxisAccessorScaled, d, i) + (callAccessor(widthAccessorScaled, d, i) / 2),
      dimensions.offsetTop + 8 + dimensions.marginTop + callAccessor(yAxisAccessorScaled, d, i)
    )
  }

  return (
    <div className={`Chart__rectangle ${props.styleName}`} ref={ref}>
      <Chart dimensions={dimensions}>
        <Axis
          dimensions={dimensions}
          dimension="x"
          scale={xScale}
          label={currentChart.xAxis.charAt(0).toUpperCase() + currentChart.xAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          format={currentChart.xAxisType}
          data={items}
          keyAxisAccessor={keyAxisAccessor}
          xAxisAccessor={xAxisAccessorScaled}
          widthAccessor={widthAccessorScaled}
        />
        <Axis
          dimensions={dimensions}
          dimension="y"
          scale={yScale}
          label={yAxisSummarizationLabel.charAt(0).toUpperCase() + yAxisSummarizationLabel.slice(1).replace(/([A-Z])/g, ' $1') + " of " + currentChart.yAxis.charAt(0).toUpperCase() + currentChart.yAxis.slice(1).replace(/([A-Z])/g, ' $1')}
        />
        {currentChart.xAxis && items.map((d, i) => (
          <rect
            className="Rectangles__rect Rectangles__marked"
            key={keyAxisAccessor(d, i)}
            x={callAccessor(xAxisAccessorScaled, d, i)}
            y={callAccessor(yAxisAccessorScaledMarked, d, i)}
            width={d3.max([callAccessor(widthAccessorScaled, d, i), 0])}
            height={d3.max([callAccessor(heightAccessorScaledMarked, d, i), 0])}
            onMouseEnter={props.interactable ? e => handleMouseEnter(e, d, i) : null}
            onMouseLeave={props.interactable ? props.handleHideTooltip : null}
            onMouseDown={props.interactable ? ((selectedColumnType === 'BinValues' || selectedColumnType === 'LastBinValues') && currentChart.xAxisType === 'number' && selectedColumn1 == currentChart.xAxis && selectedItem1 == d.x0 && selectedItem2 == d.x1) || (selectedColumnType == 'SingleValue' && currentChart.xAxisType !== 'number' && selectedColumn1 == currentChart.xAxis && selectedItem1 == d[0]) ? (e) => props.handleHighlightData(e, null, null, null, null, null, null) : currentChart.xAxisType === 'number' ? (e) => props.handleHighlightData(e, props.chartIndex, isLastBin(d, i) ? 'LastBinValues' : 'BinValues', currentChart.xAxis, null, d.x0, d.x1) : (e) => props.handleHighlightData(e, props.chartIndex, 'SingleValue', currentChart.xAxis, null, d[0], null) : null}
          />
        ))}
        {currentChart.xAxis && items.map((d, i) => (
          <rect
            className={
              ["Rectangles__rect Rectangles__unmarked",
                `Rectangles__rect--is-${selectedChartIndex == props.chartIndex && currentChart.xAxisType === 'number' && d.x0 == selectedItem1 && d.x1 == selectedItem2 ? "selected" :
                  selectedChartIndex == props.chartIndex && currentChart.xAxisType !== 'number' && d[0] == selectedItem1 ? "selected" :
                    selectedChartIndex == props.chartIndex && selectedItem1 ? "next-to-selected" : "not-selected"
                }`
              ].join(" ")}
            key={keyAxisAccessor(d, i)}
            x={callAccessor(xAxisAccessorScaled, d, i)}
            y={callAccessor(yAxisAccessorScaled, d, i)}
            width={d3.max([callAccessor(widthAccessorScaled, d, i), 0])}
            height={d3.max([callAccessor(heightAccessorScaled, d, i), 0])}
            onMouseEnter={props.interactable ? e => handleMouseEnter(e, d, i) : null}
            onMouseLeave={props.interactable ? props.handleHideTooltip : null}
            onMouseDown={props.interactable ? ((selectedColumnType === 'BinValues' || selectedColumnType === 'LastBinValues') && currentChart.xAxisType === 'number' && selectedColumn1 == currentChart.xAxis && selectedItem1 == d.x0 && selectedItem2 == d.x1) || (selectedColumnType == 'SingleValue' && currentChart.xAxisType !== 'number' && selectedColumn1 == currentChart.xAxis && selectedItem1 == d[0]) ? (e) => props.handleHighlightData(e, null, null, null, null, null, null) : currentChart.xAxisType === 'number' ? (e) => props.handleHighlightData(e, props.chartIndex, isLastBin(d, i) ? 'LastBinValues' : 'BinValues', currentChart.xAxis, null, d.x0, d.x1) : (e) => props.handleHighlightData(e, props.chartIndex, 'SingleValue', currentChart.xAxis, null, d[0], null) : null}
          />
        ))}
      </Chart>
    </div>
  )
}

export default Histogram
//theme.vars.palette.primary.main
