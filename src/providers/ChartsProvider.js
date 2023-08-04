import React, { createContext, useContext } from 'react'
import { chartsAvailable, fieldsAvailable } from "./DataProvider"

import * as d3 from 'd3'

const ChartsContext = createContext()
export const useChartsContext = () => useContext(ChartsContext)

const AddAdditionalFields = (chart) => {
  const xAxisType = chart.xAxis ? fieldsAvailable.find(field => field.id === chart.xAxis).type : null
  const yAxisType = chart.yAxis ? fieldsAvailable.find(field => field.id === chart.yAxis).type : null
  const category1Type = chart.category1 ? fieldsAvailable.find(field => field.id === chart.category1).type : null
  const category2Type = chart.category2 ? fieldsAvailable.find(field => field.id === chart.category2).type : null
  const category3Type = chart.category3 ? fieldsAvailable.find(field => field.id === chart.category3).type : null
  const valueType = chart.value ? fieldsAvailable.find(field => field.id === chart.value).type : null

  const xAxisFormat = chart.xAxis ? fieldsAvailable.find(field => field.id === chart.xAxis).format : null
  const yAxisFormat = chart.yAxis ? fieldsAvailable.find(field => field.id === chart.yAxis).format : null
  const category1Format = chart.category1 ? fieldsAvailable.find(field => field.id === chart.category1).format : null
  const category2Format = chart.category2 ? fieldsAvailable.find(field => field.id === chart.category2).format : null
  const category3Format = chart.category3 ? fieldsAvailable.find(field => field.id === chart.category3).format : null
  const valueFormat = chart.value ? fieldsAvailable.find(field => field.id === chart.value).format : null

  const xAxisParser = xAxisFormat ? d3.timeParse(xAxisFormat) : null
  const yAxisParser = yAxisFormat ? d3.timeParse(yAxisFormat) : null
  const category1Parser = category1Format ? d3.timeParse(category1Format) : null
  const category2Parser = category2Format ? d3.timeParse(category2Format) : null
  const category3Parser = category3Format ? d3.timeParse(category3Format) : null
  const valueParser = valueFormat ? d3.timeParse(valueFormat) : null

  const xAxisAccessor = xAxisParser ? d => xAxisParser(d[chart.xAxis]) : d => d[chart.xAxis]
  const yAxisAccessor = yAxisParser ? d => yAxisParser(d[chart.yAxis]) : d => d[chart.yAxis]
  const category1Accessor = category1Parser ? d => category1Parser(d[chart.category1]) : d => d[chart.category1]
  const category2Accessor = category2Parser ? d => category2Parser(d[chart.category2]) : d => d[chart.category2]
  const category3Accessor = category3Parser ? d => category3Parser(d[chart.category3]) : d => d[chart.category3]
  const valueAccessor = valueParser ? d => valueParser(d[chart.value]) : d => d[chart.value]

  return {
    ...chart,
    xAxisType,
    yAxisType,
    category1Type,
    category2Type,
    category3Type,
    valueType,
    xAxisFormat,
    yAxisFormat,
    category1Format,
    category2Format,
    category3Format,
    valueFormat,
    xAxisParser,
    yAxisParser,
    category1Parser,
    category2Parser,
    category3Parser,
    valueParser,
    xAxisAccessor,
    yAxisAccessor,
    category1Accessor,
    category2Accessor,
    category3Accessor,
    valueAccessor
  }
}

const initialState = chartsAvailable.filter(chart => ['scatter', 'histogram', 'timeline', 'list'].includes(chart.type)).map((chart) => {
  return {
    ...AddAdditionalFields(chart)
  }
})

const reducer = (state, action) => {
  switch (action.type) {
    case 'add':
      return [...state, AddAdditionalFields(chartsAvailable[Math.floor(Math.random() * chartsAvailable.length)])]
    case 'replace':
      return state.map((c, i) => i === action.index ? { ...c, type: action.chartType } : c)
    case 'remove':
      return state.filter((c, i) => i !== action.index)
    case 'removeLast':
      return state.slice(0, -1)
    case 'update':
      return state.map((c, i) => i === action.index ? { ...c, [action.column]: action.value } : c)
    default:
      return state
  }
}

const ChartsProvider = ({ children }) => {

  const [state, dispatch] = React.useReducer(reducer, initialState)

  const value = {
    charts: state,
    addChart: () => { dispatch({ type: 'add' }) },
    replaceChart: (index, chartType) => { dispatch({ type: 'replace', index, chartType }) },
    removeChart: (index) => { dispatch({ type: 'remove', index }) },
    removeLastChart: () => { dispatch({ type: 'removeLast' }) },
    updateChart: (index, column, value) => { dispatch({ type: 'update', index, column, value }) }
  }

  return (
    <ChartsContext.Provider value={value}>
      {children}
    </ChartsContext.Provider>
  )
}

export default ChartsProvider
