/**
 * @fileoverview Componente que muestra una animación de carga mientras se prepara el tablero
 * @author Samuel Felipe
 */
import React from 'react';
import '../styles/LoadingBoard.css';

const LoadingBoard = () => (
  <section className="loading-board">
    <figure className="loading-spinner"></figure>
    <p>Cargando tablero...</p>
  </section>
);

export default LoadingBoard;