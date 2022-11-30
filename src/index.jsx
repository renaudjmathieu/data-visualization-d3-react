
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import LineChart from './pages/LineChart'
import ScatterPlot from './pages/ScatterPlot'
import Histogram from './pages/Histogram'
import Box from './pages/Box'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="line-chart" element={<LineChart />} />
          <Route path="scatter-plot" element={<ScatterPlot />} />
          <Route path="histogram" element={<Histogram />} />
          <Route path="box" element={<Box />} />
          <Route path="*" element={<h1>404: Not Found</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);