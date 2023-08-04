import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import DataProvider from './providers/DataProvider'
import ChartsProvider from './providers/ChartsProvider'

ReactDOM.render(
  <React.StrictMode>
    <DataProvider>
      <ChartsProvider>
        <App />
      </ChartsProvider>
    </DataProvider>
  </React.StrictMode>,
  document.getElementById('root')
);