import React from "react"
import PropTypes from "prop-types"
import * as d3 from 'd3'
import { dimensionsPropsType } from "./utils";
import { useChartDimensions } from "./Chart";

const axisComponentsByDimension = {
  x: AxisHorizontal,
  y: AxisVertical,
}
const Axis = ({ dimension, ...props }) => {
  const dimensions = useChartDimensions()
  const Component = axisComponentsByDimension[dimension]
  if (!Component) return null

  return (
    <Component
      dimensions={dimensions}
      {...props}
    />
  )
}

const formatFunction = (labelFormat) => {
  switch (labelFormat) {
    case 'text':
      return d3.format(",")
      break;
    case 'number':
      return d3.format(",")
      break;
    case 'date':
      return d3.timeFormat("%b %Y")
      break;
    default:
      return d3.format(",")
      break;
  }
}

Axis.propTypes = {
  dimension: PropTypes.oneOf(["x", "y"]),
  dimensions: dimensionsPropsType,
  scale: PropTypes.func,
  label: PropTypes.string,
  labelFormat: PropTypes.string,
}

Axis.defaultProps = {
  dimension: "x",
  scale: null,
  labelFormat: 'text',
}

export default Axis


function AxisHorizontal({ dimensions, label, labelFormat, scale, ...props }) {
  const numberOfTicks = dimensions.boundedWidth < 600
    ? dimensions.boundedWidth / 100
    : dimensions.boundedWidth / 250

  const ticks = scale.ticks(numberOfTicks)
  const formatFunc = formatFunction(labelFormat)

  return (
    <g className="Axis AxisHorizontal" transform={`translate(0, ${dimensions.boundedHeight})`} {...props}>
      <line
        className="Axis__line"
        x2={dimensions.boundedWidth}
      />

      {ticks.map((tick, i) => (
        <text
          key={tick}
          className="Axis__tick"
          transform={`translate(${scale(tick)}, 25)`}
        >
          {formatFunc(tick)}
        </text>
      ))}

      {label && (
        <text
          className="Axis__label"
          transform={`translate(${dimensions.boundedWidth / 2}, 60)`}
        >
          {label}
        </text>
      )}
    </g>
  )
}

function AxisVertical({ dimensions, label, labelFormat, scale, ...props }) {
  const numberOfTicks = dimensions.boundedHeight / 70

  const ticks = scale.ticks(numberOfTicks)
  const formatFunc = formatFunction(labelFormat)

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
          transform={`translate(-16, ${scale(tick)})`}
        >
          {formatFunc(tick)}
        </text>
      ))}

      {label && (
        <text
          className="Axis__label"
          style={{
            transform: `translate(-56px, ${dimensions.boundedHeight / 2}px) rotate(-90deg)`
          }}
        >
          {label}
        </text>
      )}
    </g>
  )
}
