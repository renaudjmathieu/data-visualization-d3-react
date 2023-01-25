import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"

import Chart from "./chart/Chart"
import Rectangles from "./chart/Rectangles"
import Axis from "./chart/Axis"
import Gradient from "./chart/Gradient"
import { useChartDimensions, accessorPropsType, useUniqueId } from "./chart/utils"
import { useTheme } from '@mui/material/styles';

const Histogram = ({ outOfFocus, active, onClick, data, xAccessor, yAccessor, yAxisSummarization, xLabel, yLabel, xFormat, yFormat }) => {

  const [ref, dimensions] = useChartDimensions({
    marginBottom: 77,
  })
  const theme = useTheme();
  const gradientColors = [theme.palette.primary.main, theme.palette.primary.contrastText]
  const gradientId = useUniqueId("Histogram-gradient")

  const numberOfThresholds = 9

  if (!xAccessor)
    xAccessor = d => d[xLabel]

  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice(numberOfThresholds)

  const binsGenerator = d3.bin()
    .domain(xScale.domain())
    .value(xAccessor)
    .thresholds(xScale.ticks(numberOfThresholds))

  const bins = binsGenerator(data)

  console.log(yLabel)
  console.log(yAxisSummarization)

  //add aggregate data to bins
  bins.forEach(bin => {
    bin.median = d3.median(bin, b => b[yLabel])
    bin.mean = d3.mean(bin, b => b[yLabel])
    bin.count = d3.count(bin, b => b[yLabel])
    bin.sum = d3.sum(bin, b => b[yLabel])
    bin.min = d3.min(bin, b => b[yLabel])
    bin.max = d3.max(bin, b => b[yLabel])
  })


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
          label={xLabel}
          labelFormat={xFormat}
        />
        <Axis
          dimensions={dimensions}
          dimension="y"
          scale={yScale}
          label="Count"
        />
        {xLabel && <Rectangles
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
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  yAxisSummarization: PropTypes.string,
  xFormat: PropTypes.func,
  yFormat: PropTypes.func,
}

Histogram.defaultProps = {
  xFormat: ",",
  yFormat: ",",
}
export default Histogram
