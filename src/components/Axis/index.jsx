import React from "react"
import * as d3 from 'd3'
import { callAccessor } from "../../utils";
import { useChartDimensionsContext } from "../../providers/ChartDimensionsProvider";

import "./style.css"

const axisComponentsByDimension = {
  x: AxisHorizontal,
  y: AxisVertical,
}
const Axis = ({ dimension, ...props }) => {
  const dimensions = useChartDimensionsContext()
  const Component = axisComponentsByDimension[dimension]
  if (!Component) return null

  return (
    <Component
      dimensions={dimensions}
      {...props}
    />
  )
}

export default Axis

function AxisHorizontal({ dimensions, scale, label, format, data, keyAxisAccessor, xAxisAccessor, widthAccessor, ...props }) {
  const numberOfTicks = dimensions.boundedWidth < 600
    ? dimensions.boundedWidth / 100
    : dimensions.boundedWidth / 250
  
  const ticks = format === 'number' ? scale.ticks(numberOfTicks) : scale.domain()
  const formatter = format === 'date' ? d3.timeFormat("%b %Y") : format === 'time' ? d3.timeFormat("%H:%M") : d => d.length > 18 ? d.slice(0, 18) + '...' : d

  return (
    <g className="Axis AxisHorizontal" transform={`translate(0, ${dimensions.boundedHeight})`} {...props}>
      <line
        className="Axis__line"
        x2={dimensions.boundedWidth}
      />

      {(format === 'number') && (
        ticks.map((tick, i) => (
          <text
            key={tick}
            className="Axis__tick"
            font-size={d3.min([d3.max([Math.floor((dimensions.boundedWidth / ticks.length)), 10]), 13])}
            transform={`translate(${scale(tick)}, 20)`}
          >
            {formatter(tick)}
          </text>
        ))
      )}
      {(format !== 'number' && data) && (
        data.map((d, i) => (
          <text
            key={keyAxisAccessor(d, i)}
            className="Axis__tick"
            font-size={d3.min([d3.max([Math.floor((dimensions.boundedWidth / data.length) / 2), 6]), 10])}
            transform={`translate(${callAccessor(xAxisAccessor, d, i) + (d3.max([callAccessor(widthAccessor, d, i), 0]) / 2)}, 8) rotate(-35)`}
          >
            {formatter(d[0])}
          </text>
        ))
      )}

      {label && (
        <text
          className="Axis__label"
          transform={`translate(${dimensions.boundedWidth / 2}, ${format !== 'number' ? '68' : '38'})`}
        >
          {label}
        </text>
      )}
    </g>
  )
}

function AxisVertical({ dimensions, scale, label, format, ...props }) {
  const numberOfTicks = dimensions.boundedHeight / 70

  const ticks = scale.ticks(numberOfTicks)
  const formatter = format === 'date' ? d3.timeFormat("%b %Y") : format === 'time' ? d3.timeFormat("%H:%M") : format === 'number' ? d3.format(".2~f") : d3.format(",")

  return (
    <g className="Axis AxisVertical" {...props}>
      <line
        className="Axis__line"
        y2={dimensions.boundedHeight}
      />

      {ticks.map((tick, i) => (
        <text
          key={tick}
          className="Axis__tick"
          fontSize={d3.min([d3.max([Math.floor((dimensions.boundedHeight / ticks.length)), 10]), 13])}
          transform={`translate(-10, ${scale(tick)})`}
        >
          {formatter(tick)}
        </text>
      ))}

      {label && (
        <text
          className="Axis__label"
          style={{
            transform: `translate(-36px, ${dimensions.boundedHeight / 2}px) rotate(-90deg)`
          }}
        >
          {label}
        </text>
      )}
    </g>
  )
}
