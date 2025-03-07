import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles/GameRoom.css';

// Datos de ejemplo para simular usuarios conectados
const mockPlayers = [
  { id: 1, username: 'Detective1', avatarURL: "https://api.dicebear.com/7.x/personas/svg?seed=detective" },
  { id: 2, username: 'Sherlock', avatarURL: "https://api.dicebear.com/7.x/personas/svg?seed=sherlock" },
  { id: 3, username: 'MissMarple', avatarURL: "https://api.dicebear.com/7.x/personas/svg?seed=missmarple" },
  { id: 4, username: 'Poirot', avatarURL: "https://api.dicebear.com/7.x/personas/svg?seed=poirot" }
];

const GameRoom = ({ user }) => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState(mockPlayers);
  const [loading, setLoading] = useState(false);

  // Redirección si no hay usuario
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  });

  // Simulación de carga de datos de la partida
  useEffect(() => {
    setLoading(true);
    // Simulamos una carga de datos
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [gameId]);

  if (loading) {
    return (
      <div className="game-loading">
        <div className="loading-spinner large"></div>
        <h2>Cargando partida...</h2>
      </div>
    );
  }

  return (
    <div className="game-room">
      <aside className="player-sidebar">
        <h2>Jugadores ({players.length})</h2>
        <ul className="game-player-list">
          {players.map(player => (
            <li key={player.id} className="game-player-item">
              <img className="player-avatar" src={player.avatarURL} alt={player.username} />
              <span className="player-name">{player.username}</span>
            </li>
          ))}
        </ul>
      </aside>

      <main className="game-content">
        <header className="game-header">
          <h1>Partida: {gameId}</h1>
        </header>
        <main className="game-board-placeholder">
          <h2>Tablero de Juego</h2>
          <p>El juego comenzará cuando estén todos los jugadores listos.</p>
          <section className="game-controls">
            <button className="btn primary">Estoy listo</button>
            <button
              className="btn outline danger"
              onClick={() => navigate('/games')}
            >
              Abandonar partida
            </button>
          </section>
        </main>
      </main>
    </div>
  );
};

export default GameRoom;