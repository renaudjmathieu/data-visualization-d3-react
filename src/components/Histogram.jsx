import React from "react"
import * as d3 from "d3"

import Chart from "./chart/Chart"
import Rectangles from "./chart/Rectangles"
import Axis from "./chart/Axis"
import Gradient from "./chart/Gradient"
import { useChartDimensions, useUniqueId } from "./chart/utils"
import { useTheme } from '@mui/material/styles';

const Histogram = ({ zoomed, active, outOfFocus, data, xAxis, yAxis, xAxisParser, xAxisFormat, yAxisSummarization }) => {

  const [ref, dimensions] = useChartDimensions({
    marginBottom: 77,
  })
  const theme = useTheme();
  const gradientColors = [theme.vars.palette.primary.main, theme.vars.palette.primary.contrastText]
  const gradientId = useUniqueId("Histogram-gradient")

  const numberOfThresholds = 9

  const xAccessor = d => d[xAxis]
  const yAccessor = d => d[yAxis]

  if (xAxisParser) {
    xAccessor = d => xAxisParser(d[xAxis])
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

  const yAxisSummarizationLabel = yAxisSummarization === 'distinct' ? 'count' : yAxisSummarization

  return (
    <div className={`Chart__rectangle ${zoomed ? 'zoomed' : active ? 'active' : '' } ${outOfFocus ? 'outOfFocus' : 'inFocus'}`} ref={ref}>
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
          label={xAxis.charAt(0).toUpperCase() + xAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          format={xAxisFormat}
        />
        <Axis
          dimensions={dimensions}
          dimension="y"
          scale={yScale}
          label={yAxisSummarizationLabel.charAt(0).toUpperCase() + yAxisSummarizationLabel.slice(1).replace(/([A-Z])/g, ' $1') + " of " + yAxis.charAt(0).toUpperCase() + yAxis.slice(1).replace(/([A-Z])/g, ' $1')}
        />
        {xAxis && <Rectangles
          zoomed={zoomed}
          data={bins}
          dimensions={dimensions}
          keyAccessor={keyAccessor}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
          widthAccessor={widthAccessorScaled}
          heightAccessor={heightAccessorScaled}
          tooltipValue1Title={xAxis.charAt(0).toUpperCase() + xAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          tooltipValue2Title={yAxisSummarizationLabel.charAt(0).toUpperCase() + yAxisSummarizationLabel.slice(1).replace(/([A-Z])/g, ' $1') + " of " + yAxis.charAt(0).toUpperCase() + yAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          tooltipValue2Value={yAccessorSummarization}
          tooltipValue1ValueFormat={xAxisFormat}
          style={outOfFocus ? {} : { fill: `url(#${gradientId})` }}
          outOfFocus={outOfFocus}
        />}
      </Chart>
    </div>
  )
}

export default Histogram
