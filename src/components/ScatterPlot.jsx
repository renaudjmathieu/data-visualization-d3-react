import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"

import Chart from "./chart/Chart"
import Circles from "./chart/Circles"
import Voronoi from "./chart/Voronoi"
import Axis from "./chart/Axis"
import { useChartDimensions, accessorPropsType } from "./chart/utils"
import { useTheme } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';

const ScatterPlot = ({ outOfFocus, active, onClick, data, xAxis, yAxis, xAxisParser, yAxisParser, xAxisFormatter, yAxisFormatter }) => {
  const [ref, dimensions] = useChartDimensions({
    marginBottom: 77
  })

  const theme = useTheme();

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
    .nice()

  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()

  const xAccessorScaled = d => xScale(xAccessor(d))
  const yAccessorScaled = d => yScale(yAccessor(d))
  const keyAccessor = (d, i) => i

  return (
    <div onClick={outOfFocus ? onClick : null} className={active ? "Chart__square inFocus active" : outOfFocus ? "Chart__square outOfFocus" : "Chart__square inFocus"} ref={ref}>
      <div className="ChartIcons">
        <ZoomOutMapIcon style={{ color: theme.vars.palette.primary.main }} />
        <SettingsIcon onClick={onClick} style={{ color: theme.vars.palette.primary.main }} />
      </div>
      <Chart dimensions={dimensions}>
        <Axis
          dimensions={dimensions}
          dimension="x"
          scale={xScale}
          label={xAxis.charAt(0).toUpperCase() + xAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          formatter={xAxisFormatter}
        />
        <Axis
          dimensions={dimensions}
          dimension="y"
          scale={yScale}
          label={yAxis.charAt(0).toUpperCase() + yAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          formatter={yAxisFormatter}
        />
        <Circles
          data={data}
          keyAccessor={keyAccessor}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
        />
        {!outOfFocus && <Voronoi
          data={data}
          dimensions={dimensions}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
          a={xAxis.charAt(0).toUpperCase() + xAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          ab={yAxis.charAt(0).toUpperCase() + yAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          abc={xAccessor}
          abcd={yAccessor}
        //style={{ fill: `transparent` }}
        />}
      </Chart>
    </div>
  )
}

ScatterPlot.propTypes = {
  xAxis: PropTypes.string,
  yAxis: PropTypes.string,
  xAxisParser: PropTypes.func,
  yAxisParser: PropTypes.func,
  xAxisFormatter: PropTypes.func,
  yAxisFormatter: PropTypes.func,
}

export default ScatterPlot
