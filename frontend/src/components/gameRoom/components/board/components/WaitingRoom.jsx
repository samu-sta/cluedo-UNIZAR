/**
 * @fileoverview Componente que muestra la sala de espera antes de que comience la partida
 * @author Samuel Felipe
 */
import React from 'react';
import '../styles/WaitingRoom.css';

const WaitingRoom = ({ gameState, countdown }) => (
  <section className="game-board-placeholder">
    <h2>Sala de espera</h2>
    {gameState === 'countdown' && countdown !== null && (
      <section className="countdown-container">
        <h3>La partida comienza en:</h3>
        <p className="countdown-timer">{countdown}</p>
      </section>
    )}

    <p className="waiting-message">
      {gameState === 'waiting'
        ? 'Se necesitan al menos 2 jugadores para comenzar.'
        : 'Prepárate, el juego está por comenzar...'}
    </p>
  </section>
);

export default WaitingRoom;