import React from "react"

import PropTypes from "prop-types"
import * as d3 from "d3"
import { accessorPropsType, callAccessor } from "./utils";
import { useTheme } from '@mui/material/styles';

import { useDataContext } from "../../providers/DataProvider"
import { useChartDimensions } from "./Chart";

const Circles = (props) => {
  const theme = useTheme();
  const dimensions = useChartDimensions()
  const { selectedChartIndex, selectedColumn1, selectedColumn2, selectedItem1, selectedItem2 } = useDataContext()

  const tooltip = d3.select(`#tooltipD3${props.zoomed ? 'zoomed' : ''}`)

  const handleMouseEnter = (e, d, i) => {
    const bounds = d3.select(e.target.parentElement)

    const dayDot = bounds.append("circle")
      .attr("class", "tooltipDot")
      .attr("cx", callAccessor(props.xAxisAccessor, d, i))
      .attr("cy", callAccessor(props.yAxisAccessor, d, i))
      .attr("r", 5)
      .style("fill", theme.vars.palette.primary.main)
      .style("pointer-events", "none")

    const tooltipValue1ValueFormatter = props.tooltipValue1ValueFormat === 'date' ? d3.timeFormat("%B %d, %Y") : props.tooltipValue1ValueFormat === 'time' ? d3.timeFormat("%H:%M") : d3.format(".2f")
    const tooltipValue2ValueFormatter = props.tooltipValue2ValueFormat === 'date' ? d3.timeFormat("%B %d, %Y") : props.tooltipValue2ValueFormat === 'time' ? d3.timeFormat("%H:%M") : d3.format(".2f")

    tooltip.select(`#tooltipD3${props.zoomed ? 'zoomed' : ''}-value1`)
      .text(props.tooltipValue1Title + ": " + tooltipValue1ValueFormatter(props.tooltipValue1Value(d)))

    tooltip.select(`#tooltipD3${props.zoomed ? 'zoomed' : ''}-value2`)
      .text(props.tooltipValue2Title + ": " + tooltipValue1ValueFormatter(props.tooltipValue2Value(d)))

    const x = dimensions.offsetLeft + 16 + dimensions.marginLeft + callAccessor(props.xAxisAccessor, d, i)
    const y = dimensions.offsetTop + 8 + dimensions.marginTop + callAccessor(props.yAxisAccessor, d, i)

    tooltip.style("transform", `translate(`
      + `calc(-50% + ${x}px),`
      + `calc(-100% + ${y}px)`
      + `)`)

    tooltip.style("opacity", 1)
  }

  const handleMouseLeave = () => {
    d3.selectAll(".tooltipDot")
      .remove()

    tooltip.style("opacity", 0)
  }

  return (
    <React.Fragment>
      {props.data.map((d, i) => (
        <circle
          className={[
            `Circles Circle--type-${props.type}`,
            `Circles Circle--type-${props.type}--is-${selectedChartIndex == props.chartIndex && selectedItem1 === props.xValue(d, i) && selectedItem2 === props.yValue(d, i) ? "selected" :
              selectedChartIndex == props.chartIndex && selectedItem1 ? "next-to-selected" :
                "not-selected"
            }`
          ].join(" ")}
          key={props.keyAxisAccessor(d, i)}
          cx={typeof props.xAxisAccessor == "function" ? props.xAxisAccessor(d, i) : props.xAxisAccessor}
          cy={typeof props.yAxisAccessor == "function" ? props.yAxisAccessor(d, i) : props.yAxisAccessor}
          r={typeof props.radius == "function" ? props.radius(d, i) : props.radius}
          onMouseDown={!props.outOfFocus ? (selectedColumn1 == props.xAxis && selectedItem1 == props.xValue(d, i) && selectedColumn2 == props.yAxis && selectedItem2 == props.yValue(d, i) ? (e) => props.handleHighlightData(e, null, null, null, null, null, null) : (e) => props.handleHighlightData(e, props.chartIndex, 'MultipleValues', props.xAxis, props.yAxis, props.xValue(d, i), props.yValue(d, i))) : null}
          onMouseEnter={!props.outOfFocus ? (e => handleMouseEnter(e, d, i)) : null}
          onMouseLeave={!props.outOfFocus ? handleMouseLeave : null}
        />
      ))}
    </React.Fragment>
  )
}

Circles.propTypes = {
  type: PropTypes.oneOf(["circle", "ring"]),
  data: PropTypes.array,
  keyAxisAccessor: accessorPropsType,
  xAxisAccessor: accessorPropsType,
  yAxisAccessor: accessorPropsType,
  radius: accessorPropsType,
}

Circles.defaultProps = {
  type: "circle",
  radius: 5,
}

export default Circles
