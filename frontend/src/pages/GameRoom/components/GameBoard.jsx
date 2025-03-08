import React from 'react';
import './styles/GameBoard.css';
export const GameBoard = ({ gameId, onReady, onLeaveGame }) => {
  return (
    <main className="game-content">
      <header className="game-header">
        <h1>
          Partida: {gameId}
          <span className={`status-badge waiting`}>
            En espera
          </span>
        </h1>
        <p>
          Esperando a que todos los jugadores estén listos
        </p>
      </header>

      <section className="game-board-placeholder">
        <h2>Sala de espera</h2>

        <p>La partida comenzará cuando todos los jugadores estén listos.</p>
        <nav className="game-controls">
          <button
            className="btn primary"
            onClick={onReady}
          >
            Estoy listo
          </button>
          <button
            className="btn outline danger"
            onClick={onLeaveGame}
          >
            Abandonar partida
          </button>
        </nav>
      </section>
    </main>
  );
};