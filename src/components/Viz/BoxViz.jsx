import React, { useEffect, useRef } from 'react'
import * as d3 from "d3"

const BoxViz = () => {
  const ref = useRef(null)

  useEffect(() => {
    // Draw canvas
    const wrapper = d3.select(ref.current)
      .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 100 100")
        .classed("svg-content", true)
        .style("border", "2px solid #af9358")

  }, [ref.current])

  return <div id="container" class="svg-container" ref={ref}></div>
}

export default BoxViz