import React, { useState, useEffect, useRef } from 'react';
import * as d3 from "d3";

const Chart1 = (props) => {
  const svgRef = useRef(null);

  useEffect(() => {
    // D3 Code
    const yAccessor = (d) => d.temperatureMax;
    const parseDate = d3.timeParse("%Y-%m-%d");
    const xAccessor = (d) => parseDate(d.date);

    // Dimensions
    let dimensions = {
      width: window.innerWidth * 0.9,
      height: 400,
      margins: {
        top: 15,
        right: 15,
        bottom: 40,
        left: 60,
      }
    }
    dimensions.boundedWidth = dimensions.width
      - dimensions.margins.left
      - dimensions.margins.right;
    dimensions.boundedHeight = dimensions.height
      - dimensions.margins.top
      - dimensions.margins.bottom;
    
    console.log(dimensions);

    // Draw canvas
    const wrapper = d3.select(svgRef.current)
      .attr("width", dimensions.width)

  }, [props.Data, svgRef.current]); // redraw chart if data changes

  return <svg ref={svgRef} />;
};

export default Chart1;