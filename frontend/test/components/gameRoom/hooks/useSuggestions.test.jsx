/*************************************************
 * Pruebas para el hook useSuggestions
 * 
 * Verifica la gestión de sugerencias y acusaciones
 * durante el juego, incluyendo la interfaz modal y
 * el intercambio de información entre jugadores.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import { renderHook, act } from '@testing-library/react';
import { useSuggestions } from '../../../../src/components/gameRoom/hooks/useSuggestions';

const mockLocalStorage = {
  getItem: jest.fn().mockImplementation((key) => {
    if (key === 'user') {
      return JSON.stringify({ username: 'testUser' });
    }
    return null;
  })
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('useSuggestions hook', () => {
  const mockSocket = {
    on: jest.fn(),
    emit: jest.fn()
  };

  const mockGameInfo = {
    players: [
      { username: 'testUser', position: { row: 10, column: 10 } }
    ],
    board: {
      rooms: [
        {
          name: 'Kitchen',
          doors: [{ row: 8, column: 8 }],
          walls: [
            { row: 5, column: 5 },
            { row: 5, column: 15 },
            { row: 15, column: 5 },
            { row: 15, column: 15 }
          ]
        }
      ]
    },
    hasRolled: true,
    hasMoved: true,
    hasSuggested: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initializes with default values', () => {
    const { result } = renderHook(() => useSuggestions(mockSocket, mockGameInfo, false));

    expect(result.current.currentRoom).toBeNull();
    expect(result.current.canMakeSuggestion).toBe(false);
    expect(result.current.showSuggestionModal).toBe(false);
    expect(result.current.showAccusationModal).toBe(false);
    expect(result.current.currentSuggestion).toBeNull();
    expect(result.current.showCardModal).toBe(false);
    expect(result.current.suggestionResponses).toEqual([]);
    expect(result.current.incorrectAccusation).toBe(false);
  });

  test('registers socket event listeners on mount', () => {
    renderHook(() => useSuggestions(mockSocket, mockGameInfo, false));

    expect(mockSocket.on).toHaveBeenCalledWith('currentSuggestion', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('incorrectAccusation', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('cardShown', expect.any(Function));
  });

  test('sets currentSuggestion and showCardModal when currentSuggestion event is received', () => {
    const { result } = renderHook(() => useSuggestions(mockSocket, mockGameInfo, false));

    const suggestionHandler = mockSocket.on.mock.calls.find(call => call[0] === 'currentSuggestion')[1];

    const mockSuggestion = {
      suspect: 'Colonel Mustard',
      weapon: 'Candlestick',
      room: 'Kitchen'
    };

    act(() => {
      suggestionHandler({ suggestion: mockSuggestion });
    });

    expect(result.current.currentSuggestion).toEqual(mockSuggestion);
    expect(result.current.showCardModal).toBe(true);
  });

  test('sets incorrectAccusation when incorrectAccusation event is received', () => {
    const { result } = renderHook(() => useSuggestions(mockSocket, mockGameInfo, false));

    const accusationHandler = mockSocket.on.mock.calls.find(call => call[0] === 'incorrectAccusation')[1];

    act(() => {
      accusationHandler({ message: 'Your accusation was incorrect' });
    });

    expect(result.current.incorrectAccusation).toBe(true);
    expect(result.current.incorrectAccusationMessage).toBe('Your accusation was incorrect');
  });

  test('adds card to suggestionResponses when cardShown event is received', () => {
    const { result } = renderHook(() => useSuggestions(mockSocket, mockGameInfo, false));

    const cardShownHandler = mockSocket.on.mock.calls.find(call => call[0] === 'cardShown')[1];

    const mockCard = { name: 'Kitchen', type: 'room', id: '1' };

    act(() => {
      cardShownHandler({ username: 'player1', card: mockCard });
    });

    expect(result.current.suggestionResponses).toEqual([
      { username: 'player1', card: mockCard }
    ]);
  });

  test('detects if player is in a room', () => {
    const gameInfoWithPlayerInRoom = {
      ...mockGameInfo,
      players: [
        { username: 'testUser', position: { row: 10, column: 10 } }
      ]
    };

    const { result } = renderHook(() => useSuggestions(mockSocket, gameInfoWithPlayerInRoom, true));

    let isInRoom;
    act(() => {
      isInRoom = result.current.checkIfInRoom();
    });

    expect(isInRoom).toBe(true);
    expect(result.current.currentRoom).toBe('Kitchen');
  });

  test('allows suggestion when player is in a room and it is their turn', () => {
    const gameInfoWithPlayerInRoom = {
      ...mockGameInfo,
      players: [
        { username: 'testUser', position: { row: 10, column: 10 } }
      ]
    };

    const { result } = renderHook(() => useSuggestions(mockSocket, gameInfoWithPlayerInRoom, true));

    expect(result.current.canMakeSuggestion).toBe(true);
  });

  test('does not allow suggestion when player is not in a room', () => {
    const gameInfoWithPlayerNotInRoom = {
      ...mockGameInfo,
      players: [
        { username: 'testUser', position: { row: 2, column: 2 } }
      ]
    };

    const { result } = renderHook(() => useSuggestions(mockSocket, gameInfoWithPlayerNotInRoom, true));

    expect(result.current.canMakeSuggestion).toBe(false);
  });

  test('does not allow suggestion when it is not player turn', () => {
    const { result } = renderHook(() => useSuggestions(mockSocket, mockGameInfo, false));

    expect(result.current.canMakeSuggestion).toBe(false);
  });

  test('emits makeSuggestion event when makeSuggestion is called', () => {
    const { result } = renderHook(() => useSuggestions(mockSocket, mockGameInfo, true));

    Object.defineProperty(result.current, 'canMakeSuggestion', { value: true });

    const suggestion = {
      suspect: 'Colonel Mustard',
      weapon: 'Candlestick',
      room: 'Kitchen'
    };

    act(() => {
      result.current.makeSuggestion(suggestion);
    });

    expect(mockSocket.emit).toHaveBeenCalledWith('makeSuggestion', suggestion);
  });

  test('emits makeAccusation event when makeAccusation is called', () => {
    const { result } = renderHook(() => useSuggestions(mockSocket, mockGameInfo, true));

    const accusation = {
      suspect: 'Colonel Mustard',
      weapon: 'Candlestick',
      room: 'Kitchen'
    };

    act(() => {
      result.current.makeAccusation(accusation);
    });

    expect(mockSocket.emit).toHaveBeenCalledWith('makeAccusation', accusation);
  });

  test('emits showCard event when showCard is called', () => {
    const { result } = renderHook(() => useSuggestions(mockSocket, mockGameInfo, true));

    const card = { name: 'Kitchen', type: 'room', id: '1' };

    act(() => {
      result.current.showCard(card);
    });

    expect(mockSocket.emit).toHaveBeenCalledWith('showCard', card);
  });

  test('resets state when resetSuggestions is called', () => {
    const { result } = renderHook(() => useSuggestions(mockSocket, mockGameInfo, true));

    act(() => {
      result.current.setSuggestionResponses([{ username: 'player1', card: { name: 'Kitchen' } }]);
      result.current.setShowSuggestionModal(true);
      result.current.setShowAccusationModal(true);
    });

    act(() => {
      result.current.resetSuggestions();
    });

    expect(result.current.suggestionResponses).toEqual([]);
    expect(result.current.currentSuggestion).toBeNull();
    expect(result.current.showCardModal).toBe(false);
    expect(result.current.showSuggestionModal).toBe(false);
    expect(result.current.showAccusationModal).toBe(false);
    expect(result.current.incorrectAccusation).toBe(false);
  });
});