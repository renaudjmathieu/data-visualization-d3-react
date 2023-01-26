import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"
import { accessorPropsType } from "./utils";
import { dimensionsPropsType } from "./utils";

const Voronoi = ({ data, dimensions, xAccessor, yAccessor, ...props }) => {

  const delaunay = d3.Delaunay.from(
    data,
    xAccessor,
    yAccessor,
  )
  const voronoi = delaunay.voronoi()
  voronoi.xmax = dimensions.boundedWidth
  voronoi.ymax = dimensions.boundedHeight

  return (
    <path
      {...props}
      className="voronoi"
      d={voronoi.render()}
      //onMouseEnter={e => handleMouseEnter(e, d, i)}
      //onMouseLeave={handleMouseLeave}
    />
  )
}

Voronoi.propTypes = {
  data: PropTypes.array,
  dimensions: dimensionsPropsType,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
}


export default Voronoi
