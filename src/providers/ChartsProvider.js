import React, { createContext, useContext } from 'react'

const ChartsContext = createContext()
export const useChartsContext = () => useContext(ChartsContext)

export const chartsAvailable = [
  {
    type: 'scatter',
    name: "Scatter chart",
    xAxis: 'humidity',
    yAxis: 'temperatureMin',
    yAxisSummarization: '',
    category1: '',
    category2: '',
    category3: '',
    value: '',
    valueSummarization: '',
    playAxis: ''
  },
  {
    type: 'histogram',
    name: "Column chart",
    xAxis: 'humidity',
    yAxis: 'humidity',
    yAxisSummarization: 'count',
    category1: '',
    category2: '',
    category3: '',
    value: '',
    valueSummarization: '',
    playAxis: ''
  },
  {
    type: 'timeline',
    name: "Line chart",
    xAxis: 'date',
    yAxis: 'temperatureMin',
    yAxisSummarization: '',
    category1: '',
    category2: '',
    category3: '',
    value: '',
    valueSummarization: '',
    playAxis: ''
  },
  {
    type: 'list',
    name: "List",
    xAxis: '',
    yAxis: '',
    yAxisSummarization: '',
    category1: 'icon',
    category2: '',
    category3: '',
    value: 'humidity',
    valueSummarization: 'distinct',
    playAxis: ''
  },
]

const initialState = chartsAvailable.filter(chart => ['scatter', 'histogram', 'timeline', 'list'].includes(chart.type))

const reducer = (state, action) => {
  switch (action.type) {
    case 'add':
      return [...state, chartsAvailable[Math.floor(Math.random() * chartsAvailable.length)]]
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
