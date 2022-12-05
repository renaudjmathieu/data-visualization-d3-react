import React from "react"
import PropTypes from "prop-types"
import * as d3 from 'd3'
import { accessorPropsType, callAccessor } from "./utils";

const Texts = ({ data, keyAccessor, xAccessor, yAccessor, textAccessor, ...props }) => (
  <React.Fragment>
    {data.map((d, i) => (
      <text {...props}
        className="Texts__text"
        key={keyAccessor(d, i)}
        x={callAccessor(xAccessor, d, i)}
        y={callAccessor(yAccessor, d, i)}
      >{callAccessor(textAccessor, d, i)}</text>
    ))}
  </React.Fragment>
)

Texts.propTypes = {
  data: PropTypes.array,
  keyAccessor: accessorPropsType,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  textAccessor: accessorPropsType,
}

Texts.defaultProps = {
}

export default Texts

