/*************************************************
 * Pruebas para el hook useGameEndedModal
 * 
 * Verifica el comportamiento del modal de fin de juego,
 * incluyendo su aparición cuando la partida termina
 * y las opciones para el usuario tras finalizar.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import { renderHook, act } from '@testing-library/react';
import useGameEndedModal from '../../../../src/components/gameRoom/hooks/useGameEndedModal';

describe('useGameEndedModal hook', () => {

  test('correctly manages game ended modal state', () => {
    const { result, rerender } = renderHook((props) => useGameEndedModal(props), {
      initialProps: 'playing'
    });

    expect(result.current.showEndedModal).toBe(false);

    rerender('ended');

    expect(result.current.showEndedModal).toBe(true);

    act(() => {
      result.current.toogleEndedModal();
    });

    expect(result.current.showEndedModal).toBe(false);
  });
});