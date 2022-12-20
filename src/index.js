import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './pages/App'
import GlobalFonts from './assets/fonts/fonts'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <GlobalFonts />
    <App />
  </React.StrictMode>
)
