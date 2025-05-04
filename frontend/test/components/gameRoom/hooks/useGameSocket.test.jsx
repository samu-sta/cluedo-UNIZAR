/*************************************************
 * Pruebas para el hook useGameSocket
 * 
 * Verifica el funcionamiento del hook principal que
 * gestiona la conexión del socket y el estado del juego,
 * coordinando todas las acciones de la partida.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import { renderHook, act } from '@testing-library/react';
import useGameSocket from '../../../../src/components/gameRoom/hooks/useGameSocket';

jest.mock('../../../../src/components/gameRoom/hooks/useSocketConnection', () => ({
  useSocketConnection: jest.fn()
}));
jest.mock('../../../../src/components/gameRoom/hooks/useGameState', () => ({
  useGameState: jest.fn()
}));
jest.mock('../../../../src/components/gameRoom/hooks/useGameTurn', () => ({
  useGameTurn: jest.fn()
}));
jest.mock('../../../../src/components/gameRoom/hooks/usePlayerMovement', () => ({
  usePlayerMovement: jest.fn()
}));
jest.mock('../../../../src/components/gameRoom/hooks/usePlayerCards', () => ({
  usePlayerCards: jest.fn()
}));
jest.mock('../../../../src/components/gameRoom/hooks/useSuggestions', () => ({
  useSuggestions: jest.fn()
}));

import { useSocketConnection } from '../../../../src/components/gameRoom/hooks/useSocketConnection';
import { useGameState } from '../../../../src/components/gameRoom/hooks/useGameState';
import { useGameTurn } from '../../../../src/components/gameRoom/hooks/useGameTurn';
import { usePlayerMovement } from '../../../../src/components/gameRoom/hooks/usePlayerMovement';
import { usePlayerCards } from '../../../../src/components/gameRoom/hooks/usePlayerCards';
import { useSuggestions } from '../../../../src/components/gameRoom/hooks/useSuggestions';

describe('useGameSocket hook', () => {
  const mockSocket = { id: 'mock-socket-id' };
  const gameId = 'game-123';
  const mockGameInfo = { id: gameId, name: 'Test Game' };

  beforeEach(() => {
    jest.clearAllMocks();

    useSocketConnection.mockReturnValue({
      socket: mockSocket,
      loading: false,
      error: null,
      gameInfo: mockGameInfo,
      setLoading: jest.fn(),
      leaveGame: jest.fn()
    });

    useGameState.mockReturnValue({
      players: [{ username: 'player1' }, { username: 'player2' }],
      gameState: 'playing',
      countdown: null,
      winner: null,
      endReason: null,
      solution: null,
      sendReady: jest.fn()
    });

    useGameTurn.mockReturnValue({
      currentTurn: { playerId: 'player1', playerName: 'Player 1', turnNumber: 1 },
      isMyTurn: true,
      hasRolled: false,
      setHasRolled: jest.fn(),
      hasMoved: false,
      hasSuggested: false,
      passTurn: jest.fn()
    });

    usePlayerMovement.mockReturnValue({
      diceResult: null,
      validMoves: [],
      currentPath: [],
      isMoving: false,
      movePlayer: jest.fn(),
      rollDice: jest.fn().mockReturnValue(true)
    });

    usePlayerCards.mockReturnValue({
      playerCards: [{ type: 'suspect', name: 'Colonel Mustard' }],
      leftoverCards: [],
      cardsShown: [],
      requestCards: jest.fn()
    });

    useSuggestions.mockReturnValue({
      currentRoom: 'Kitchen',
      canMakeSuggestion: true,
      showSuggestionModal: false,
      setShowSuggestionModal: jest.fn(),
      showAccusationModal: false,
      setShowAccusationModal: jest.fn(),
      currentSuggestion: null,
      showCardModal: false,
      setShowCardModal: jest.fn(),
      suggestionResponses: [],
      setSuggestionResponses: jest.fn(),
      incorrectAccusation: false,
      incorrectAccusationMessage: null,
      makeSuggestion: jest.fn(),
      makeAccusation: jest.fn(),
      showCard: jest.fn(),
      resetIncorrectAccusation: jest.fn()
    });
  });

  test('initializes by combining all hooks and passing correct parameters', () => {
    const { result } = renderHook(() => useGameSocket(gameId));

    expect(useSocketConnection).toHaveBeenCalledWith(gameId);
    expect(useGameState).toHaveBeenCalledWith(mockSocket);
    expect(useGameTurn).toHaveBeenCalledWith(mockSocket);
    expect(usePlayerMovement).toHaveBeenCalledWith(mockSocket, true, mockGameInfo);
    expect(usePlayerCards).toHaveBeenCalledWith(mockSocket);

    expect(result.current.players).toHaveLength(2);
    expect(result.current.gameState).toBe('playing');
    expect(result.current.isMyTurn).toBe(true);
    expect(typeof result.current.rollDice).toBe('function');
    expect(typeof result.current.passTurn).toBe('function');
  });

  test('functions from individual hooks are available and work correctly', () => {
    const { result } = renderHook(() => useGameSocket(gameId));

    act(() => {
      result.current.rollDice();
      result.current.passTurn();
      result.current.sendReady();
    });

    expect(usePlayerMovement().rollDice).toHaveBeenCalled();
    expect(useGameTurn().setHasRolled).toHaveBeenCalledWith(true);
    expect(useGameTurn().passTurn).toHaveBeenCalled();
    expect(useGameState().sendReady).toHaveBeenCalled();
  });
});