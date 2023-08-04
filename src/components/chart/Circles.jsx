import React from "react"

import PropTypes from "prop-types"
import * as d3 from "d3"
import { accessorPropsType, callAccessor } from "./utils";
import { useTheme } from '@mui/material/styles';

import { useChartDimensions } from "./Chart";
import { useDataContext } from "../../providers/DataProvider"
import { useChartsContext } from "../../providers/ChartsProvider";


const Circles = (props) => {
  const theme = useTheme();
  const dimensions = useChartDimensions()
  const { selectedChartIndex, selectedColumn1, selectedColumn2, selectedItem1, selectedItem2 } = useDataContext()
  const { charts } = useChartsContext()
  const currentChart = charts[props.chartIndex]

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

    const tooltipValue1ValueFormatter = currentChart.xAxisType === 'date' ? d3.timeFormat("%B %d, %Y") : currentChart.xAxisType === 'time' ? d3.timeFormat("%H:%M") : d3.format(".2f")
    const tooltipValue2ValueFormatter = currentChart.yAxisType === 'date' ? d3.timeFormat("%B %d, %Y") : currentChart.yAxisType === 'time' ? d3.timeFormat("%H:%M") : d3.format(".2f")

    tooltip.select(`#tooltipD3${props.zoomed ? 'zoomed' : ''}-value1`)
      .text(currentChart.xAxis.charAt(0).toUpperCase() + currentChart.xAxis.slice(1).replace(/([A-Z])/g, ' $1') + ": " + tooltipValue1ValueFormatter(currentChart.xAxisAccessor(d)))

    tooltip.select(`#tooltipD3${props.zoomed ? 'zoomed' : ''}-value2`)
      .text(currentChart.yAxis.charAt(0).toUpperCase() + currentChart.yAxis.slice(1).replace(/([A-Z])/g, ' $1') + ": " + tooltipValue1ValueFormatter(currentChart.yAxisAccessor(d)))

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
            `Circles Circle--type-${props.type}--is-${selectedChartIndex == props.chartIndex && selectedItem1 === currentChart.xAxisAccessor(d, i) && selectedItem2 === currentChart.yAxisAccessor(d, i) ? "selected" :
              selectedChartIndex == props.chartIndex && selectedItem1 ? "next-to-selected" :
                "not-selected"
            }`
          ].join(" ")}
          key={props.keyAxisAccessor(d, i)}
          cx={typeof props.xAxisAccessor == "function" ? props.xAxisAccessor(d, i) : props.xAxisAccessor}
          cy={typeof props.yAxisAccessor == "function" ? props.yAxisAccessor(d, i) : props.yAxisAccessor}
          r={typeof props.radius == "function" ? props.radius(d, i) : props.radius}
          onMouseDown={!props.outOfFocus ? (selectedColumn1 == currentChart.xAxis && selectedItem1 == currentChart.xAxisAccessor(d, i) && selectedColumn2 == currentChart.yAxis && selectedItem2 == currentChart.yAxisAccessor(d, i) ? (e) => props.handleHighlightData(e, null, null, null, null, null, null) : (e) => props.handleHighlightData(e, props.chartIndex, 'MultipleValues', currentChart.xAxis, currentChart.yAxis, currentChart.xAxisAccessor(d, i), currentChart.yAxisAccessor(d, i))) : null}
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
