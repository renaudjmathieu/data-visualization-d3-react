import React from "react"
import * as d3 from "d3"

import { useTheme } from '@mui/material/styles';
import { useNewChartDimensions, Chart } from "../providers/ChartDimensionsProvider"
import { callAccessor } from "../utils"
import { useChartsContext } from "../providers/ChartsProvider"
import { useDataContext } from "../providers/DataProvider"

import Axis from "./Axis"

const ScatterPlot = (props) => {

  const theme = useTheme();
  const { selectedChartIndex, selectedColumn1, selectedColumn2, selectedItem1, selectedItem2 } = useDataContext()
  const [ref, dimensions] = useNewChartDimensions({
    marginBottom: 77
  })
  const { charts } = useChartsContext()
  const currentChart = charts[props.chartIndex]

  const xScale = d3.scaleLinear()
    .domain(d3.extent(props.data, currentChart.xAxisAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()

  const yScale = d3.scaleLinear()
    .domain(d3.extent(props.data, currentChart.yAxisAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()

  const xAxisAccessorScaled = d => xScale(currentChart.xAxisAccessor(d))
  const yAxisAccessorScaled = d => yScale(currentChart.yAxisAccessor(d))
  const keyAxisAccessor = (d, i) => i

  const delaunay = d3.Delaunay.from(
    props.data,
    xAxisAccessorScaled,
    yAxisAccessorScaled,
  )
  const voronoi = delaunay.voronoi()
  voronoi.xmax = dimensions.boundedWidth
  voronoi.ymax = dimensions.boundedHeight

  const tooltip = d3.select(`#tooltipD3${props.zoomed ? 'zoomed' : ''}`)

  const handleMouseEnter = (e, d, i) => {
    const bounds = d3.select(e.target.parentElement)

    const dayDot = bounds.append("circle")
      .attr("class", "tooltipDot")
      .attr("cx", callAccessor(xAxisAccessorScaled, d, i))
      .attr("cy", callAccessor(yAxisAccessorScaled, d, i))
      .attr("r", 5)
      .style("fill", theme.vars.palette.primary.main)
      .style("pointer-events", "none")

    const tooltipValue1ValueFormatter = currentChart.xAxisType === 'date' ? d3.timeFormat("%B %d, %Y") : currentChart.xAxisType === 'time' ? d3.timeFormat("%H:%M") : d3.format(".2f")
    const tooltipValue2ValueFormatter = currentChart.yAxisType === 'date' ? d3.timeFormat("%B %d, %Y") : currentChart.yAxisType === 'time' ? d3.timeFormat("%H:%M") : d3.format(".2f")

    tooltip.select(`#tooltipD3${props.zoomed ? 'zoomed' : ''}-value1`)
      .text(currentChart.xAxis.charAt(0).toUpperCase() + currentChart.xAxis.slice(1).replace(/([A-Z])/g, ' $1') + ": " + tooltipValue1ValueFormatter(currentChart.xAxisAccessor(d)))

    tooltip.select(`#tooltipD3${props.zoomed ? 'zoomed' : ''}-value2`)
      .text(currentChart.yAxis.charAt(0).toUpperCase() + currentChart.yAxis.slice(1).replace(/([A-Z])/g, ' $1') + ": " + tooltipValue1ValueFormatter(currentChart.yAxisAccessor(d)))

    const x = dimensions.offsetLeft + 16 + dimensions.marginLeft + callAccessor(xAxisAccessorScaled, d, i)
    const y = dimensions.offsetTop + 8 + dimensions.marginTop + callAccessor(yAxisAccessorScaled, d, i)

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

    d3.selectAll(".tooltipDot")
      .remove()
    tooltip.style("opacity", 0)
  }

  return (
    <div className={`Chart__square ${props.zoomed ? 'zoomed' : props.active ? 'active' : ''} ${props.outOfFocus ? 'outOfFocus' : 'inFocus'}`} ref={ref}>
      <Chart dimensions={dimensions}>
        <Axis
          dimension="x"
          scale={xScale}
          label={currentChart.xAxis.charAt(0).toUpperCase() + currentChart.xAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          format={currentChart.xAxisType}
        />
        <Axis
          dimension="y"
          scale={yScale}
          label={currentChart.yAxis.charAt(0).toUpperCase() + currentChart.yAxis.slice(1).replace(/([A-Z])/g, ' $1')}
          format={currentChart.yAxisType}
        />
        {!props.outOfFocus && props.data.map((d, i) => (
          <path
            className="voronoi"
            d={voronoi.renderCell(i)}
            onMouseEnter={(e => handleMouseEnter(e, d, i))}
            onMouseLeave={handleMouseLeave}
          />
        ))}
        {props.data.map((d, i) => (
          <circle
            className={[
              `Circles Circle--type-circle`,
              `Circles Circle--type-circle--is-${selectedChartIndex == props.chartIndex && selectedItem1 === currentChart.xAxisAccessor(d, i) && selectedItem2 === currentChart.yAxisAccessor(d, i) ? "selected" :
                selectedChartIndex == props.chartIndex && selectedItem1 ? "next-to-selected" :
                  "not-selected"
              }`
            ].join(" ")}
            key={keyAxisAccessor(d, i)}
            cx={callAccessor(xAxisAccessorScaled(d, i))}
            cy={callAccessor(yAxisAccessorScaled(d, i))}
            r={5}
            onMouseDown={!props.outOfFocus ? (selectedColumn1 == currentChart.xAxis && selectedItem1 == currentChart.xAxisAccessor(d, i) && selectedColumn2 == currentChart.yAxis && selectedItem2 == currentChart.yAxisAccessor(d, i) ? (e) => props.handleHighlightData(e, null, null, null, null, null, null) : (e) => props.handleHighlightData(e, props.chartIndex, 'MultipleValues', currentChart.xAxis, currentChart.yAxis, currentChart.xAxisAccessor(d, i), currentChart.yAxisAccessor(d, i))) : null}
            onMouseEnter={!props.outOfFocus ? (e => handleMouseEnter(e, d, i)) : null}
            onMouseLeave={!props.outOfFocus ? handleMouseLeave : null}
          />
        ))}
      </Chart>
    </div>
  )
}

export default ScatterPlot
