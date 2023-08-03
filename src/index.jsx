import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import ChartsProvider from './providers/ChartsProvider'
import DataProvider from './providers/DataProvider'

ReactDOM.render(
  <React.StrictMode>
    <ChartsProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </ChartsProvider>
  </React.StrictMode>,
  document.getElementById('root')
);