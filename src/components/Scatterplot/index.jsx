import React from "react"
import * as d3 from "d3"

import { useNewChartDimensions, Chart } from "../../providers/ChartDimensionsProvider"
import { callAccessor } from "../../utils"
import { useChartsContext } from "../../providers/ChartsProvider"
import { useDataContext } from "../../providers/DataProvider"

import Axis from "../Axis"

import "./style.css"

const ScatterPlot = (props) => {

  const { selectedChartIndex, selectedColumn1, selectedColumn2, selectedItem1, selectedItem2 } = useDataContext()
  const { charts } = useChartsContext()
  const currentChart = charts[props.chartIndex]

  const [ref, dimensions] = useNewChartDimensions({
    marginBottom: 67 - (currentChart.xAxisType == 'number' ? 30 : 0) - props.marginPadding,
    marginLeft: 38 - props.marginPadding,
    marginRight: 10 - props.marginPadding,
    marginTop: 20 - props.marginPadding,
  })

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

  const handleMouseEnter = (e, d, i) => {
    const tooltipValue1ValueFormatter = currentChart.xAxisType === 'date' ? d3.timeFormat("%B %d, %Y") : currentChart.xAxisType === 'time' ? d3.timeFormat("%H:%M") : d3.format(".2f")
    const tooltipValue2ValueFormatter = currentChart.yAxisType === 'date' ? d3.timeFormat("%B %d, %Y") : currentChart.yAxisType === 'time' ? d3.timeFormat("%H:%M") : d3.format(".2f")

    props.handleShowTooltip(e, [
      {
        label: currentChart.xAxis.charAt(0).toUpperCase() + currentChart.xAxis.slice(1).replace(/([A-Z])/g, ' $1'),
        value: tooltipValue1ValueFormatter(currentChart.xAxisAccessor(d))
      },
      {
        label: currentChart.yAxis.charAt(0).toUpperCase() + currentChart.yAxis.slice(1).replace(/([A-Z])/g, ' $1'),
        value: tooltipValue2ValueFormatter(currentChart.yAxisAccessor(d)),
      },
    ],
      dimensions.offsetLeft + 16 + dimensions.marginLeft + callAccessor(xAxisAccessorScaled, d, i),
      dimensions.offsetTop + 8 + dimensions.marginTop + callAccessor(yAxisAccessorScaled, d, i)
    )
  }

  return (
    <div className={`Chart__square ${props.styleName}`} ref={ref}>
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
        {props.interactable && props.data.map((d, i) => (
          <path
            className="voronoi"
            d={voronoi.renderCell(i)}
            onMouseEnter={e => handleMouseEnter(e, d, i)}
            onMouseLeave={props.handleHideTooltip}
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
            onMouseDown={props.interactable ? (selectedColumn1 == currentChart.xAxis && selectedItem1 == currentChart.xAxisAccessor(d, i) && selectedColumn2 == currentChart.yAxis && selectedItem2 == currentChart.yAxisAccessor(d, i) ? (e) => props.handleHighlightData(e, null, null, null, null, null, null) : (e) => props.handleHighlightData(e, props.chartIndex, 'MultipleValues', currentChart.xAxis, currentChart.yAxis, currentChart.xAxisAccessor(d, i), currentChart.yAxisAccessor(d, i))) : null}
            onMouseEnter={props.interactable ? e => handleMouseEnter(e, d, i) : null}
            onMouseLeave={props.interactable ? props.handleHideTooltip : null}
          />
        ))}
      </Chart>
    </div>
  )
}

export default ScatterPlot
