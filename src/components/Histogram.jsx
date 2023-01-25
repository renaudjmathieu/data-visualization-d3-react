import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"

import Chart from "./chart/Chart"
import Rectangles from "./chart/Rectangles"
import Axis from "./chart/Axis"
import Gradient from "./chart/Gradient"
import { useChartDimensions, accessorPropsType, useUniqueId } from "./chart/utils"
import { useTheme } from '@mui/material/styles';

const Histogram = ({ outOfFocus, active, onClick, data, xAxis, yAxis, xAxisParser, yAxisParser, xAxisFormatter, yAxisFormatter, yAxisSummarization }) => {

  const [ref, dimensions] = useChartDimensions({
    marginBottom: 77,
  })
  const theme = useTheme();
  const gradientColors = [theme.palette.primary.main, theme.palette.primary.contrastText]
  const gradientId = useUniqueId("Histogram-gradient")

  const numberOfThresholds = 9

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
    .nice(numberOfThresholds)

  const binsGenerator = d3.bin()
    .domain(xScale.domain())
    .value(xAccessor)
    .thresholds(xScale.ticks(numberOfThresholds))

  const bins = binsGenerator(data)

  bins.forEach(bin => {
    //for each bin, use d3.group on yAccessor and count, distinc count, sum, average mean and median of the grouped values then add to bin
    const grouped = d3.group(bin, yAccessor)
    bin.count = bin.length
    bin.distinct = grouped.size
    bin.sum = d3.sum(grouped, ([key, value]) => value.length)
    bin.average = d3.mean(grouped, ([key, value]) => value.length)
    bin.mean = d3.mean(grouped, ([key, value]) => value.length)
    bin.median = d3.median(grouped, ([key, value]) => value.length)

    //add the summarization to the bin
    bin[yAxisSummarization] = bin[yAxisSummarization] || bin.count

    //add the bin to the data
    bin.forEach(d => {
      d.bin = bin
    }
    )
  })

  console.log(yAxisSummarization)

  const yAccessorSummarization = d => d[yAxisSummarization]
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(bins, yAccessorSummarization)])
    .range([dimensions.boundedHeight, 0])
    .nice()

  const barPadding = 2

  const xAccessorScaled = d => xScale(d.x0) + barPadding
  const yAccessorScaled = d => yScale(yAccessorSummarization(d))
  const widthAccessorScaled = d => xScale(d.x1) - xScale(d.x0) - barPadding
  const heightAccessorScaled = d => dimensions.boundedHeight - yScale(yAccessorSummarization(d))
  const keyAccessor = (d, i) => i

  return (
    <div onClick={onClick} className={active ? "Chart__rectangle active" : outOfFocus ? "Chart__rectangle outOfFocus" : "Chart__rectangle"} ref={ref}>
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
          label="Count"
          formatter={yAxisFormatter}
        />
        {xAxis && <Rectangles
          data={bins}
          keyAccessor={keyAccessor}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
          widthAccessor={widthAccessorScaled}
          heightAccessor={heightAccessorScaled}
          style={outOfFocus ? {} : { fill: `url(#${gradientId})` }}
        />}
      </Chart>
    </div>
  )
}

Histogram.propTypes = {
  xAxis: PropTypes.string,
  yAxis: PropTypes.string,
  xAxisParser: PropTypes.func,
  yAxisParser: PropTypes.func,
  xAxisFormatter: PropTypes.func,
  yAxisFormatter: PropTypes.func,
  yAxisSummarization: PropTypes.string,
}

export default Histogram
