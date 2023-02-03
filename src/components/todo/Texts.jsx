import React from "react"
import PropTypes from "prop-types"
import * as d3 from 'd3'
import { accessorPropsType, callAccessor } from "../chart/utils";

const Texts = ({ data, keyAccessor, xAccessor, yAccessor, textAccessor, anchorAccessor, ...props }) => {

  return (
    <React.Fragment>
      {data.map((d, i) => (
        <text textAnchor={callAccessor(anchorAccessor, d, i)} {...props}
          className="Texts__text"
          key={keyAccessor(d, i)}
          x={callAccessor(xAccessor, d, i)}
          y={callAccessor(yAccessor, d, i)}
        >
          {callAccessor(textAccessor, d, i)}
        </text>
      ))}
    </React.Fragment>
  )
}


Texts.propTypes = {
  data: PropTypes.array,
  keyAccessor: accessorPropsType,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  textAccessor: accessorPropsType,
  anchorAccessor: accessorPropsType,
}

export default Texts

