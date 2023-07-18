import React from "react"
import * as d3 from "d3"
import _ from "lodash"

import Chart from "../chart/Chart"
import { useChartDimensions, useUniqueId } from "../chart/utils"

import { useTheme } from '@mui/material/styles';

import "./List.css"

const formatNumber = d => _.isFinite(d) ? d3.format(",")(d) : "-"
const formatPercent = d => _.isFinite(d) ? d3.format(".2%")(d) : "-"

const List = ({ zoomed, active, outOfFocus, items, selectedItem, selectedColumn, onMouseDown, xAxis, yAxis, xAxisParser, xAxisFormat, yAxisSummarization }) => {

  const [ref, dimensions] = useChartDimensions({
    marginBottom: 77,
  })
  const theme = useTheme();
  const gradientColors = [theme.vars.palette.primary.main, theme.vars.palette.primary.contrastText]


  const [filterValue, setFilterValue] = React.useState("")
	const [filteredItems, setFilteredItems] = React.useState([])
	const [filteredTotal, setFilteredTotal] = React.useState(0)

	const filterList = (value) => {
		let x = items
		const total = _.sumBy(x, "count")
		if (!_.isEmpty(value)) x = _.filter(x, d => d.key.toLowerCase().includes(value))
		x = _.take(x, 100)

		setFilterValue(value)
		setFilteredItems(x)
		setFilteredTotal(total)
	}

	const onInputChange = e => {
		filterList(e.target.value)
	}

	React.useEffect(() => {
		filterList(filterValue)
	}, [items])



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
          {_.map(filteredItems, (item, i) => (
            <div
              className={[
                "SelectableList__item",
                `SelectableList__item--is-${item.key == selectedItem ? "selected" :
                  selectedItem ? "next-to-selected" :
                    "not-selected"
                }`
              ].join(" ")}
              key={i}
              onMouseDown={(e) => onMouseDown(e, selectedColumn, item.key)}>
              <div className="SelectableList__item__index">
                {item.index}
              </div>
              <div className="SelectableList__item__label">
                {item.key}
              </div>
              <div className="SelectableList__item__value">
                {formatNumber(item.count)}
              </div>
              <div className="SelectableList__item__value">
                {formatPercent(item.count / filteredTotal)}
              </div>
              <div className="SelectableList__item__bar" style={{
                width: `${item.count * 100 / filteredItems[0].count}%`,
              }} />
            </div>
          ))}
          {(items || []).length > (filteredItems || []).length && (
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