import React from 'react';
import useIsMobile from '../../../hooks/useIsMobile';
import './styles/PlayerList.css';

const PlayerList = ({ players }) => {

  const isMobile = useIsMobile();

  return (
    <aside className={`player-sidebar ${isMobile ? 'mobile' : ''}`}>
      <h2>Jugadores conectados ({players.length})</h2>
      <section className="player-list-container">
        <ul className={`game-player-list ${isMobile ? 'mobile' : ''}`}>
          {players.map(player => (
            <li key={player.id || player.username} className={`game-player-item ${isMobile ? 'mobile' : ''}`}>
              <aside className="player-avatar">
                {player.username.charAt(0).toUpperCase()}
              </aside>
              <main className="player-info">
                <span className="player-name">{player.username}</span>
              </main>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
};

export default PlayerList;