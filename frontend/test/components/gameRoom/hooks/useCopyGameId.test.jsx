import { renderHook, act } from '@testing-library/react';
import useCopyGameId from '../../../../src/components/gameRoom/hooks/useCopyGameId';

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn()
  }
});

jest.useFakeTimers();

describe('useCopyGameId hook', () => {
  const gameId = 'game-123';
  const mockHandleError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('copies game ID to clipboard and handles states', async () => {
    navigator.clipboard.writeText.mockResolvedValue(undefined);

    const { result } = renderHook(() => useCopyGameId({ gameId }));

    expect(result.current.copied).toBe(false);

    await act(async () => {
      result.current.handleCopyGameId();
      await Promise.resolve();
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(gameId);

    expect(result.current.copied).toBe(true);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.copied).toBe(false);
  });

  test('handles errors in clipboard copy', async () => {
    const mockError = new Error('Error en la copia al portapapeles');
    navigator.clipboard.writeText.mockRejectedValue(mockError);

    const { result } = renderHook(() => useCopyGameId({ gameId, handleError: mockHandleError }));

    await act(async () => {
      result.current.handleCopyGameId();
      await Promise.resolve();
    });

    expect(result.current.copied).toBe(false);

    expect(mockHandleError).toHaveBeenCalledWith(mockError);
  });
});