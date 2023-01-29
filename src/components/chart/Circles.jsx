import React from "react"
import PropTypes from "prop-types"
import { accessorPropsType } from "./utils";

const Circles = ({ type, data, keyAccessor, xAccessor, yAccessor, radius }) => (
  <React.Fragment>
    {data.map((d, i) => (
      <circle
        className={`Circles Circle--type-${type}`}
        key={keyAccessor(d, i)}
        cx={typeof xAccessor == "function" ? xAccessor(d, i) : xAccessor}
        cy={typeof yAccessor == "function" ? yAccessor(d, i) : yAccessor}
        r={typeof radius == "function" ? radius(d, i) : radius}
      />
    ))}
  </React.Fragment>
)

Circles.propTypes = {
  type: PropTypes.oneOf(["circle", "ring"]),
  data: PropTypes.array,
  keyAccessor: accessorPropsType,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  radius: accessorPropsType,
}

Circles.defaultProps = {
  type: "circle",
  radius: 5,
}

export default Circles
