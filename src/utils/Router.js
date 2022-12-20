import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exec path={'/'} element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
