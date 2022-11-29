
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LineChart from './pages/LineChart';
import ScatterChart from './pages/ScatterChart';
import BarChart from './pages/BarChart';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="line-chart" element={<LineChart />} />
          <Route path="scatter-chart" element={<ScatterChart />} />
          <Route path="bar-chart" element={<BarChart />} />
          <Route path="*" element={<h1>404: Not Found</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);