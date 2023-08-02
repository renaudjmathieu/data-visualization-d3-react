import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"
import { accessorPropsType, callAccessor } from "./utils";
import { useTheme } from '@mui/material/styles';

const Circles = ({outOfFocus, zoomed, type, data, dimensions, keyAccessor, xAccessor, yAccessor, tooltipValue1Title, tooltipValue1Value, tooltipValue2Title, tooltipValue2Value, tooltipValue1ValueFormat, tooltipValue2ValueFormat, xValue, yValue, onMouseDown, xAxis, yAxis, selectedChart, chartId, selectedColumnType, selectedColumn1, selectedColumn2, selectedItem1, selectedItem2, radius }) => {

  const tooltip = d3.select(`#tooltipD3${zoomed ? 'zoomed' : ''}`)
  const theme = useTheme();

  const handleMouseEnter = (e, d, i) => {
    const bounds = d3.select(e.target.parentElement)

    const dayDot = bounds.append("circle")
      .attr("class", "tooltipDot")
      .attr("cx", callAccessor(xAccessor, d, i))
      .attr("cy", callAccessor(yAccessor, d, i))
      .attr("r", 5)
      .style("fill", theme.vars.palette.primary.main)
      .style("pointer-events", "none")

    const tooltipValue1ValueFormatter = tooltipValue1ValueFormat === 'date' ? d3.timeFormat("%B %d, %Y") : tooltipValue1ValueFormat === 'time' ? d3.timeFormat("%H:%M") : d3.format(".2f")
    const tooltipValue2ValueFormatter = tooltipValue2ValueFormat === 'date' ? d3.timeFormat("%B %d, %Y") : tooltipValue2ValueFormat === 'time' ? d3.timeFormat("%H:%M") : d3.format(".2f")

    tooltip.select(`#tooltipD3${zoomed ? 'zoomed' : ''}-value1`)
      .text(tooltipValue1Title + ": " + tooltipValue1ValueFormatter(tooltipValue1Value(d)))

    tooltip.select(`#tooltipD3${zoomed ? 'zoomed' : ''}-value2`)
      .text(tooltipValue2Title + ": " + tooltipValue1ValueFormatter(tooltipValue2Value(d)))

    const x = dimensions.offsetLeft + 16 + dimensions.marginLeft + callAccessor(xAccessor, d, i)
    const y = dimensions.offsetTop + 8 + dimensions.marginTop + callAccessor(yAccessor, d, i)

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
            `Circles Circle--type-${type}--is-${selectedChart == chartId && selectedItem1 === xValue(d, i) && selectedItem2 === yValue(d, i) ? "selected" :
              selectedChart == chartId && selectedItem1 ? "next-to-selected" :
                "not-selected"
            }`
          ].join(" ")}
          key={keyAccessor(d, i)}
          cx={typeof xAccessor == "function" ? xAccessor(d, i) : xAccessor}
          cy={typeof yAccessor == "function" ? yAccessor(d, i) : yAccessor}
          r={typeof radius == "function" ? radius(d, i) : radius}
          onMouseDown={!outOfFocus ? (selectedColumn1 == xAxis && selectedItem1 == xValue(d, i) && selectedColumn2 == yAxis && selectedItem2 == yValue(d, i) ? (e) => onMouseDown(e, null, null, null, null, null, null) : (e) => onMouseDown(e, chartId, 'MultipleValues', xAxis, yAxis, xValue(d, i), yValue(d, i))) : null}
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
  keyAccessor: accessorPropsType,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  radius: accessorPropsType,
}

Circles.defaultProps = {
  type: "circle",
  radius: 5,
}

export default Circles
