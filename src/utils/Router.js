import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'
import { PUBLIC_BASE_PATH } from './env'

export default function Router() {
  return (
    <BrowserRouter basename={PUBLIC_BASE_PATH}>
      <Routes>
        <Route exec path={'/'} element={<Home />} />
        <Route exec path={':projectId'} element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
