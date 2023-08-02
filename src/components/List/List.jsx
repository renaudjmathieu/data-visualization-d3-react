import React from "react"
import * as d3 from "d3"
import _ from "lodash"

import { useChartDimensions } from "../chart/utils"

import "./List.css"

const formatNumber = d => _.isFinite(d) ? d3.format(",")(d) : "-"
const formatPercent = d => _.isFinite(d) ? d3.format(".2%")(d) : "-"

const List = ({ zoomed, active, outOfFocus, data, selectedChart, chartId, selectedColumnType, selectedColumn1, selectedColumn2, selectedItem1, selectedItem2, onMouseDown, category1, category2, category3, value, category1Parser, category2Parser, category3Parser, valueParser, category1Type, category2Type, category3Type, valueType, valueSummarization }) => {

  const [ref, dimensions] = useChartDimensions({
    marginBottom: 77,
  })

  const numberOfCategories = 1 + category2 ? 1 : 0 + category3 ? 1 : 0

  const category1Accessor = d => d[category1]
  const category2Accessor = d => d[category2]
  const category3Accessor = d => d[category3]
  const valueAccessor = d => d[value]

  const dataByCategory = Array.from(numberOfCategories === 1 ? d3.group(data, category1Accessor) : d3.flatGroup(data, category1Accessor, category2Accessor, category3Accessor))

  dataByCategory.forEach(categoryData => {
    switch (valueSummarization) {
      case "sum": categoryData[numberOfCategories][valueSummarization] = d3.sum(categoryData[numberOfCategories], valueAccessor); break;
      case "average": categoryData[numberOfCategories][valueSummarization] = d3.sum(d3.rollup(categoryData[numberOfCategories], v => d3.sum(v, valueAccessor), valueAccessor).values()) / categoryData[numberOfCategories].length; break;
      case "min": categoryData[numberOfCategories][valueSummarization] = d3.min(categoryData[numberOfCategories], valueAccessor); break;
      case "max": categoryData[numberOfCategories][valueSummarization] = d3.max(categoryData[numberOfCategories], valueAccessor); break;
      case "distinct": categoryData[numberOfCategories][valueSummarization] = d3.group(categoryData[numberOfCategories], valueAccessor).size; break;
      case "count": categoryData[numberOfCategories][valueSummarization] = categoryData[numberOfCategories].length; break;
      case "median": categoryData[numberOfCategories][valueSummarization] = d3.median(categoryData[numberOfCategories], valueAccessor); break;
      default: null;
    }
  })

  const valueSummarizationAccessor = ([key, values]) => values[valueSummarization]

  const orderedDataByCategory = _.orderBy(dataByCategory, valueSummarizationAccessor, "desc")

  const items = orderedDataByCategory
  const total = _.sumBy(items, valueSummarizationAccessor)

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
                `SelectableList__item--is-${selectedChart == chartId && item[0] == selectedItem1 ? "selected" :
                  selectedChart == chartId && selectedItem1 ? "next-to-selected" :
                    "not-selected"
                }`
              ].join(" ")}
              key={i}
              onMouseDown={!outOfFocus ? ((selectedColumnType == 'SingleValue' && selectedColumn1 == category1 && selectedItem1 == item[0]) ? (e) => onMouseDown(e, null, null, null, null, null, null) : (e) => onMouseDown(e, chartId, 'SingleValue', category1, null, item[0], null)) : null}>

              <div className="SelectableList__item__left">

                <div className="SelectableList__item__label">
                  {item[0]}
                </div>

                {numberOfCategories >= 2 &&
                  <div className="SelectableList__item__label">
                    {item[1]}
                  </div>
                }

                {numberOfCategories === 3 &&
                  <div className="SelectableList__item__label">
                    {item[2]}
                  </div>
                }

              </div>

              <div className="SelectableList__item__right">

                <div className="SelectableList__item__bar" style={{
                  width: `${item[numberOfCategories][valueSummarization] * 100 / items[0][numberOfCategories][valueSummarization]}%`,
                }} />
                <div className="SelectableList__item__value">
                  {formatNumber(item[numberOfCategories][valueSummarization])}
                </div>
                <div className="SelectableList__item__value">
                  {formatPercent(item[numberOfCategories][valueSummarization] / total)}
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