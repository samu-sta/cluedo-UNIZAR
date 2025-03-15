import React from 'react';
import './styles/GameBoard.css';

export const GameBoard = ({ gameId, countdown, gameState, onReady, onLeaveGame }) => {
  return (
    <main className="game-content">
      <header className="game-header">
        <h1>
          Partida: {gameId}
          <span className={`status-badge ${gameState === 'playing' ? 'playing' : 'waiting'}`}>
            {gameState === 'playing' ? 'En juego' : 'En espera'}
          </span>
        </h1>
        <p>
          {gameState === 'countdown' ?
            'La partida comenzará pronto...' :
            'Esperando a que todos los jugadores estén listos'}
        </p>
      </header>

      <section className="game-board-placeholder">
        {gameState === 'playing' ? (
          <div className="game-in-progress">
            <h2>¡La partida ha comenzado!</h2>
            <p>Tablero de juego aquí</p>
          </div>
        ) : (
          <>
            <h2>Sala de espera</h2>

            {gameState === 'countdown' && countdown !== null && (
              <div className="countdown-container">
                <h3>La partida comienza en:</h3>
                <div className="countdown-timer">{countdown}</div>
                <div className="countdown-progress">
                  <div
                    className="countdown-bar"
                    style={{ width: `${(countdown / 60) * 100}%` }}
                  />
                </div>
              </div>
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
    </main>
  );
};