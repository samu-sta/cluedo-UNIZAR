/*************************************************
 * Pruebas para el hook useSuggestionResponseModal
 * 
 * Verifica el comportamiento del modal que muestra
 * las respuestas de otros jugadores a una sugerencia,
 * controlando su visibilidad y actualización.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import { renderHook, act } from '@testing-library/react';
import { useSuggestionResponseModal } from '../../../../src/components/gameRoom/hooks/useSuggestionResponseModal';

describe('useSuggestionResponseModal hook', () => {
  const mockSetSuggestionResponses = jest.fn();
  const mockSuggestionResponses = [];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('manages suggestion response modal visibility', () => {
    const { result, rerender } = renderHook(
      (props) => useSuggestionResponseModal(props),
      {
        initialProps: {
          hasSuggested: false,
          suggestionResponses: mockSuggestionResponses,
          setSuggestionResponses: mockSetSuggestionResponses
        }
      }
    );

    expect(result.current.showResponseModal).toBe(false);

    rerender({
      hasSuggested: true,
      suggestionResponses: mockSuggestionResponses,
      setSuggestionResponses: mockSetSuggestionResponses
    });

    expect(result.current.showResponseModal).toBe(true);

    act(() => {
      result.current.closeResponseModal();
    });

    expect(result.current.showResponseModal).toBe(false);
    expect(mockSetSuggestionResponses).toHaveBeenCalledWith([]);
  });
});