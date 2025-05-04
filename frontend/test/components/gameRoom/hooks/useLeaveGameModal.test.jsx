/*************************************************
 * Pruebas para el hook useLeaveGameModal
 * 
 * Verifica el comportamiento del modal de confirmación
 * para abandonar la partida, controlando el flujo de
 * confirmación y cancelación de esta acción.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import { renderHook, act } from '@testing-library/react';
import useLeaveGameModal from '../../../../src/components/gameRoom/hooks/useLeaveGameModal';

describe('useLeaveGameModal hook', () => {
  const mockLeaveGame = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('handles opening, closing and confirming game leave', () => {
    const { result } = renderHook(() => useLeaveGameModal({ onLeaveGame: mockLeaveGame }));

    expect(result.current.showModal).toBe(false);

    act(() => {
      result.current.handleOpenModal();
    });

    expect(result.current.showModal).toBe(true);

    act(() => {
      result.current.handleCloseModal();
    });

    expect(result.current.showModal).toBe(false);

    act(() => {
      result.current.handleOpenModal();
    });

    act(() => {
      result.current.handleConfirmLeave();
    });

    expect(result.current.showModal).toBe(false);
    expect(mockLeaveGame).toHaveBeenCalled();
  });
});