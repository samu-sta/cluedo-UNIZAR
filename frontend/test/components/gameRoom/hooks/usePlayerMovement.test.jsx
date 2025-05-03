/**
 * @fileoverview Tests for usePlayerMovement hook which handles player movement, dice rolling, and valid moves calculation.
 * @author Samuel Felipe
 */
import { renderHook, act } from '@testing-library/react';
import { usePlayerMovement } from '../../../../src/components/gameRoom/hooks/usePlayerMovement';

const mockLocalStorage = {
  getItem: jest.fn().mockImplementation((key) => {
    if (key === 'user') {
      return JSON.stringify({ username: 'testUser' });
    }
    return null;
  })
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

jest.useFakeTimers();

describe('usePlayerMovement hook', () => {
  const mockSocket = {
    on: jest.fn(),
    emit: jest.fn()
  };

  const mockGameInfo = {
    players: [
      { username: 'testUser', position: { row: 5, column: 5 } }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('initializes with default values', () => {
    const { result } = renderHook(() => usePlayerMovement(mockSocket, false, mockGameInfo));

    expect(result.current.diceResult).toBeNull();
    expect(result.current.validMoves).toEqual([]);
    expect(result.current.currentPath).toBeNull();
    expect(result.current.isMoving).toBe(false);
  });

  test('registers socket event listeners on mount', () => {
    renderHook(() => usePlayerMovement(mockSocket, false, mockGameInfo));

    expect(mockSocket.on).toHaveBeenCalledWith('diceRolled', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('playersMoved', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('moveSuccess', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('turnUpdate', expect.any(Function));
  });

  test('updates diceResult and validMoves when diceRolled event is received', () => {
    const { result } = renderHook(() => usePlayerMovement(mockSocket, true, mockGameInfo));

    const diceRolledHandler = mockSocket.on.mock.calls.find(call => call[0] === 'diceRolled')[1];

    const mockDiceResult = 5;
    const mockValidMoves = [
      { row: 6, column: 5 },
      { row: 5, column: 6 }
    ];

    act(() => {
      diceRolledHandler({ diceResult: mockDiceResult, validMoves: mockValidMoves });
    });

    expect(result.current.diceResult).toBe(mockDiceResult);
    expect(result.current.validMoves).toEqual(mockValidMoves);
  });

  test('starts movement animation when playersMoved event is received', () => {
    const { result } = renderHook(() => usePlayerMovement(mockSocket, true, mockGameInfo));

    const playersMovedHandler = mockSocket.on.mock.calls.find(call => call[0] === 'playersMoved')[1];

    const mockPath = [
      { row: 5, column: 5 },
      { row: 6, column: 5 },
      { row: 7, column: 5 }
    ];

    act(() => {
      playersMovedHandler({ movedPlayer: 'testUser', path: mockPath });
    });

    expect(result.current.currentPath).toEqual(mockPath);
    expect(result.current.isMoving).toBe(true);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.isMoving).toBe(false);
    expect(result.current.currentPath).toBeNull();
  });

  test('clears validMoves when moveSuccess event is received', () => {
    const { result } = renderHook(() => usePlayerMovement(mockSocket, true, mockGameInfo));

    const diceRolledHandler = mockSocket.on.mock.calls.find(call => call[0] === 'diceRolled')[1];
    act(() => {
      diceRolledHandler({
        diceResult: 5,
        validMoves: [{ row: 6, column: 5 }]
      });
    });

    const moveSuccessHandler = mockSocket.on.mock.calls.find(call => call[0] === 'moveSuccess')[1];
    act(() => {
      moveSuccessHandler();
    });

    expect(result.current.validMoves).toEqual([]);
  });

  test('clears validMoves and currentPath when turn changes and not player turn', () => {
    const { result } = renderHook(() => usePlayerMovement(mockSocket, false, mockGameInfo));

    const diceRolledHandler = mockSocket.on.mock.calls.find(call => call[0] === 'diceRolled')[1];
    const playersMovedHandler = mockSocket.on.mock.calls.find(call => call[0] === 'playersMoved')[1];

    act(() => {
      diceRolledHandler({
        diceResult: 5,
        validMoves: [{ row: 6, column: 5 }]
      });

      playersMovedHandler({
        movedPlayer: 'testUser',
        path: [{ row: 5, column: 5 }, { row: 6, column: 5 }]
      });
    });

    const turnUpdateHandler = mockSocket.on.mock.calls.find(call => call[0] === 'turnUpdate')[1];
    act(() => {
      turnUpdateHandler();
    });

    expect(result.current.validMoves).toEqual([]);
    expect(result.current.currentPath).toBeNull();
  });

  test('emits movePlayer event when movePlayer is called', () => {
    const { result } = renderHook(() => usePlayerMovement(mockSocket, true, mockGameInfo));

    const position = { row: 6, column: 5 };

    act(() => {
      result.current.movePlayer(position);
    });

    expect(mockSocket.emit).toHaveBeenCalledWith('movePlayer', position);
  });

  test('does not emit movePlayer when it is not player turn', () => {
    const { result } = renderHook(() => usePlayerMovement(mockSocket, false, mockGameInfo));

    const position = { row: 6, column: 5 };

    act(() => {
      result.current.movePlayer(position);
    });

    expect(mockSocket.emit).not.toHaveBeenCalled();
  });

  test('does not emit movePlayer when player is moving', () => {
    const { result } = renderHook(() => usePlayerMovement(mockSocket, true, mockGameInfo));

    const playersMovedHandler = mockSocket.on.mock.calls.find(call => call[0] === 'playersMoved')[1];
    act(() => {
      playersMovedHandler({
        movedPlayer: 'testUser',
        path: [{ row: 5, column: 5 }, { row: 6, column: 5 }]
      });
    });

    const position = { row: 6, column: 5 };

    act(() => {
      result.current.movePlayer(position);
    });

    expect(mockSocket.emit).not.toHaveBeenCalled();
  });

  test('emits rollDice event when rollDice is called and it is player turn', () => {
    const { result } = renderHook(() => usePlayerMovement(mockSocket, true, mockGameInfo));

    let rollResult;
    act(() => {
      rollResult = result.current.rollDice();
    });

    expect(mockSocket.emit).toHaveBeenCalledWith('rollDice');
    expect(rollResult).toBe(true);
  });

  test('does not emit rollDice when it is not player turn', () => {
    const { result } = renderHook(() => usePlayerMovement(mockSocket, false, mockGameInfo));

    let rollResult;
    act(() => {
      rollResult = result.current.rollDice();
    });

    expect(mockSocket.emit).not.toHaveBeenCalled();
    expect(rollResult).toBe(false);
  });
});