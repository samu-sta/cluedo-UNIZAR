import './styles/StartGames.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import useStartGames from './hooks/useStartGames';

const StartGames = ({ user }) => {
  const navigate = useNavigate();
  const {
    isLoading,
    error,
    gameId,
    handleCreateGame,
    handleJoinGame,
    handleGameIdChange,
  } = useStartGames();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <main className="games-container">
      <span className="decorative-element circle top-left" aria-hidden="true"></span>
      <span className="decorative-element dots bottom-right" aria-hidden="true"></span>

      <section className="games-content">
        <header className="games-header">
          <h1 className="games-title">
            Partidas de <span className="accent">Cluedo UNIZAR</span>
          </h1>
          <p className="games-subtitle">
            Únete a una partida para resolver el misterio
          </p>
        </header>

        <section className="search-game-container">
          {error && <div className="error-message-games">{error}</div>}

          <button
            className="btn primary large with-shadow search-button"
            onClick={handleCreateGame}
            disabled={isLoading}
          >
            {isLoading ? 'Creando partida...' : 'Crear nueva partida'}
          </button>

          <section className="join-game-form">
            <h3>O únete a una partida existente</h3>
            <form onSubmit={handleJoinGame} className="game-id-form">
              <input
                type="text"
                placeholder="ID de la partida"
                value={gameId}
                id='gameId'
                name='gameId'
                onChange={handleGameIdChange}
                className="game-id-input"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="btn primary"
                disabled={isLoading}
              >
                {isLoading ? 'Uniéndose...' : 'Unirse'}
              </button>
            </form>
          </section>
        </section>
      </section>
    </main>
  );
};

export default StartGames;
