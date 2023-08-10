import React from "react"

import "./style.css"

const Tooltip = (props) => {
  
  return (
    <div
      className="DogBreedsTooltip"
      style={props.style} >
      <div className="DogBreedsTooltip__breeds">
        <div className="DogBreedsTooltip__breed">
          <div className="DogBreedsTooltip__breed__label">
            {_.map(props.lines, line => _.isObject(line) && (
              <div>
                {line.label}
              </div>
            ))}
          </div>
          <div className="DogBreedsTooltip__breed__value">
            {_.map(props.lines, line => _.isObject(line) && (
              <div>
                {line.value}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tooltip