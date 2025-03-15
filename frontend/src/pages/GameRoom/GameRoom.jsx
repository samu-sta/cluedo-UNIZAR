import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useGameSocket } from '../../hooks/useGameSocket';
import PlayerList from './components/PlayerList';
import { GameBoard } from './components/GameBoard';
import GameHeader from './components/GameHeader';
import useIsMobile from '../../hooks/useIsMobile';
import './styles/GameRoom.css';

const GameRoom = ({ user }) => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Verificar si hay usuario
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  const {
    players,
    loading,
    error,
    countdown,
    gameState,
    sendReady,
    leaveGame
  } = useGameSocket(gameId, user?.id);

  const handleLeaveGame = () => {
    leaveGame();
    navigate('/games');
  };

  if (loading) {
    return (
      <main className="game-loading">
        <div className="loading-spinner large"></div>
        <h2>Conectando a la partida...</h2>
      </main>
    );
  }

  if (error) {
    return (
      <main className="game-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button
          className="btn primary"
          onClick={() => navigate('/games')}
        >
          Volver a partidas
        </button>
      </main>
    );
  }

  return (
    <main className={`game-room ${isMobile ? 'mobile' : ''}`}>
      <PlayerList players={players} />
      <main className={`game-content ${isMobile ? 'mobile' : ''}`}>
        <GameHeader gameId={gameId} gameState={gameState} onLeaveGame={handleLeaveGame} />
        <GameBoard
          countdown={countdown}
          gameState={gameState}
          onReady={sendReady}
          onLeaveGame={handleLeaveGame}
        />
      </main>

    </main>
  );
};

export default GameRoom;