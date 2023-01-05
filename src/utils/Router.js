import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'
import { PUBLIC_BASEPATH } from './env'

export default function Router() {
  return (
    <BrowserRouter basename={PUBLIC_BASEPATH}>
      <Routes>
        <Route exec path={'/'} element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
