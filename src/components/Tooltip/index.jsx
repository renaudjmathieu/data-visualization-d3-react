import React from "react"

import "./style.css"

const Tooltip = (props) => {

  return (
    <div id={`tooltipD3${props.zoomed ? 'zoomed' : ''}`} className="tooltipD3">
      <div className="tooltipD3-value1">
        <span id={`tooltipD3${props.zoomed ? 'zoomed' : ''}-value1`}></span>
      </div>
      <div className="tooltipD3-value2">
        <span id={`tooltipD3${props.zoomed ? 'zoomed' : ''}-value2`}></span>
      </div>
      <div className="tooltipD3-value3">
        <span id={`tooltipD3${props.zoomed ? 'zoomed' : ''}-value3`}></span>
      </div>
    </div>
  )
}

export default Tooltip
