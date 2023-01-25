import React from "react"
import PropTypes from "prop-types"
import * as d3 from 'd3'
import { accessorPropsType, callAccessor } from "./utils";

const Rectangles = ({ data, keyAccessor, xAccessor, yAccessor, widthAccessor, heightAccessor, abc, ...props }) => {
  const tooltip = d3.select("#tooltipD3")

  const handleMouseEnter = (e, d, i) => {
    tooltip.select("#countD3")
      .text(abc(d))

    const formatHumidity = d3.format(".2f")
    tooltip.select("#rangeD3")
      .text([
        formatHumidity(d.x0),
        formatHumidity(d.x1)
      ].join(" - "))

    const parentDiv = e.target.parentElement.getBoundingClientRect()

    tooltip.style("transform", `translate(`
      + `calc(-50% + 120px + ${parentDiv.x}px + ${callAccessor(xAccessor, d, i)}px),`
      + `calc(-100% + 5px + ${parentDiv.y}px + ${callAccessor(yAccessor, d, i)}px)`
      + `)`)

    tooltip.style("opacity", 1)
  }

  const handleMouseLeave = () => {
    tooltip.style("opacity", 0)
  }

  return <React.Fragment>
    {data.map((d, i) => (
      <rect {...props}
        className="Rectangles__rect"
        key={keyAccessor(d, i)}
        x={callAccessor(xAccessor, d, i)}
        y={callAccessor(yAccessor, d, i)}
        width={d3.max([callAccessor(widthAccessor, d, i), 0])}
        height={d3.max([callAccessor(heightAccessor, d, i), 0])}
        onMouseEnter={e => handleMouseEnter(e, d, i)}
        onMouseLeave={handleMouseLeave}
      />
    ))}
  </React.Fragment>
}

Rectangles.propTypes = {
  data: PropTypes.array,
  keyAccessor: accessorPropsType,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  widthAccessor: accessorPropsType,
  heightAccessor: accessorPropsType,
  abc: accessorPropsType,
}

Rectangles.defaultProps = {
}

export default Rectangles

