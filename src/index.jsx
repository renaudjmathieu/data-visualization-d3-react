
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { mainNavbarListItems } from './components/Navbar/consts/navbarListItems'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          {mainNavbarListItems.map((item, index) => (
            <Route
              path={item.path}
              element={item.element} />
          ))}
          <Route path="*" element={<h1>404: Not Found</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);