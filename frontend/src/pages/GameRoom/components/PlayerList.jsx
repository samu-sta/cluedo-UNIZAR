import React from 'react';
import './styles/PlayerList.css';
export const PlayerList = ({ players }) => {
  return (
    <aside className="player-sidebar">
      <h2>Jugadores conectados ({players.length})</h2>
      <section className="player-list-container">
        {players.length === 0 ? (
          <p className="no-players">No hay jugadores conectados</p>
        ) : (
          <ul className="game-player-list">
            {players.map(player => (
              <li key={player.id || player.username} className="game-player-item">
                <aside className="player-avatar">
                  {player.username.charAt(0).toUpperCase()}
                </aside>
                <main className="player-info">
                  <span className="player-name">{player.username}</span>
                  {player.isHost && <span className="player-host-badge">Anfitrión</span>}
                </main>
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  );
};