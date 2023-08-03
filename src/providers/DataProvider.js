import React, { createContext, useContext } from 'react'
import * as d3 from "d3"
import _ from "lodash"

import data from '../../my_weather_data.json'

const DataContext = createContext()
export const useDataContext = () => useContext(DataContext)

const initialState = {
  selectedChartIndex: null,
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

const actions = {
  SET_SELECTED_CHART_INDEX: 'SET_SELECTED_CHART_INDEX',
  SET_SELECTED_COLUMN_TYPE: 'SET_SELECTED_COLUMN_TYPE',
  SET_SELECTED_COLUMN_1: 'SET_SELECTED_COLUMN_1',
  SET_SELECTED_COLUMN_2: 'SET_SELECTED_COLUMN_2',
  SET_SELECTED_ITEM_1: 'SET_SELECTED_ITEM_1',
  SET_SELECTED_ITEM_2: 'SET_SELECTED_ITEM_2',
  SET_SELECTED_FORMAT_1: 'SET_SELECTED_FORMAT_1',
  SET_SELECTED_FORMAT_2: 'SET_SELECTED_FORMAT_2',
  SET_FILTERED_DATA: 'SET_FILTERED_DATA',
}

const reducer = (state, action) => {
  switch (action.type) {
    case actions.SET_SELECTED_CHART_INDEX:
      return { ...state, selectedChartIndex: action.value }
    case actions.SET_SELECTED_COLUMN_TYPE:
      return { ...state, selectedColumnType: action.value }
    case actions.SET_SELECTED_COLUMN_1:
      return { ...state, selectedColumn1: action.value }
    case actions.SET_SELECTED_COLUMN_2:
      return { ...state, selectedColumn2: action.value }
    case actions.SET_SELECTED_ITEM_1:
      return { ...state, selectedItem1: action.value }
    case actions.SET_SELECTED_ITEM_2:
      return { ...state, selectedItem2: action.value }
    case actions.SET_SELECTED_FORMAT_1:
      return { ...state, selectedFormat1: action.value }
    case actions.SET_SELECTED_FORMAT_2:
      return { ...state, selectedFormat2: action.value }
    case actions.SET_FILTERED_DATA:
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
  }
}

const DataProvider = ({ children }) => {

  const [state, dispatch] = React.useReducer(reducer, initialState)

  const value = {
    selectedChartIndex: state.selectedChartIndex,
    selectedColumnType: state.selectedColumnType,
    selectedColumn1: state.selectedColumn1,
    selectedColumn2: state.selectedColumn2,
    selectedItem1: state.selectedItem1,
    selectedItem2: state.selectedItem2,
    selectedFormat1: state.selectedFormat1,
    selectedFormat2: state.selectedFormat2,
    highlightedData: state.highlightedData,
    data: state.data,

    setSelectedChartIndex: (value) => { dispatch({ type: actions.SET_SELECTED_CHART_INDEX, value }) },
    setSelectedColumnType: (value) => { dispatch({ type: actions.SET_SELECTED_COLUMN_TYPE, value }) },
    setSelectedColumn1: (value) => { dispatch({ type: actions.SET_SELECTED_COLUMN_1, value }) },
    setSelectedColumn2: (value) => { dispatch({ type: actions.SET_SELECTED_COLUMN_2, value }) },
    setSelectedItem1: (value) => { dispatch({ type: actions.SET_SELECTED_ITEM_1, value }) },
    setSelectedItem2: (value) => { dispatch({ type: actions.SET_SELECTED_ITEM_2, value }) },
    setSelectedFormat1: (value) => { dispatch({ type: actions.SET_SELECTED_FORMAT_1, value }) },
    setSelectedFormat2: (value) => { dispatch({ type: actions.SET_SELECTED_FORMAT_2, value }) },
    setFilteredData: (chartIndex, columnType, column1, column2, item1, item2, format1, format2) => { dispatch({ type: actions.SET_FILTERED_DATA, chartIndex, columnType, column1, column2, item1, item2, format1, format2 }) },
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export default DataProvider
