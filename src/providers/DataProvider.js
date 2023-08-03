import React, { createContext, useContext } from 'react'
import * as d3 from "d3"
import _ from "lodash"

import data from '../../my_weather_data.json'

const DataContext = createContext()
export const useDataContext = () => useContext(DataContext)

const initialState = {
  selectedChartIndex: null,
  chosenChartIndex: null,
  selectedColumnType: null,
  selectedColumn1: null,
  selectedColumn2: null,
  selectedItem1: null,
  selectedItem2: null,
  selectedFormat1: null,
  selectedFormat2: null,
  highlightedData: _.map(data, (d) => {
    return {
      ...d,
      highlighted: true
    }
  }),
  data: data
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'highlight':
      const formatter = action.format1 ? d3.timeFormat(action.format1) : null
      return {
        ...state,
        selectedChartIndex: action.chartIndex,
        selectedColumnType: action.columnType,
        selectedColumn1: action.column1,
        selectedColumn2: action.column2,
        selectedItem1: action.item1,
        selectedItem2: action.item2,
        selectedFormat1: action.format1,
        selectedFormat2: action.format2,
        highlightedData: _.map(data, (d) => {
          return {
            ...d,
            highlighted:
              action.columnType === 'SingleValue' ? ((action.format1 ? formatter(action.item1) : action.item1) === d[action.column1] ? true : false) :
                action.columnType === 'MultipleValues' ? (d[action.column1] === action.item1 && d[action.column2] === action.item2 ? true : false) :
                  action.columnType === 'BinValues' ? (d[action.column1] >= d3.min([action.item1, action.item2]) && d[action.column1] < d3.max([action.item1, action.item2]) ? true : false) :
                    action.columnType === 'LastBinValues' ? (d[action.column1] >= d3.min([action.item1, action.item2]) && d[action.column1] <= d3.max([action.item1, action.item2]) ? true : false) :
                      true
          }
        })
      }
    case 'choose':
      return {
        ...state,
        chosenChartIndex: action.chosenChartIndex
      }
  }
}

const DataProvider = ({ children }) => {

  const [state, dispatch] = React.useReducer(reducer, initialState)

  const value = {
    selectedChartIndex: state.selectedChartIndex,
    chosenChartIndex: state.chosenChartIndex,
    selectedColumnType: state.selectedColumnType,
    selectedColumn1: state.selectedColumn1,
    selectedColumn2: state.selectedColumn2,
    selectedItem1: state.selectedItem1,
    selectedItem2: state.selectedItem2,
    selectedFormat1: state.selectedFormat1,
    selectedFormat2: state.selectedFormat2,
    highlightedData: state.highlightedData,
    data: state.data,
    setHighlightedData: (chartIndex, columnType, column1, column2, item1, item2, format1, format2) => { dispatch({ type: 'highlight', chartIndex, columnType, column1, column2, item1, item2, format1, format2 }) },
    setChosenChartIndex: (chosenChartIndex) => { dispatch({ type: 'choose', chosenChartIndex }) }
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export default DataProvider
