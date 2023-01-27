import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"
import { accessorPropsType, callAccessor } from "./utils";
import { dimensionsPropsType } from "./utils";

const Voronoi = ({ data, dimensions, xAccessor, yAccessor, a, ab, abc, abcd, ...props }) => {
  const tooltip = d3.select("#tooltipD3")

  const handleMouseEnter = (e, d, i) => {
    const bounds = d3.select(e.target.parentElement)

    const dayDot = bounds.append("circle")
      .attr("class", "tooltipDot")
      .attr("cx", callAccessor(xAccessor, d, i))
      .attr("cy", callAccessor(yAccessor, d, i))
      .attr("r", 6)
      .style("fill", "#108ADE")
      .style("pointer-events", "none")

    tooltip.select("#tooltipD3-value1")
      .text(a + ": " + abc(d))

    tooltip.select("#tooltipD3-value2")
      .text(ab + ": " + abcd(d))

    const x = dimensions.offsetLeft + 16 + dimensions.marginLeft + callAccessor(xAccessor, d, i)
    const y = dimensions.offsetTop + 8 + dimensions.marginTop + callAccessor(yAccessor, d, i)

    tooltip.style("transform", `translate(`
      + `calc(-50% + ${x}px),`
      + `calc(-100% + ${y}px)`
      + `)`)

    tooltip.style("opacity", 1)
  }

  const handleMouseLeave = () => {
    d3.selectAll(".tooltipDot")
      .remove()

    tooltip.style("opacity", 0)
  }

  const delaunay = d3.Delaunay.from(
    data,
    xAccessor,
    yAccessor,
  )
  const voronoi = delaunay.voronoi()
  voronoi.xmax = dimensions.boundedWidth
  voronoi.ymax = dimensions.boundedHeight

  return <React.Fragment>
    {data.map((d, i) => (
      <path
        {...props}
        className="voronoi"
        d={voronoi.renderCell(i)}
        onMouseEnter={e => handleMouseEnter(e, d, i)}
        onMouseLeave={handleMouseLeave}
      />
    ))}
  </React.Fragment>
}

Voronoi.propTypes = {
  data: PropTypes.array,
  dimensions: dimensionsPropsType,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  a: accessorPropsType,
  ab: accessorPropsType,
  abc: accessorPropsType,
  abcd: accessorPropsType,
}


export default Voronoi
