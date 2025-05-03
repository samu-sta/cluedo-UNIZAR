/**
 * @fileoverview Tests for useGameState hook which manages the game's state, players, and related functionality.
 * @author Samuel Felipe
 */
import { renderHook, act } from '@testing-library/react';
import { useGameState } from '../../../../src/components/gameRoom/hooks/useGameState';

const mockLocalStorage = {
  getItem: jest.fn().mockImplementation((key) => {
    if (key === 'user') {
      return JSON.stringify({ id: 'user-123', username: 'testUser' });
    }
    return null;
  })
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('useGameState hook', () => {
  const mockSocket = {
    on: jest.fn(),
    emit: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initializes with default values and registers socket events', () => {
    const { result } = renderHook(() => useGameState(mockSocket));

    expect(result.current.players).toEqual([]);
    expect(result.current.gameState).toBe('waiting');
    expect(result.current.countdown).toBeNull();

    expect(mockSocket.on).toHaveBeenCalledWith('playerList', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('playerJoined', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('gameStart', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('gameEnd', expect.any(Function));
  });

  test('handles player events and game state changes', () => {
    const { result } = renderHook(() => useGameState(mockSocket));

    const playerListHandler = mockSocket.on.mock.calls.find(call => call[0] === 'playerList')[1];
    const countdownUpdateHandler = mockSocket.on.mock.calls.find(call => call[0] === 'countdownUpdate')[1];
    const gameStartHandler = mockSocket.on.mock.calls.find(call => call[0] === 'gameStart')[1];
    const gameEndHandler = mockSocket.on.mock.calls.find(call => call[0] === 'gameEnd')[1];

    act(() => {
      playerListHandler({
        players: [{ username: 'player1' }, { username: 'player2' }]
      });
    });
    expect(result.current.players).toEqual([{ username: 'player1' }, { username: 'player2' }]);

    act(() => {
      countdownUpdateHandler({ seconds: 30 });
    });
    expect(result.current.countdown).toBe(30);
    expect(result.current.gameState).toBe('countdown');

    act(() => {
      gameStartHandler({
        players: [{ username: 'player1', character: 'Colonel Mustard' }],
        currentTurn: { playerId: 'player1', playerName: 'player1' }
      });
    });
    expect(result.current.gameState).toBe('playing');

    act(() => {
      gameEndHandler({
        reason: 'correct_accusation',
        winner: 'player1',
        solution: { suspect: 'Colonel Mustard', weapon: 'Candlestick', room: 'Kitchen' }
      });
    });
    expect(result.current.gameState).toBe('ended');
    expect(result.current.winner).toBe('player1');
  });

  test('sendReady emits playerReady event', () => {
    const { result } = renderHook(() => useGameState(mockSocket));

    act(() => {
      result.current.sendReady();
    });

    expect(mockSocket.emit).toHaveBeenCalledWith('playerReady');
  });
});