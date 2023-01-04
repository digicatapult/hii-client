import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './pages/App'
import GlobalFonts from './assets/fonts/fonts'

const root = createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <GlobalFonts />
    <App />
  </React.StrictMode>
)
