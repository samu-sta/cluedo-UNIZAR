/*************************************************
 * Punto de entrada de React
 * 
 * Inicializa la aplicación React y renderiza el 
 * componente principal en el DOM, estableciendo
 * el entorno necesario para la ejecución.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
