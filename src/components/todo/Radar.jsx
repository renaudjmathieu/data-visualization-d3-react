import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"

import Chart from "./chart/Chart"
import Circles from "./chart/Circles"
import Lines from "./chart/Lines"
import Texts from "./chart/Texts"
import Polyline from "./chart/Polyline"
import Gradient from "./chart/Gradient"
import { useChartDimensions, accessorPropsType, useUniqueId } from "./chart/utils"
import { useTheme } from '@mui/material/styles';

const Radar = ({ data, valueAccessor, entityAccessor }) => {
  const [ref, dimensions] = useChartDimensions({
    marginTop: 20,
    marginRight: 20,
    marginBottom: 20,
    marginLeft: 20,
  })
  const theme = useTheme();
  const gradientColors = [theme.vars.palette.primary.main, theme.vars.palette.primary.contrastText]
  const gradientId = useUniqueId("Histogram-gradient")

  const radius = dimensions.boundedWidth / 2

  let dataByEntity = Array.from(d3.group(data, entityAccessor))
    .sort((a, b) => b[1].length - a[1].length)

  const metricScales = dataByEntity.map(metric => (
    d3.scaleLinear()
      .domain(d3.extent(data, d => +d[metric]))
      .range([0, radius])
      .nice()
  ))

  const keyAccessor = (d, i) => i
  const rings = d3.range(4)

  dataByEntity = dataByEntity.map((d, i) => {
    if (i == 0 || i == dataByEntity.length / 2) {
      d.anchor = "middle"
    } else if (i < dataByEntity.length / 2) {
      d.anchor = "start"
    } else {
      d.anchor = "end"
    }
    return d
  })

  return (
    <div className="Chart__square" ref={ref}>
      <Chart dimensions={dimensions}>
        <Circles
          type="ring"
          data={rings}
          keyAccessor={keyAccessor}
          xAccessor={radius}
          yAccessor={radius}
          radius={(d, i) => radius * (i / 3)}
        />
        <Lines
          data={dataByEntity}
          keyAccessor={keyAccessor}
          x1Accessor={dimensions.boundedWidth / 2}
          x2Accessor={(d, i) => Math.cos(i * ((Math.PI * 2) / dataByEntity.length) - Math.PI * 0.5) * radius + dimensions.boundedWidth / 2}
          y1Accessor={dimensions.boundedHeight / 2}
          y2Accessor={(d, i) => Math.sin(i * ((Math.PI * 2) / dataByEntity.length) - Math.PI * 0.5) * radius + dimensions.boundedWidth / 2}
        />
        <Texts
          data={dataByEntity}
          keyAccessor={keyAccessor}
          xAccessor={(d, i) => Math.cos(i * ((Math.PI * 2) / dataByEntity.length) - Math.PI * 0.5) * (radius * 1.1) + dimensions.boundedWidth / 2}
          yAccessor={(d, i) => Math.sin(i * ((Math.PI * 2) / dataByEntity.length) - Math.PI * 0.5) * (radius * 1.1) + dimensions.boundedHeight / 2}
          textAccessor={d => d.name}
          anchorAccessor={d => d.anchor}
        />
        <Polyline
          type="lineRadial"
          data={dataByEntity}
          angleAccessor={(d, i) => i * ((Math.PI * 2) / dataByEntity.length)}
          radiusAccessor={(metric, i) => metricScales[i](+day[metric] || 0)}
          interpolation={d3.curveLinearClosed}
        />
      </Chart>
    </div>
  )
}

Radar.propTypes = {
  xAccessor: accessorPropsType,
  xLabel: PropTypes.string,
}

Radar.defaultProps = {
  xAccessor: d => d.x,
}
export default Radar
