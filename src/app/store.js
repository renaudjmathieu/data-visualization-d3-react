import { configureStore } from '@reduxjs/toolkit'

import chartsReducer from '../features/charts/chartsSlice'
import highlightsReducer from '../features/highlights/highlightsSlice'

export default configureStore({
  reducer: {
    charts: chartsReducer,
    highlights: highlightsReducer,
  },
})
