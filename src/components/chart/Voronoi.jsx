import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"
import { accessorPropsType, callAccessor } from "./utils";
import { dimensionsPropsType } from "./utils";
import { useTheme } from '@mui/material/styles';

const Voronoi = ({ zoomed, data, dimensions, xAccessor, yAccessor, tooltipValue1Title, tooltipValue1Value, tooltipValue2Title, tooltipValue2Value, tooltipValue1ValueFormat, tooltipValue2ValueFormat }) => {
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

  const delaunay = d3.Delaunay.from(
    data,
    xAccessor,
    yAccessor,
  )
  const voronoi = delaunay.voronoi()
  voronoi.xmax = dimensions.boundedWidth
  voronoi.ymax = dimensions.boundedHeight

  return <React.Fragment>
    {data.map((d, i) => (
      <path
        className="voronoi"
        d={voronoi.renderCell(i)}
        onMouseEnter={e => handleMouseEnter(e, d, i)}
        onMouseLeave={handleMouseLeave}
      />
    ))}
  </React.Fragment>
}

export default Voronoi
