import React from "react"
import * as d3 from "d3"
import _ from "lodash"

import { useNewChartDimensions } from "../../providers/ChartDimensionsProvider"
import { useDataContext, summarizationAvailable } from "../../providers/DataProvider"
import { useChartsContext } from "../../providers/ChartsProvider"

import "./style.css"

const formatAverage = d => _.isFinite(d) ? d3.format(".2f")(d) : "-"
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

  const items = _.orderBy(dataByCategory, valueSummarizationAccessor, "desc")

  let total = 0
  switch (currentChart.valueSummarization) {
    case "sum": total = d3.sum(props.data, currentChart.valueAccessor); break;
    case "average": total = d3.sum(d3.rollup(props.data, v => d3.sum(v, currentChart.valueAccessor), currentChart.valueAccessor).values()) / props.data.length; break;
    case "min": total = d3.min(props.data, currentChart.valueAccessor); break;
    case "max": total = d3.max(props.data, currentChart.valueAccessor); break;
    case "distinct": total = d3.group(props.data, currentChart.valueAccessor).size; break;
    case "count": total = props.data.length; break;
    case "median": total = d3.median(props.data, currentChart.valueAccessor); break;
    default: null;
  }

  return (
    <div className={`Chart__square ${props.styleName}`} ref={ref}>
      <div className="SelectableList">
        <div className="SelectableList__column-headers">
          <div className="SelectableList__column-header-middle">
            {summarizationAvailable.find(summarization => summarization.id === currentChart.valueSummarization).name}
          </div>
          <div className="SelectableList__column-header-right">
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
              onMouseDown={props.interactable ? ((selectedColumnType == 'SingleValue' && selectedColumn1 == currentChart.category1 && selectedItem1 == item[0]) ? (e) => props.handleHighlightData(e, null, null, null, null, null, null) : (e) => props.handleHighlightData(e, props.chartIndex, 'SingleValue', currentChart.category1, null, item[0], null)) : null}>

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
                  {item[numberOfCategories][currentChart.valueSummarization] % 1 !== 0 ? formatAverage(item[numberOfCategories][currentChart.valueSummarization]) : formatNumber(item[numberOfCategories][currentChart.valueSummarization])}
                </div>
                <div className="SelectableList__item__value">
                  {formatPercent(item[numberOfCategories][currentChart.valueSummarization] / total)}
                </div>

              </div>

            </div>
          ))}
        </div>

        <div className="SelectableList__column-footers">
          <div className="SelectableList__column-footer-left">
            Total
          </div>
          <div className="SelectableList__column-footer-middle">
            {total % 1 !== 0 ? formatAverage(total) : formatNumber(total)}
          </div>
          <div className="SelectableList__column-footer-right">
            100.00%
          </div>
        </div>

      </div>
    </div>
  )
}

export default List