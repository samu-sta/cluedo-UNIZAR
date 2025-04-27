import { renderHook, act } from '@testing-library/react';
import { usePlayerCards } from '../../../../src/components/gameRoom/hooks/usePlayerCards';

describe('usePlayerCards hook', () => {
  const mockSocket = {
    on: jest.fn(),
    emit: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initializes with default values and registers socket events', () => {
    const { result } = renderHook(() => usePlayerCards(mockSocket));

    expect(result.current.playerCards).toEqual([]);
    expect(result.current.leftoverCards).toEqual([]);
    expect(result.current.cardsShown).toEqual([]);

    expect(mockSocket.on).toHaveBeenCalledWith('playerCards', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('gameStart', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('cardShown', expect.any(Function));
  });

  test('updates cards and responds to game events', () => {
    const { result } = renderHook(() => usePlayerCards(mockSocket));

    const playerCardsHandler = mockSocket.on.mock.calls.find(call => call[0] === 'playerCards')[1];
    const gameStartHandler = mockSocket.on.mock.calls.find(call => call[0] === 'gameStart')[1];
    const cardShownHandler = mockSocket.on.mock.calls.find(call => call[0] === 'cardShown')[1];

    const mockCards = [
      { type: 'suspect', name: 'Colonel Mustard' },
      { type: 'weapon', name: 'Candlestick' }
    ];

    const mockLeftoverCards = [
      { type: 'room', name: 'Kitchen' }
    ];

    act(() => {
      playerCardsHandler({
        cards: mockCards,
        leftoverCards: mockLeftoverCards
      });
    });

    expect(result.current.playerCards).toEqual(mockCards);
    expect(result.current.leftoverCards).toEqual(mockLeftoverCards);

    act(() => {
      gameStartHandler();
    });

    expect(mockSocket.emit).toHaveBeenCalledWith('requestCards');

    const shownCard = { type: 'suspect', name: 'Colonel Mustard' };

    act(() => {
      cardShownHandler({
        username: 'player1',
        card: shownCard
      });
    });

    expect(result.current.cardsShown).toContainEqual(shownCard);
  });

  test('requestCards emits requestCards event', () => {
    const { result } = renderHook(() => usePlayerCards(mockSocket));

    act(() => {
      result.current.requestCards();
    });

    expect(mockSocket.emit).toHaveBeenCalledWith('requestCards');
  });
});