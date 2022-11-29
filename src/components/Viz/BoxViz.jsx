import React, { useState, useEffect, useRef } from 'react'
import * as d3 from "d3"

const BoxViz = (props) => {
  const ref = useRef(null)

  useEffect(() => {
    // Dimensions
    const width = d3.min([
      (window.innerWidth - 280) * 0.9,
      (window.innerHeight - 130),
    ])
    let dimensions = {
      width,
      height: width,
      margins: {
        top: 10,
        right: 10,
        bottom: 50,
        left: 50,
      }
    }
    dimensions.boundedWidth = dimensions.width
      - dimensions.margins.left
      - dimensions.margins.right;
    dimensions.boundedHeight = dimensions.height
      - dimensions.margins.top
      - dimensions.margins.bottom;

    // Draw canvas
    const wrapper = d3.select(ref.current)
      .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)
        .style("border", "2px solid #af9358")

  }, [props.Data, ref.current]) // redraw chart if data changes

  return <div ref={ref}></div>
};

export default BoxViz;