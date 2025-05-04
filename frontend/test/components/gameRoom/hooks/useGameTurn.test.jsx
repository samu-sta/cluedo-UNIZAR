/*************************************************
 * Pruebas para el hook useGameTurn
 * 
 * Verifica el manejo de turnos de jugadores durante
 * la partida, incluyendo la identificación de cuándo
 * es el turno del usuario y el control para pasar turno.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import { renderHook, act } from '@testing-library/react';
import { useGameTurn } from '../../../../src/components/gameRoom/hooks/useGameTurn';

const mockLocalStorage = {
  getItem: jest.fn().mockImplementation((key) => {
    if (key === 'user') {
      return JSON.stringify({ id: 'user-123', username: 'testUser' });
    }
    return null;
  })
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('useGameTurn hook', () => {
  const mockSocket = {
    on: jest.fn(),
    emit: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initializes with default values', () => {
    const { result } = renderHook(() => useGameTurn(mockSocket));

    expect(result.current.currentTurn).toBeNull();
    expect(result.current.isMyTurn).toBe(false);
    expect(result.current.hasRolled).toBe(false);
    expect(result.current.hasMoved).toBe(false);
    expect(result.current.hasSuggested).toBe(false);
  });

  test('registers socket event listeners on mount', () => {
    renderHook(() => useGameTurn(mockSocket));

    expect(mockSocket.on).toHaveBeenCalledWith('gameStart', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('turnUpdate', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('moveSuccess', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('suggestionMade', expect.any(Function));
  });

  test('updates turn state on gameStart event', () => {
    const { result } = renderHook(() => useGameTurn(mockSocket));

    const gameStartHandler = mockSocket.on.mock.calls.find(call => call[0] === 'gameStart')[1];

    act(() => {
      gameStartHandler({
        currentTurn: {
          playerId: 'user-123',
          playerName: 'testUser',
          turnNumber: 1
        }
      });
    });

    expect(result.current.currentTurn).toEqual({
      playerId: 'user-123',
      playerName: 'testUser',
      turnNumber: 1
    });
    expect(result.current.isMyTurn).toBe(true);
  });

  test('updates turn state on turnUpdate event', () => {
    const { result } = renderHook(() => useGameTurn(mockSocket));

    const turnUpdateHandler = mockSocket.on.mock.calls.find(call => call[0] === 'turnUpdate')[1];

    act(() => {
      turnUpdateHandler({
        currentTurn: {
          playerId: 'other-user',
          playerName: 'otherUser',
          turnNumber: 2
        }
      });
    });

    expect(result.current.currentTurn).toEqual({
      playerId: 'other-user',
      playerName: 'otherUser',
      turnNumber: 2
    });
    expect(result.current.isMyTurn).toBe(false);
  });

  test('resets state when it becomes player turn', () => {
    const { result } = renderHook(() => useGameTurn(mockSocket));

    act(() => {
      result.current.setHasRolled(true);
    });

    const turnUpdateHandler = mockSocket.on.mock.calls.find(call => call[0] === 'turnUpdate')[1];

    act(() => {
      turnUpdateHandler({
        currentTurn: {
          playerId: 'user-123',
          playerName: 'testUser',
          turnNumber: 3
        }
      });
    });

    expect(result.current.isMyTurn).toBe(true);
    expect(result.current.hasRolled).toBe(false);
    expect(result.current.hasMoved).toBe(false);
    expect(result.current.hasSuggested).toBe(false);
  });

  test('updates hasMoved when moveSuccess event is received', () => {
    const { result } = renderHook(() => useGameTurn(mockSocket));

    const moveSuccessHandler = mockSocket.on.mock.calls.find(call => call[0] === 'moveSuccess')[1];

    act(() => {
      moveSuccessHandler();
    });

    expect(result.current.hasMoved).toBe(true);
  });

  test('updates hasSuggested when suggestionMade event is received', () => {
    const { result } = renderHook(() => useGameTurn(mockSocket));

    const suggestionMadeHandler = mockSocket.on.mock.calls.find(call => call[0] === 'suggestionMade')[1];

    act(() => {
      suggestionMadeHandler();
    });

    expect(result.current.hasSuggested).toBe(true);
  });

  test('emits passTurn event when passTurn is called during player turn', () => {
    const { result } = renderHook(() => useGameTurn(mockSocket));

    const turnUpdateHandler = mockSocket.on.mock.calls.find(call => call[0] === 'turnUpdate')[1];
    act(() => {
      turnUpdateHandler({
        currentTurn: {
          playerId: 'user-123',
          playerName: 'testUser'
        }
      });
    });

    act(() => {
      result.current.passTurn();
    });

    expect(mockSocket.emit).toHaveBeenCalledWith('passTurn');
    expect(result.current.hasRolled).toBe(false);
    expect(result.current.hasMoved).toBe(false);
    expect(result.current.hasSuggested).toBe(false);
  });

  test('does not emit passTurn when it is not player turn', () => {
    const { result } = renderHook(() => useGameTurn(mockSocket));

    const turnUpdateHandler = mockSocket.on.mock.calls.find(call => call[0] === 'turnUpdate')[1];
    act(() => {
      turnUpdateHandler({
        currentTurn: {
          playerId: 'other-user',
          playerName: 'otherUser'
        }
      });
    });

    act(() => {
      result.current.passTurn();
    });

    expect(mockSocket.emit).not.toHaveBeenCalled();
  });
});