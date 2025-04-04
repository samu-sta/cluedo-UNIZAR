import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useGameSocket } from '../../hooks/useGameSocket';
import PlayerList from './components/PlayerList';
import GameEndedModal from './components/GameEndedModal';
import useGameEndedModal from '../../hooks/useGameEndedModal';
import useIsMobile from '../../hooks/useIsMobile';
import GameHeader from './components/GameHeader';
import Board from '../../components/Board/Board';
import AccusationModal from './components/AccusationModal';
import './styles/GameRoom.css';
import PlayerCards from '../../components/PlayerCards/PlayerCards';
import DeductionTable from '../../components/deductionTable/DeductionTable';
import TurnIndicator from './components/TurnIndicator';
import DiceRoller from './components/DiceRoller';
import IncorrectAccusationModal from './components/IncorrectAccusationModal';

const GameRoom = ({ user }) => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [canRoll, setCanRoll] = useState(false);

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
    gameInfo,
    winner,
    endReason,
    playerCards,
    leftoverCards,
    currentTurn,
    isMyTurn,
    passTurn,
    rollDice,
    diceResult,
    sendReady,
    leaveGame,
    validMoves,
    isMoving,
    hasRolled,
    makeAccusation,
    showAccusationModal,
    setShowAccusationModal,
    solution,
    incorrectAccusation,
    incorrectAccusationMessage,
    resetIncorrectAccusation,
    movePlayer,
    currentPath
  } = useGameSocket(gameId);



  useEffect(() => {
    setCanRoll(gameState === 'playing' && isMyTurn);
  }, [gameState, isMyTurn]);

  const { showEndedModal, toogleEndedModal } = useGameEndedModal(gameState);

  const handleLeaveGame = () => {
    leaveGame();
    navigate('/games');
  };

  const handleShowAccusation = () => {
    setShowAccusationModal(true);
  };

  const handleCloseAccusation = () => {
    setShowAccusationModal(false);
  };

  const handleSubmitAccusation = (accusation) => {
    makeAccusation(accusation);
    setShowAccusationModal(false);
  };

  if (loading) {
    return (
      <main className="game-loading">
        <figure className="loading-spinner large"></figure>
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
    <>
      <main className={`game-room ${isMobile ? 'mobile' : ''}`}>
        {/*  <PlayerList players={players} /> */}
        <main className={`game-content ${isMobile ? 'mobile' : ''}`}>
          <GameHeader gameId={gameId} gameState={gameState} onLeaveGame={handleLeaveGame} players={players} />
          {gameState === 'playing' && (
            <section className={`game-info ${isMobile ? 'mobile' : ''}`}>
              <TurnIndicator
                currentTurn={currentTurn}
                isMyTurn={isMyTurn}
                onPassTurn={passTurn}
                onMakeAccusation={handleShowAccusation}
              />
              <DiceRoller
                diceResult={diceResult}
                rollDice={rollDice}
                isMyTurn={isMyTurn}
                canRoll={canRoll}
                setCanRoll={setCanRoll}
              />
            </section>
          )}
          <Board
            countdown={countdown}
            gameState={gameState}
            gameInfo={gameInfo}
            onReady={sendReady}
            onLeaveGame={handleLeaveGame}
            players={players}
            validMoves={validMoves}
            isMyTurn={isMyTurn}
            isMoving={isMoving}
            movePlayer={movePlayer}
            currentPath={currentPath}
            hasRolled={hasRolled}
          />
        </main>
        <PlayerCards cards={playerCards} leftoverCards={leftoverCards} />
        {gameState === 'playing' && <DeductionTable gameInfo={gameInfo} playerCards={playerCards} leftoverCards={leftoverCards} />}
      </main>

      <AccusationModal
        isOpen={showAccusationModal}
        onClose={handleCloseAccusation}
        onSubmit={handleSubmitAccusation}
        gameInfo={gameInfo}
      />

      <GameEndedModal
        isOpen={showEndedModal}
        winner={winner}
        reason={endReason}
        onLeaveGame={handleLeaveGame}
        toogleEndedModal={toogleEndedModal}
        solution={solution}
      />

      <IncorrectAccusationModal
        isOpen={incorrectAccusation}
        message={incorrectAccusationMessage}
        onLeaveGame={() => {
          resetIncorrectAccusation();
          handleLeaveGame();
        }}
      />
    </>
  );
};

export default GameRoom;