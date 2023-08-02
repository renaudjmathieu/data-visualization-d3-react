import { createSlice, nanoid } from '@reduxjs/toolkit'

const chartsAvailable = [
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

const initialState = chartsAvailable.filter(chart => ['scatter', 'histogram', 'timeline', 'list'].includes(chart.type)).map(chart => {
  return {
    id: nanoid(),
    ...chart,
  }
})

const chartsSlice = createSlice({
  name: 'charts',
  initialState,
  reducers: {
    chartAdded: {
      reducer(state, action) {
        state.push(action.payload)
      },
      prepare() {
        return {
          payload: {
            id: nanoid(),
            ...chartsAvailable[Math.floor(Math.random() * chartsAvailable.length)],
          }
        }
      },
    },

    chartReplaced(state, action) {
      const { id } = action.payload
      const existingChart = state.find((chart) => chart.id === id)
      if (existingChart) {
        existingChart.title = id
        existingChart.type = _.find(chartsAvailable, { id: id }).type
        existingChart.name = _.find(chartsAvailable, { id: id }).name
      }
    },

    chartRemoved(state, action) {
      const { id } = action.payload
      console.log('chartRemoved - id', id)
      const existingChart = state.find((chart) => chart.id === id)
      console.log('chartRemoved - existingChart', existingChart)
      if (existingChart) {
        state.splice(state.indexOf(existingChart), 1)
      }
    },

    lastChartRemoved(state, action) {
      state.pop()
    },

    chartUpdated(state, action) {
      const { id, column, value } = action.payload
      const existingChart = state.find((chart) => chart.id === id)
      if (existingChart) {
        existingChart[column] = value
      }
    },

    reactionAdded(state, action) {
      const { chartId, reaction } = action.payload
      const existingChart = state.find((chart) => chart.id === chartId)
      if (existingChart) {
        existingChart.reactions[reaction]++
      }
    },
  },
})

export const { chartAdded, chartReplaced, chartRemoved, lastChartRemoved, chartUpdated } = chartsSlice.actions

export default chartsSlice.reducer
