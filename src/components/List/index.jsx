import React from "react"
import * as d3 from "d3"
import _ from "lodash"

import { useNewChartDimensions } from "../../providers/ChartDimensionsProvider"
import { useDataContext } from "../../providers/DataProvider"
import { useChartsContext } from "../../providers/ChartsProvider"

import "./style.css"

const formatNumber = d => _.isFinite(d) ? d3.format(",")(d) : "-"
const formatPercent = d => _.isFinite(d) ? d3.format(".2%")(d) : "-"

const List = (props) => {

  const [ref, dimensions] = useNewChartDimensions({
    marginBottom: 77,
  })
  const { selectedChartIndex, selectedColumnType, selectedColumn1, selectedColumn2, selectedItem1, selectedItem2 } = useDataContext()
  const { charts } = useChartsContext()
  const currentChart = charts[props.chartIndex]

  const numberOfCategories = 1 + currentChart.category2 ? 1 : 0 + currentChart.category3 ? 1 : 0
  const dataByCategory = Array.from(numberOfCategories === 1 ? d3.group(props.data, currentChart.category1Accessor) : d3.flatGroup(props.data, currentChart.category1Accessor, currentChart.category2Accessor, currentChart.category3Accessor))

  dataByCategory.forEach(categoryData => {
    switch (currentChart.valueSummarization) {
      case "sum": categoryData[numberOfCategories][currentChart.valueSummarization] = d3.sum(categoryData[numberOfCategories], currentChart.valueAccessor); break;
      case "average": categoryData[numberOfCategories][currentChart.valueSummarization] = d3.sum(d3.rollup(categoryData[numberOfCategories], v => d3.sum(v, currentChart.valueAccessor), currentChart.valueAccessor).values()) / categoryData[numberOfCategories].length; break;
      case "min": categoryData[numberOfCategories][currentChart.valueSummarization] = d3.min(categoryData[numberOfCategories], currentChart.valueAccessor); break;
      case "max": categoryData[numberOfCategories][currentChart.valueSummarization] = d3.max(categoryData[numberOfCategories], currentChart.valueAccessor); break;
      case "distinct": categoryData[numberOfCategories][currentChart.valueSummarization] = d3.group(categoryData[numberOfCategories], currentChart.valueAccessor).size; break;
      case "count": categoryData[numberOfCategories][currentChart.valueSummarization] = categoryData[numberOfCategories].length; break;
      case "median": categoryData[numberOfCategories][currentChart.valueSummarization] = d3.median(categoryData[numberOfCategories], currentChart.valueAccessor); break;
      default: null;
    }
  })

  const valueSummarizationAccessor = ([key, values]) => values[currentChart.valueSummarization]

  const orderedDataByCategory = _.orderBy(dataByCategory, valueSummarizationAccessor, "desc")

  const items = orderedDataByCategory
  const total = _.sumBy(items, valueSummarizationAccessor)

  return (
    <div className={`Chart__square ${props.zoomed ? 'zoomed' : props.active ? 'active' : ''} ${props.outOfFocus ? 'outOfFocus' : 'inFocus'}`} ref={ref}>
      <div className="SelectableList">
        <div className="SelectableList__column-headers">
          <div className="SelectableList__column-header">
            {currentChart.valueSummarization}
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
                `SelectableList__item--is-${selectedChartIndex == props.chartIndex && item[0] == selectedItem1 ? "selected" :
                  selectedChartIndex == props.chartIndex && selectedItem1 ? "next-to-selected" :
                    "not-selected"
                }`
              ].join(" ")}
              key={i}
              onMouseDown={!props.outOfFocus ? ((selectedColumnType == 'SingleValue' && selectedColumn1 == currentChart.category1 && selectedItem1 == item[0]) ? (e) => props.handleHighlightData(e, null, null, null, null, null, null) : (e) => props.handleHighlightData(e, props.chartIndex, 'SingleValue', currentChart.category1, null, item[0], null)) : null}>

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
                  width: `${item[numberOfCategories][currentChart.valueSummarization] * 100 / items[0][numberOfCategories][currentChart.valueSummarization]}%`,
                }} />
                <div className="SelectableList__item__value">
                  {formatNumber(item[numberOfCategories][currentChart.valueSummarization])}
                </div>
                <div className="SelectableList__item__value">
                  {formatPercent(item[numberOfCategories][currentChart.valueSummarization] / total)}
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