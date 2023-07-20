import React from "react"
import * as d3 from "d3"
import _ from "lodash"

import Chart from "../chart/Chart"
import { useChartDimensions, useUniqueId } from "../chart/utils"

import "./List.css"

const formatNumber = d => _.isFinite(d) ? d3.format(",")(d) : "-"
const formatPercent = d => _.isFinite(d) ? d3.format(".2%")(d) : "-"

const List = ({ zoomed, active, outOfFocus, data, selectedItem, selectedColumn, onMouseDown, category, value, categoryParser, valueParser, categoryFormat, valueFormat, valueSummarization }) => {

  const [ref, dimensions] = useChartDimensions({
    marginBottom: 77,
  })

  const [filterValue, setFilterValue] = React.useState("")
  const [filteredItems, setFilteredItems] = React.useState([])
  const [filteredTotal, setFilteredTotal] = React.useState(0)

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

  const keyAccessor = (d, i) => i

  const filterList = (value) => {
    console.log('orderedDataByCategory', orderedDataByCategory)
    console.log('value', value)
    let x = orderedDataByCategory
    const total = _.sumBy(x, valueSummarizationAccessor)
    if (!_.isEmpty(value)) x = _.filter(x, d => (d[0]).toLowerCase().includes(value.toLowerCase()))
    x = _.take(x, 100)

    setFilterValue(value)
    setFilteredItems(x)
    setFilteredTotal(total)
  }

  const onInputChange = e => {
    filterList(e.target.value)
  }

  const items = filterValue ? filteredItems : orderedDataByCategory
  const total = filteredTotal ? filteredTotal : _.sumBy(orderedDataByCategory, valueSummarizationAccessor)
  
  return (
    <div className={`Chart__square ${zoomed ? 'zoomed' : active ? 'active' : ''} ${outOfFocus ? 'outOfFocus' : 'inFocus'}`} ref={ref}>
      <div className="SelectableList">
        <input className="SelectableList__input" value={filterValue} placeholder={`Search for a ${category}`} onChange={onInputChange} />
        <div className="SelectableList__column-headers">
          <div className="SelectableList__column-header">
            Count
          </div>
          <div className="SelectableList__column-header">
            Percentage
          </div>
        </div>
        <div className="SelectableList__items">
          {_.map(items, (item, i) => (
            <div
              className={[
                "SelectableList__item",
                `SelectableList__item--is-${item[0] == selectedItem ? "selected" :
                  selectedItem ? "next-to-selected" :
                    "not-selected"
                }`
              ].join(" ")}
              key={i}
              onMouseDown={selectedColumn == category && selectedItem == item[0] ? (e) => onMouseDown(e, null, null) : (e) => onMouseDown(e, category, item[0])}>
              <div className="SelectableList__item__bar" style={{
                width: `${item[1][valueSummarization] * 100 / items[0][1][valueSummarization]}%`,
              }} />
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
                {formatPercent(item[1][valueSummarization] / total)}
              </div>

            </div>
          ))}
          {(data || []).length > (items || []).length && (
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