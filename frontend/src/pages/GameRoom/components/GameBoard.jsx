import React from 'react';
import './styles/GameBoard.css';

export const GameBoard = ({ countdown, gameState, onReady, onLeaveGame }) => {
  return (

    <section className="game-board-placeholder">
      {gameState === 'playing' ? (
        <section className="game-in-progress">
          <h2>¡La partida ha comenzado!</h2>
          <main>Tablero de juego aquí</main>
        </section>
      ) : (
        <>
          <h2>Sala de espera</h2>
          {gameState === 'countdown' && countdown !== null && (
            <section className="countdown-container">
              <h3>La partida comienza en:</h3>
              <p className="countdown-timer">{countdown}</p>
            </section>
          )}

          <p>
            {gameState === 'waiting'
              ? 'Se necesitan al menos 2 jugadores para comenzar.'
              : 'Prepárate, el juego está por comenzar...'}
          </p>

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
        </>
      )}
    </section>

  );
};