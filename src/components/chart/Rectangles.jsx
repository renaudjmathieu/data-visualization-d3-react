import React from "react"
import PropTypes from "prop-types"
import * as d3 from 'd3'
import { accessorPropsType, callAccessor } from "./utils";
import { dimensionsPropsType } from "./utils";

const Rectangles = ({ zoomed, active, data, dimensions, keyAccessor, xAccessor, yAccessor, widthAccessor, heightAccessor, tooltipValue1Title, xAxisType, tooltipValue2Title, tooltipValue2Value, tooltipValue2ValueFormat, tooltipValue3Value, style, outOfFocus, onMouseDown, column, selectedChart, chartId, selectedColumnType, selectedColumn1, selectedColumn2, selectedItem1, selectedItem2, color, ...props }) => {
  const tooltip = d3.select(`#tooltipD3${zoomed ? 'zoomed' : ''}`)

  const xAxisTypeter = xAxisType === 'date' ? d3.timeFormat("%B %d, %Y") : xAxisType === 'time' ? d3.timeFormat("%H:%M") : d3.format(".2f")

  const handleMouseEnter = (e, d, i) => {
    tooltip.select(`#tooltipD3${zoomed ? 'zoomed' : ''}-value1`)
      .text(tooltipValue1Title + ": " + [
        xAxisTypeter(d.x0),
        xAxisTypeter(d.x1)
      ].join(" - "))

    tooltip.select(`#tooltipD3${zoomed ? 'zoomed' : ''}-value2`)
      .text(tooltipValue2Title + ": " + tooltipValue2ValueFormat(tooltipValue2Value(d)))

    tooltip.select(`#tooltipD3${zoomed ? 'zoomed' : ''}-value3`)
      .text('Highlighted' + ": " + tooltipValue2ValueFormat(tooltipValue3Value(d)))

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

  const isLastBin = (d, i) => {
    return i === data.length - 2
  }

  return <React.Fragment>
    {data.map((d, i) => (
      <rect style={style}
        className={
          color ? "Rectangles__rect Rectangles__marked" : [
            "Rectangles__rect Rectangles__unmarked",
            `Rectangles__rect--is-${selectedChart == chartId && xAxisType === 'number' && d.x0 == selectedItem1 && d.x1 == selectedItem2 ? "selected" :
              selectedChart == chartId && xAxisType !== 'number' && d[0] == selectedItem1 ? "selected" :
                selectedChart == chartId && selectedItem1 ? "next-to-selected" : "not-selected"
            }`
          ].join(" ")}
        key={keyAccessor(d, i)}
        x={callAccessor(xAccessor, d, i)}
        y={callAccessor(yAccessor, d, i)}
        width={d3.max([callAccessor(widthAccessor, d, i), 0])}
        height={d3.max([callAccessor(heightAccessor, d, i), 0])}
        onMouseEnter={!outOfFocus ? e => handleMouseEnter(e, d, i) : null}
        onMouseLeave={!outOfFocus ? handleMouseLeave : null}
        onMouseDown={!outOfFocus ? ((selectedColumnType === 'BinValues' || selectedColumnType === 'LastBinValues') && xAxisType === 'number' && selectedColumn1 == column && selectedItem1 == d.x0 && selectedItem2 == d.x1) || (selectedColumnType == 'SingleValue' && xAxisType !== 'number' && selectedColumn1 == column && selectedItem1 == d[0]) ? (e) => onMouseDown(e, null, null, null, null, null, null) : xAxisType === 'number' ? (e) => onMouseDown(e, chartId, isLastBin(d, i) ? 'LastBinValues' : 'BinValues', column, null, d.x0, d.x1) : (e) => onMouseDown(e, chartId, 'SingleValue', column, null, d[0], null) : null}
      />
    ))}
  </React.Fragment>
}

export default Rectangles

