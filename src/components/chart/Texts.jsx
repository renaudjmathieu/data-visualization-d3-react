import React from "react"
import PropTypes from "prop-types"
import * as d3 from 'd3'
import { accessorPropsType, callAccessor } from "./utils";

const Texts = ({ anchor, data, keyAccessor, xAccessor, yAccessor, textAccessor, ...props }) => {

  if (anchor === "center") {
    props.textAnchor = "middle"
    props.alignmentBaseline = "middle"
  }

  return (
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
}


Texts.propTypes = {
  anchor: PropTypes.oneOf(["upper-left", "center"]),
  data: PropTypes.array,
  keyAccessor: accessorPropsType,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  textAccessor: accessorPropsType,
}

Texts.defaultProps = {
  anchor: "upper-left",
}

export default Texts

