import React from "react"

import PropTypes from "prop-types"
import * as d3 from "d3"
import { accessorPropsType, callAccessor } from "./utils";
import { useTheme } from '@mui/material/styles';

import { useDataContext } from "../../providers/DataProvider"
import { useChartDimensions } from "./Chart";

const Circles = ({ outOfFocus, zoomed, type, data, keyAxisAccessor, xAxisAccessor, yAxisAccessor, tooltipValue1Title, tooltipValue1Value, tooltipValue2Title, tooltipValue2Value, tooltipValue1ValueFormat, tooltipValue2ValueFormat, xValue, yValue, handleHighlightData, xAxis, yAxis, chartIndex, radius }) => {
  const theme = useTheme();
  const dimensions = useChartDimensions()
  const { selectedChartIndex, selectedColumn1, selectedColumn2, selectedItem1, selectedItem2 } = useDataContext()

  const tooltip = d3.select(`#tooltipD3${zoomed ? 'zoomed' : ''}`)

  const handleMouseEnter = (e, d, i) => {
    const bounds = d3.select(e.target.parentElement)

    const dayDot = bounds.append("circle")
      .attr("class", "tooltipDot")
      .attr("cx", callAccessor(xAxisAccessor, d, i))
      .attr("cy", callAccessor(yAxisAccessor, d, i))
      .attr("r", 5)
      .style("fill", theme.vars.palette.primary.main)
      .style("pointer-events", "none")

    const tooltipValue1ValueFormatter = tooltipValue1ValueFormat === 'date' ? d3.timeFormat("%B %d, %Y") : tooltipValue1ValueFormat === 'time' ? d3.timeFormat("%H:%M") : d3.format(".2f")
    const tooltipValue2ValueFormatter = tooltipValue2ValueFormat === 'date' ? d3.timeFormat("%B %d, %Y") : tooltipValue2ValueFormat === 'time' ? d3.timeFormat("%H:%M") : d3.format(".2f")

    tooltip.select(`#tooltipD3${zoomed ? 'zoomed' : ''}-value1`)
      .text(tooltipValue1Title + ": " + tooltipValue1ValueFormatter(tooltipValue1Value(d)))

    tooltip.select(`#tooltipD3${zoomed ? 'zoomed' : ''}-value2`)
      .text(tooltipValue2Title + ": " + tooltipValue1ValueFormatter(tooltipValue2Value(d)))

    const x = dimensions.offsetLeft + 16 + dimensions.marginLeft + callAccessor(xAxisAccessor, d, i)
    const y = dimensions.offsetTop + 8 + dimensions.marginTop + callAccessor(yAxisAccessor, d, i)

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
      {data.map((d, i) => (
        <circle
          className={[
            `Circles Circle--type-${type}`,
            `Circles Circle--type-${type}--is-${selectedChartIndex == chartIndex && selectedItem1 === xValue(d, i) && selectedItem2 === yValue(d, i) ? "selected" :
              selectedChartIndex == chartIndex && selectedItem1 ? "next-to-selected" :
                "not-selected"
            }`
          ].join(" ")}
          key={keyAxisAccessor(d, i)}
          cx={typeof xAxisAccessor == "function" ? xAxisAccessor(d, i) : xAxisAccessor}
          cy={typeof yAxisAccessor == "function" ? yAxisAccessor(d, i) : yAxisAccessor}
          r={typeof radius == "function" ? radius(d, i) : radius}
          onMouseDown={!outOfFocus ? (selectedColumn1 == xAxis && selectedItem1 == xValue(d, i) && selectedColumn2 == yAxis && selectedItem2 == yValue(d, i) ? (e) => handleHighlightData(e, null, null, null, null, null, null) : (e) => handleHighlightData(e, chartIndex, 'MultipleValues', xAxis, yAxis, xValue(d, i), yValue(d, i))) : null}
          onMouseEnter={!outOfFocus ? (e => handleMouseEnter(e, d, i)) : null}
          onMouseLeave={!outOfFocus ? handleMouseLeave : null}
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
