import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'


export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exec path={'/'} element={<h1>root comp</h1>} />
      </Routes>
    </BrowserRouter>
  )
}
