import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import ChartsProvider from './providers/ChartsProvider'

ReactDOM.render(
  <React.StrictMode>
    <ChartsProvider>
      <App />
    </ChartsProvider>
  </React.StrictMode>,
  document.getElementById('root')
);