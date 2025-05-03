/**
 * @fileoverview Punto de entrada de la aplicación React que renderiza el componente principal
 * @author Samuel Felipe
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
