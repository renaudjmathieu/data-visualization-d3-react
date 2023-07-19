import React from "react"
import * as d3 from "d3"
import _ from "lodash"

import Chart from "../chart/Chart"
import { useChartDimensions, useUniqueId } from "../chart/utils"

import { useTheme } from '@mui/material/styles';

import "./List.css"

const formatNumber = d => _.isFinite(d) ? d3.format(",")(d) : "-"
const formatPercent = d => _.isFinite(d) ? d3.format(".2%")(d) : "-"

const List = ({ zoomed, active, outOfFocus, data, selectedItem, selectedColumn, onMouseDown, category, value, categoryParser, valueParser, categoryFormat, valueFormat, valueSummarization }) => {

  const [ref, dimensions] = useChartDimensions({
    marginBottom: 77,
  })
  const theme = useTheme();

  const gradientColors = [theme.vars.palette.primary.main, theme.vars.palette.primary.contrastText]
  const gradientId = useUniqueId("Histogram-gradient")

  const categoryAccessor = d => d[category]
  const valueAccessor = d => d[value]

  const numberOfThresholds = 8
  const dataByCategory = Array.from(d3.group(data, categoryAccessor))
  const combinedDataByCategory = [
    ...dataByCategory.slice(0, numberOfThresholds),
    [
      "other",
      d3.merge(dataByCategory.slice(numberOfThresholds).map(d => d[1]))
    ]
  ]

  dataByCategory.forEach(categoryData => {
    switch (valueSummarization) {
      case "sum": categoryData[1][valueSummarization] = d3.sum(categoryData[1], valueAccessor); break;
      case "average": categoryData[1][valueSummarization] = d3.sum(d3.rollup(categoryData[1], v => d3.sum(v, valueAccessor), valueAccessor).values()) / categoryData[1].length; break;
      case "min": categoryData[1][valueSummarization] = d3.min(categoryData[1], valueAccessor); break;
      case "max": categoryData[1][valueSummarization] = d3.max(categoryData[1], valueAccessor); break;
      case "distinct": categoryData[1][valueSummarization] = d3.group(categoryData[1], valueAccessor).size; break;
      case "count": categoryData[1][valueSummarization] = categoryData[1].length; break;
      case "median": categoryData[1][valueSummarization] = d3.median(categoryData[1], valueAccessor); break;
      default: null;
    }
  })

  const valueSummarizationAccessor = ([key, values]) => values[valueSummarization]


  const onInputChange = e => {
		console.log('todo')
	}

  const keyAccessor = (d, i) => i

  console.log('dataByCategory', dataByCategory)

  const filterValue = "euhhhh"

  return (
    <div className={`Chart__square ${zoomed ? 'zoomed' : active ? 'active' : ''} ${outOfFocus ? 'outOfFocus' : 'inFocus'}`} ref={ref}>
      <div className="SelectableList">
        <input className="SelectableList__input" value={filterValue} placeholder={`Search for a ${selectedColumn}`} onChange={onInputChange} />
        <div className="SelectableList__column-headers">
          <div className="SelectableList__column-header">
            Count
          </div>
          <div className="SelectableList__column-header">
            Percentage
          </div>
        </div>
        <div className="SelectableList__items">
          {_.map(dataByCategory, (item, i) => (
            <div
              className={[
                "SelectableList__item",
                `SelectableList__item--is-${item[0] == selectedItem ? "selected" :
                  selectedItem ? "next-to-selected" :
                    "not-selected"
                }`
              ].join(" ")}
              key={i}
              onMouseDown={(e) => onMouseDown(e, selectedColumn, item[0])}>
              <div className="SelectableList__item__index">
                0
              </div>
              <div className="SelectableList__item__label">
                {item[0]}
              </div>
              <div className="SelectableList__item__value">
                {formatNumber(item[1][valueSummarization])}
              </div>
              <div className="SelectableList__item__value">
                100
              </div>
              <div className="SelectableList__item__bar" style={{
                width: `70%`,
              }} />
            </div>
          ))}
          {(data || []).length > (dataByCategory || []).length && (
            <div className="SelectableList__note">
              Change search for more results
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default List