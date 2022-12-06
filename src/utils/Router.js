import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Map from '../pages/Map'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exec path={'/'} element={<h1>root comp</h1>} />
        <Route exec path={'/map'} element={<Map />} />
      </Routes>
    </BrowserRouter>
  )
}
