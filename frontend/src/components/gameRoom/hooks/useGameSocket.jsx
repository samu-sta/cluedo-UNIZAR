import { useSocketConnection } from './useSocketConnection';
import { useGameState } from './useGameState';
import { useGameTurn } from './useGameTurn';
import { usePlayerMovement } from './usePlayerMovement';
import { usePlayerCards } from './usePlayerCards';
import { useSuggestions } from './useSuggestions';
import { useEffect } from 'react';

/**
 * Hook principal que coordina todos los hooks especializados para el juego
 * Siguiendo el principio de responsabilidad única (SRP) de SOLID, cada sub-hook
 * maneja una funcionalidad específica
 */
const useGameSocket = (gameId) => {
  const {
    socket,
    loading,
    error,
    gameInfo,
    setLoading,
    leaveGame
  } = useSocketConnection(gameId);

  const {
    players,
    gameState,
    countdown,
    winner,
    endReason,
    solution,
    sendReady
  } = useGameState(socket);

  const {
    currentTurn,
    isMyTurn,
    hasRolled,
    setHasRolled,
    hasMoved,
    hasSuggested,
    passTurn
  } = useGameTurn(socket);

  const {
    diceResult,
    validMoves,
    currentPath,
    isMoving,
    movePlayer,
    rollDice
  } = usePlayerMovement(socket, isMyTurn, gameInfo);

  const {
    playerCards,
    leftoverCards,
    cardsShown,
    requestCards
  } = usePlayerCards(socket);

  const {
    currentRoom,
    canMakeSuggestion,
    showSuggestionModal,
    setShowSuggestionModal,
    showAccusationModal,
    setShowAccusationModal,
    currentSuggestion,
    showCardModal,
    setShowCardModal,
    suggestionResponses,
    setSuggestionResponses,
    incorrectAccusation,
    incorrectAccusationMessage,
    makeSuggestion,
    makeAccusation,
    showCard,
    resetIncorrectAccusation
  } = useSuggestions(socket, { ...gameInfo, players, hasRolled, hasMoved, hasSuggested }, isMyTurn);

  useEffect(() => {
    if (players.length > 0 && loading) {
      setLoading(false);
    }
  }, [players, loading, setLoading]);

  const handleRollDice = () => {
    if (rollDice()) {
      setHasRolled(true);
      return true;
    }
    return false;
  };

  return {
    // Estado principal
    players,
    loading,
    error,
    countdown,
    gameState,
    gameInfo,
    winner,
    endReason,
    solution,

    // Turnos
    currentTurn,
    isMyTurn,
    passTurn,

    // Acciones generales
    sendReady,
    leaveGame,
    requestCards,

    // Dados y movimiento
    diceResult,
    rollDice: handleRollDice,
    validMoves,
    isMoving,
    movePlayer,
    hasRolled,
    currentPath,

    // Cartas
    playerCards,
    leftoverCards,
    cardsShown,

    // Sugerencias y acusaciones
    makeAccusation,
    showAccusationModal,
    setShowAccusationModal,
    incorrectAccusation,
    incorrectAccusationMessage,
    resetIncorrectAccusation,
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
    suggestionResponses,
    setSuggestionResponses
  };
}

export default useGameSocket;