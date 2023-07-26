import React from "react"
import PropTypes from "prop-types"
import { accessorPropsType } from "./utils";

const Circles = ({ type, data, keyAccessor, xAccessor, yAccessor, xValue, yValue, onMouseDown, column, selectedChart, chartIndex, selectedColumn, selectedItem, radius }) => (
  <React.Fragment>
    {data.map((d, i) => (
      <circle
        className={[
          `Circles Circle--type-${type}`,
          `Circles Circle--type-${type}--is-${selectedChart == chartIndex && xValue(d, i) == selectedItem ? "selected" :
            selectedChart == chartIndex && selectedItem ? "next-to-selected" :
              "not-selected"
          }`
        ].join(" ")}
        key={keyAccessor(d, i)}
        cx={typeof xAccessor == "function" ? xAccessor(d, i) : xAccessor}
        cy={typeof yAccessor == "function" ? yAccessor(d, i) : yAccessor}
        r={typeof radius == "function" ? radius(d, i) : radius}
        onMouseDown={(selectedColumn == column && selectedItem == xValue(d, i)) ? (e) => onMouseDown(e, null, null, null) : (e) => onMouseDown(e, chartIndex, column, xValue(d, i))}
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
