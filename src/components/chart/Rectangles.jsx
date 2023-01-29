import React from "react"
import PropTypes from "prop-types"
import * as d3 from 'd3'
import { accessorPropsType, callAccessor } from "./utils";
import { dimensionsPropsType } from "./utils";

const Rectangles = ({ zoomed, data, dimensions, keyAccessor, xAccessor, yAccessor, widthAccessor, heightAccessor, a, ab, abc, outOfFocus, ...props }) => {
  const tooltip = d3.select(`#tooltipD3${zoomed ? 'zoomed' : ''}`)

  const handleMouseEnter = (e, d, i) => {
    tooltip.select(`#tooltipD3${zoomed ? 'zoomed' : ''}-value1`)
      .text(a + ": " + [
        d.x0,
        d.x1
      ].join(" - "))
      
    tooltip.select(`#tooltipD3${zoomed ? 'zoomed' : ''}-value2`)
      .text(ab + ": " + abc(d))

    const x = dimensions.offsetLeft + 16 + dimensions.marginLeft + callAccessor(xAccessor, d, i) + (callAccessor(widthAccessor, d, i) / 2)
    const y = dimensions.offsetTop + 8 + dimensions.marginTop + callAccessor(yAccessor, d, i)

    tooltip.style("transform", `translate(`
      + `calc(-50% + ${x}px),`
      + `calc(-100% + ${y}px)`
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
        onMouseEnter={!outOfFocus ? e => handleMouseEnter(e, d, i): null}
        onMouseLeave={handleMouseLeave}
      />
    ))}
  </React.Fragment>
}

Rectangles.propTypes = {
  zoomed : PropTypes.bool,
  data: PropTypes.array,
  dimensions: dimensionsPropsType,
  keyAccessor: accessorPropsType,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  widthAccessor: accessorPropsType,
  heightAccessor: accessorPropsType,
  a: accessorPropsType,
  ab: accessorPropsType,
  abc: accessorPropsType,
  outOfFocus: PropTypes.bool,
}

Rectangles.defaultProps = {
}

export default Rectangles

