import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"
import { accessorPropsType } from "./utils";
import Texts from "./Texts"
import { useTheme } from '@mui/material/styles';

const Arcs = ({ type, data, keyAccessor, value, radius, radiusAdjust, ...props }) => {

  const theme = useTheme();

  if (type === "pie") {
    radiusAdjust = 0
  }

  const arc = d3.arc()
    .innerRadius(radius * radiusAdjust)
    .outerRadius(radius)

  const valueAccessor = d => d.data[1][value]
  const sumOfValues = d3.sum(data, valueAccessor)
  const valueAccessor10PercentOrAbove = d => d.data[1][value] / sumOfValues >= 0.1 ? d3.format(".2~f")(d.data[1][value]) : ''

  return (
    <React.Fragment>
      {data.map((d, i) => (
        <path {...props}
          key={keyAccessor(d, i)}
          className={`Arcs Arc--type-${type}`}
          d={arc(d)}
        />
      ))}

      <Texts
        data={data}
        keyAccessor={keyAccessor}
        xAccessor={d => (arc.centroid(d)[0])}
        yAccessor={d => (arc.centroid(d)[1])}
        textAccessor={valueAccessor10PercentOrAbove}
        style={{ fill: theme.vars.palette.background.primary, textAnchor: "middle", alignmentBaseline: "middle" }}
      />
    </React.Fragment>
  )
}

Arcs.propTypes = {
  type: PropTypes.oneOf(["pie", "donut"]),
  data: PropTypes.array,
  keyAccessor: accessorPropsType,
  value: PropTypes.string,
  radius: accessorPropsType,
  radiusAdjust: accessorPropsType,
}

Arcs.defaultProps = {
  radiusAdjust: 0.7,
}

export default Arcs
