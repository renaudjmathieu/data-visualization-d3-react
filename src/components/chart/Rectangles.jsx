import React from "react"
import PropTypes from "prop-types"
import * as d3 from 'd3'
import { accessorPropsType, callAccessor } from "./utils";
import { dimensionsPropsType } from "./utils";
import { useChartDimensions } from "./Chart";

import { useDataContext } from "../../providers/DataProvider"

const Rectangles = (props) => {
  const dimensions = useChartDimensions()
  const { selectedChartIndex, selectedColumnType, selectedColumn1, selectedItem1, selectedItem2 } = useDataContext()

  const tooltip = d3.select(`#tooltipD3${props.zoomed ? 'zoomed' : ''}`)

  const xAxisTypeter = props.xAxisType === 'date' ? d3.timeFormat("%B %d, %Y") : props.xAxisType === 'time' ? d3.timeFormat("%H:%M") : d3.format(".2f")

  const handleMouseEnter = (e, d, i) => {
    tooltip.select(`#tooltipD3${props.zoomed ? 'zoomed' : ''}-value1`)
      .text(props.tooltipValue1Title + ": " + [
        xAxisTypeter(d.x0),
        xAxisTypeter(d.x1)
      ].join(" - "))

    tooltip.select(`#tooltipD3${props.zoomed ? 'zoomed' : ''}-value2`)
      .text(props.tooltipValue2Title + ": " + props.tooltipValue2ValueFormat(props.tooltipValue2Value(d)))

    tooltip.select(`#tooltipD3${props.zoomed ? 'zoomed' : ''}-value3`)
      .text('Highlighted' + ": " + props.tooltipValue2ValueFormat(props.tooltipValue3Value(d)))

    const x = dimensions.offsetLeft + 16 + dimensions.marginLeft + callAccessor(props.xAxisAccessor, d, i) + (callAccessor(props.widthAccessor, d, i) / 2)
    const y = dimensions.offsetTop + 8 + dimensions.marginTop + callAccessor(props.yAxisAccessor, d, i)

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
    return i === props.data.length - 2
  }

  return <React.Fragment>
    {props.data.map((d, i) => (
      <rect style={props.style}
        className={
          props.color ? "Rectangles__rect Rectangles__marked" : [
            "Rectangles__rect Rectangles__unmarked",
            `Rectangles__rect--is-${selectedChartIndex == props.chartIndex && props.xAxisType === 'number' && d.x0 == selectedItem1 && d.x1 == selectedItem2 ? "selected" :
              selectedChartIndex == props.chartIndex && props.xAxisType !== 'number' && d[0] == selectedItem1 ? "selected" :
                selectedChartIndex == props.chartIndex && selectedItem1 ? "next-to-selected" : "not-selected"
            }`
          ].join(" ")}
        key={props.keyAxisAccessor(d, i)}
        x={callAccessor(props.xAxisAccessor, d, i)}
        y={callAccessor(props.yAxisAccessor, d, i)}
        width={d3.max([callAccessor(props.widthAccessor, d, i), 0])}
        height={d3.max([callAccessor(props.heightAccessor, d, i), 0])}
        onMouseEnter={!props.outOfFocus ? e => handleMouseEnter(e, d, i) : null}
        onMouseLeave={!props.outOfFocus ? handleMouseLeave : null}
        onMouseDown={!props.outOfFocus ? ((selectedColumnType === 'BinValues' || selectedColumnType === 'LastBinValues') && props.xAxisType === 'number' && selectedColumn1 == props.column && selectedItem1 == d.x0 && selectedItem2 == d.x1) || (selectedColumnType == 'SingleValue' && props.xAxisType !== 'number' && selectedColumn1 == props.column && selectedItem1 == d[0]) ? (e) => props.handleHighlightData(e, null, null, null, null, null, null) : props.xAxisType === 'number' ? (e) => props.handleHighlightData(e, props.chartIndex, isLastBin(d, i) ? 'LastBinValues' : 'BinValues', props.column, null, d.x0, d.x1) : (e) => props.handleHighlightData(e, props.chartIndex, 'SingleValue', props.column, null, d[0], null) : null}
      />
    ))}
  </React.Fragment>
}

export default Rectangles

