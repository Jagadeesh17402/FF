import React from 'react'
import ReactDOM from 'react-dom/client'
// AppRouter wraps the original App with authentication routing.
// App.jsx itself is NOT modified — authentication is added as a separate layer.
import AppRouter from './AppRouter.jsx'
import './index.css'
import './styles/custom.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
)