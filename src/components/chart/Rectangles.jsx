import React from "react"
import PropTypes from "prop-types"
import * as d3 from 'd3'
import { accessorPropsType, callAccessor } from "./utils";
import { dimensionsPropsType } from "./utils";

const Rectangles = ({ zoomed, active, data, dimensions, keyAccessor, xAccessor, yAccessor, widthAccessor, heightAccessor, tooltipValue1Title, tooltipValue1ValueFormat, tooltipValue2Title, tooltipValue2Value, tooltipValue2ValueFormat, style, outOfFocus, onMouseDown, column, selectedChart, chartIndex, selectedColumn, selectedItem, ...props }) => {
  const tooltip = d3.select(`#tooltipD3${zoomed ? 'zoomed' : ''}`)

  const tooltipValue1ValueFormatter = tooltipValue1ValueFormat === 'date' ? d3.timeFormat("%B %d, %Y") : tooltipValue1ValueFormat === 'time' ? d3.timeFormat("%H:%M") : d3.format(".2f")

  const handleMouseEnter = (e, d, i) => {
    tooltip.select(`#tooltipD3${zoomed ? 'zoomed' : ''}-value1`)
      .text(tooltipValue1Title + ": " + [
        tooltipValue1ValueFormatter(d.x0),
        tooltipValue1ValueFormatter(d.x1)
      ].join(" - "))
      
    tooltip.select(`#tooltipD3${zoomed ? 'zoomed' : ''}-value2`)
      .text(tooltipValue2Title + ": " + tooltipValue2ValueFormat(tooltipValue2Value(d)))

    const x = dimensions.offsetLeft + 16 + dimensions.marginLeft + callAccessor(xAccessor, d, i) + (callAccessor(widthAccessor, d, i) / 2)
    const y = dimensions.offsetTop + 8 + dimensions.marginTop + callAccessor(yAccessor, d, i)

    tooltip.style("transform", `translate(`
      + `calc(-50% + ${x}px),`
      + `calc(-100% + ${y}px)`
      + `)`)

    tooltip.style("opacity", 1)
  }

  const handleMouseLeave = () => {
    tooltip.style("opacity", 0)
  }

  return <React.Fragment>
    {data.map((d, i) => (
      <rect style={style}
        className={[
          "Rectangles__rect",
          `Rectangles__rect--is-${selectedChart == chartIndex && d[0] == selectedItem ? "selected" :
            selectedChart == chartIndex && selectedItem ? "next-to-selected" :
              "not-selected"
          }`
        ].join(" ")}
        key={keyAccessor(d, i)}
        x={callAccessor(xAccessor, d, i)}
        y={callAccessor(yAccessor, d, i)}
        width={d3.max([callAccessor(widthAccessor, d, i), 0])}
        height={d3.max([callAccessor(heightAccessor, d, i), 0])}
        onMouseEnter={!outOfFocus ? e => handleMouseEnter(e, d, i): null}
        onMouseDown={(selectedColumn == column && selectedItem == d[0]) ? (e) => onMouseDown(e, null, null, null) : (e) => onMouseDown(e, chartIndex, column, d[0])}
      />
    ))}
  </React.Fragment>
}

export default Rectangles

