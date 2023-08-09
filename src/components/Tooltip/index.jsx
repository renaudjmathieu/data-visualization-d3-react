import React from "react"

import "./style.css"

const Tooltip = (props) => {

  return (

    <div id={`tooltipD3${props.zoomed ? 'zoomed' : ''}`} className="DogBreedsTooltip">
      <div className="DogBreedsTooltip__breeds">

        <div className="DogBreedsTooltip__breed">

          <div className="DogBreedsTooltip__breed__label">
            <div>
              <span id={`tooltipD3${props.zoomed ? 'zoomed' : ''}-label1`}></span>
            </div>
            <div>
              <span id={`tooltipD3${props.zoomed ? 'zoomed' : ''}-label2`}></span>
            </div>
            <div>
              <span id={`tooltipD3${props.zoomed ? 'zoomed' : ''}-label3`}></span>
            </div>
          </div>

          <div className="DogBreedsTooltip__breed__value">
            <div>
              <span id={`tooltipD3${props.zoomed ? 'zoomed' : ''}-value1`}></span>
            </div>
            <div >
              <span id={`tooltipD3${props.zoomed ? 'zoomed' : ''}-value2`}></span>
            </div>
            <div>
              <span id={`tooltipD3${props.zoomed ? 'zoomed' : ''}-value3`}></span>
            </div>
          </div>

        </div>
      </div>
    </div>

  )
}

export default Tooltip
