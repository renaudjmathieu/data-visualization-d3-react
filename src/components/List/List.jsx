import React from "react"
import * as d3 from "d3"
import _ from "lodash"

import { useChartDimensions } from "../chart/utils"

import "./List.css"

const formatNumber = d => _.isFinite(d) ? d3.format(",")(d) : "-"
const formatPercent = d => _.isFinite(d) ? d3.format(".2%")(d) : "-"

const List = ({ zoomed, active, outOfFocus, data, selectedChart, chartIndex, selectedColumnType, selectedColumn1, selectedColumn2, selectedItem1, selectedItem2, onMouseDown, category, value, categoryParser, valueParser, categoryType, valueType, valueSummarization }) => {

  const [ref, dimensions] = useChartDimensions({
    marginBottom: 77,
  })

  const categoryAccessor = d => d[category]
  const valueAccessor = d => d[value]

  const dataByCategory = Array.from(d3.group(data, categoryAccessor))

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

  const orderedDataByCategory = _.orderBy(dataByCategory, valueSummarizationAccessor, "desc")


  const items = orderedDataByCategory
  const total = _.sumBy(orderedDataByCategory, valueSummarizationAccessor)

  return (
    <div className={`Chart__square ${zoomed ? 'zoomed' : active ? 'active' : ''} ${outOfFocus ? 'outOfFocus' : 'inFocus'}`} ref={ref}>
      <div className="SelectableList">
        <div className="SelectableList__column-headers">
          <div className="SelectableList__column-header">
            {valueSummarization}
          </div>
          <div className="SelectableList__column-header">
            %GT
          </div>
        </div>
        <div className="SelectableList__items">
          {_.map(items, (item, i) => (
            <div
              className={[
                "SelectableList__item",
                `SelectableList__item--is-${selectedChart == chartIndex && item[0] == selectedItem1 ? "selected" :
                  selectedChart == chartIndex && selectedItem1 ? "next-to-selected" :
                    "not-selected"
                }`
              ].join(" ")}
              key={i}
              onMouseDown={(selectedColumnType == 'SingleValue' && selectedColumn1 == category && selectedItem1 == item[0]) ? (e) => onMouseDown(e, null, null, null, null, null, null) : (e) => onMouseDown(e, chartIndex, 'SingleValue', category, null, item[0], null)}>

              <div className="SelectableList__item__left">

                <div className="SelectableList__item__label">
                  {item[0]}
                </div>

              </div>

              <div className="SelectableList__item__right">

                <div className="SelectableList__item__bar" style={{
                  width: `${item[1][valueSummarization] * 100 / items[0][1][valueSummarization]}%`,
                }} />
                <div className="SelectableList__item__value">
                  {formatNumber(item[1][valueSummarization])}
                </div>
                <div className="SelectableList__item__value">
                  {formatPercent(item[1][valueSummarization] / total)}
                </div>

              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default List