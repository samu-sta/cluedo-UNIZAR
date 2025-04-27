import { renderHook, act } from '@testing-library/react';
import useDeductions from '../../../../../../src/components/gameRoom/components/deductionTable/hooks/useDeductions';

jest.mock('../../../../../../src/components/common/hooks/useIsMobile', () => {
  return jest.fn(() => false);
});

describe('useDeductions Hook', () => {
  const mockGameInfo = {
    cards: [
      { id: 1, name: 'Coronel Rubio', type: 'character' },
      { id: 2, name: 'Señora Celeste', type: 'character' },
      { id: 3, name: 'Candelabro', type: 'weapon' },
      { id: 4, name: 'Pistola', type: 'weapon' },
      { id: 5, name: 'Cocina', type: 'room' },
      { id: 6, name: 'Salón', type: 'room' }
    ]
  };

  const mockPlayerCards = [
    { id: 1, name: 'Coronel Rubio', type: 'character' },
    { id: 3, name: 'Candelabro', type: 'weapon' }
  ];

  const mockLeftoverCards = [
    { id: 6, name: 'Salón', type: 'room' }
  ];

  const mockCardsShown = [
    { id: 4, name: 'Pistola', type: 'weapon' }
  ];

  test('should initialize deductions with the correct state', () => {
    const { result } = renderHook(() => useDeductions(mockGameInfo, mockPlayerCards, mockLeftoverCards, mockCardsShown));

    expect(result.current.deductions).toEqual({
      characters: {
        'Coronel Rubio': 'no',
        'Señora Celeste': 'unknown'
      },
      weapons: {
        'Candelabro': 'no',
        'Pistola': 'no'
      },
      rooms: {
        'Cocina': 'unknown',
        'Salón': 'no'
      }
    });
  });

  test('should correctly update the state of a deduction', () => {
    const { result } = renderHook(() => useDeductions(mockGameInfo, mockPlayerCards, mockLeftoverCards, mockCardsShown));

    act(() => {
      result.current.updateDeduction('characters', 'Señora Celeste');
    });
    expect(result.current.deductions.characters['Señora Celeste']).toBe('no');

    act(() => {
      result.current.updateDeduction('characters', 'Señora Celeste');
    });
    expect(result.current.deductions.characters['Señora Celeste']).toBe('yes');

    act(() => {
      result.current.updateDeduction('characters', 'Señora Celeste');
    });
    expect(result.current.deductions.characters['Señora Celeste']).toBe('maybe');

    act(() => {
      result.current.updateDeduction('characters', 'Señora Celeste');
    });
    expect(result.current.deductions.characters['Señora Celeste']).toBe('unknown');
  });

  test('should handle empty data without errors', () => {
    const { result } = renderHook(() => useDeductions(null));

    expect(result.current.deductions).toEqual({
      characters: {},
      weapons: {},
      rooms: {}
    });
  });
});