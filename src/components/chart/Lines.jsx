import React from "react"
import PropTypes from "prop-types"
import { accessorPropsType } from "./utils";

const Lines = ({ data, keyAccessor, x1Accessor, x2Accessor, y1Accessor, y2Accessor }) => (
  <React.Fragment>
    {data.map((d, i) => (
      <line
        className="Lines__line"
        key={keyAccessor(d, i)}
        x1={typeof x1Accessor == "function" ? x1Accessor(d, i) : x1Accessor}
        x2={typeof x2Accessor == "function" ? x2Accessor(d, i) : x2Accessor}
        y1={typeof y1Accessor == "function" ? y1Accessor(d, i) : y1Accessor}
        y2={typeof y2Accessor == "function" ? y2Accessor(d, i) : y2Accessor}
      />
    ))}
  </React.Fragment>
)

Lines.propTypes = {
  data: PropTypes.array,
  keyAccessor: accessorPropsType,
  x1Accessor: accessorPropsType,
  x2Accessor: accessorPropsType,
  y1Accessor: accessorPropsType,
  y2Accessor: accessorPropsType,
}

export default Lines
