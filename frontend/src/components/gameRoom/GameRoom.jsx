/**
 * @fileoverview Componente de sala de juego que gestiona una partida en curso
 * @author Samuel Felipe
 */
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useGameSocket from './hooks/useGameSocket';
import GameEndedModal from './components/GameEndedModal';
import useIsMobile from '../common/hooks/useIsMobile';
import GameHeader from './components/GameHeader';
import Board from './components/board/Board';
import AccusationModal from './components/AccusationModal';
import './styles/GameRoom.css';
import PlayerCards from './components/playerCards/PlayerCards';
import DeductionTable from './components/deductionTable/DeductionTable';
import TurnIndicator from './components/TurnIndicator';
import DiceRoller from './components/DiceRoller';
import IncorrectAccusationModal from './components/IncorrectAccusationModal';
import SuggestionModal from './components/SuggestionModal';
import SuggestionResponseModal from './components/SuggestionResponseModal';
import ShowCardModal from './components/ShowCardModal';

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
    currentPath,
    makeSuggestion,
    showSuggestionModal,
    setShowSuggestionModal,
    canMakeSuggestion,
    currentRoom,
    hasSuggested,
    currentSuggestion,
    showCardModal,
    setShowCardModal,
    showCard,
    cardsShown,
    suggestionResponses,
    setSuggestionResponses,
  } = useGameSocket(gameId);


  const handleShowSuggestion = () => {
    setShowSuggestionModal(true);
  };

  const handleCloseSuggestion = () => {
    setShowSuggestionModal(false);
  };

  const handleSubmitSuggestion = (suggestion) => {
    makeSuggestion(suggestion);
    setShowSuggestionModal(false);
  };

  useEffect(() => {
    setCanRoll(gameState === 'playing' && isMyTurn);
  }, [gameState, isMyTurn]);


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

  const handleShowCard = (card) => {
    if (showCard) {
      showCard(card);
    }
    setShowCardModal(false);
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
            <section className={`game-info ${isMobile ? 'mobile' : ''} ${isMyTurn ? 'my-turn' : ''}`}>
              <TurnIndicator
                currentTurn={currentTurn}
                isMyTurn={isMyTurn}
                onPassTurn={passTurn}
                onMakeAccusation={handleShowAccusation}
                onMakeSuggestion={handleShowSuggestion}
                canMakeSuggestion={canMakeSuggestion}
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
        {gameState === 'playing' && <DeductionTable gameInfo={gameInfo} playerCards={playerCards} leftoverCards={leftoverCards} cardsShown={cardsShown} />}
      </main>

      <AccusationModal
        isOpen={showAccusationModal}
        onClose={handleCloseAccusation}
        onSubmit={handleSubmitAccusation}
        gameInfo={gameInfo}
      />

      <GameEndedModal
        winner={winner}
        reason={endReason}
        onLeaveGame={handleLeaveGame}
        solution={solution}
        gameState={gameState}
      />

      <IncorrectAccusationModal
        isOpen={incorrectAccusation}
        message={incorrectAccusationMessage}
        onLeaveGame={() => {
          resetIncorrectAccusation();
          handleLeaveGame();
        }}
      />

      <SuggestionModal
        isOpen={showSuggestionModal}
        onClose={handleCloseSuggestion}
        onSubmit={handleSubmitSuggestion}
        gameInfo={gameInfo}
        currentRoom={currentRoom}

      />

      <SuggestionResponseModal
        players={players}
        hasSuggested={hasSuggested}
        suggestionResponses={suggestionResponses}
        setSuggestionResponses={setSuggestionResponses}
      />

      <ShowCardModal
        isOpen={showCardModal}
        onSubmit={handleShowCard}
        playerCards={playerCards}
        currentSuggestion={currentSuggestion}
      />
    </>
  );
};

export default GameRoom;