import React from "react"
import PropTypes from "prop-types"
import * as d3 from 'd3'
import { accessorPropsType, callAccessor } from "./utils";

const Rectangles = ({ data, keyAccessor, xAccessor, yAccessor, widthAccessor, heightAccessor, ...props }) => (
  <React.Fragment>
    {data.map((d, i) => (
      <rect {...props}
        className="Rectangles__rect"
        key={keyAccessor(d, i)}
        x={callAccessor(xAccessor, d, i)}
        y={callAccessor(yAccessor, d, i)}
        width={d3.max([callAccessor(widthAccessor, d, i), 0])}
        height={d3.max([callAccessor(heightAccessor, d, i), 0])}
      />
    ))}
  </React.Fragment>
)

Rectangles.propTypes = {
  data: PropTypes.array,
  keyAccessor: accessorPropsType,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  widthAccessor: accessorPropsType,
  heightAccessor: accessorPropsType,
}

Rectangles.defaultProps = {
}

export default Rectangles

