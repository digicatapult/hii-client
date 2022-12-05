import React from 'react'
import ReactDOM from 'react-dom'

import App from './pages/App'
import GlobalFonts from './assets/fonts/fonts'

// available in react 18?
//const root = ReactDOM.createRoot(document.getElementById('root'));

const Root = () => (
  <React.StrictMode>
    <GlobalFonts />
    <App />
  </React.StrictMode>
)

ReactDOM.render(<Root />, document.getElementById('root'))
