import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"
import { accessorPropsType } from "./utils";

const Polyline = ({ type, data, xAccessor, yAccessor, y0Accessor, angleAccessor, radiusAccessor, interpolation, ...props }) => {
  const lineGenerator = d3[type]()
    .curve(interpolation)

  let polyline = null

  if (type === "line" || type === "area") {
    lineGenerator
      .x(xAccessor)
      .y(yAccessor)

    if (type === "area") {
      lineGenerator
        .y0(y0Accessor)
        .y1(yAccessor)
    }
    polyline = <path {...props}
      className={`Polyline Polyline--type-${type}`}
      d={lineGenerator(data)}
    />
  }
  else if (type === "lineRadial") {
    lineGenerator
      .angle(angleAccessor)
      .radius(radiusAccessor)

    polyline = <path {...props}
      className={`Polyline Polyline--type-${type}`}
      d={lineGenerator(data)}
    />
  }
  
  return polyline
}

Polyline.propTypes = {
  type: PropTypes.oneOf(["line", "area", "lineRadial"]),
  data: PropTypes.array,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  y0Accessor: accessorPropsType,
  angleAccessor: accessorPropsType,
  radiusAccessor: accessorPropsType,
  interpolation: PropTypes.func,
}

Polyline.defaultProps = {
  type: "line",
  y0Accessor: 0,
  interpolation: d3.curveMonotoneX,
}

export default Polyline
