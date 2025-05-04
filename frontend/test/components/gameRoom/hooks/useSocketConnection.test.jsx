/**
 * @fileoverview Tests for useSocketConnection hook which manages the WebSocket connection to the game server.
 * @author Samuel Felipe
 */
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSocketConnection } from '../../../../src/components/gameRoom/hooks/useSocketConnection';
import { joinGame } from '../../../../src/services/Game';
import { initSocket, closeSocket } from '../../../../src/services/Socket';

jest.mock('../../../../src/services/Game', () => ({
  joinGame: jest.fn()
}));
jest.mock('../../../../src/services/Socket', () => ({
  initSocket: jest.fn(),
  closeSocket: jest.fn()
}));

describe('useSocketConnection hook', () => {
  const gameId = 'game-123';
  const mockSocketInstance = { id: 'mock-socket-id' };
  const mockGameInfo = { id: gameId, name: 'Test Game' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initializes with loading state and handles successful connection', async () => {
    joinGame.mockResolvedValue({
      success: true,
      gameInfo: mockGameInfo,
      socketToken: 'mock-socket-token'
    });

    initSocket.mockReturnValue(mockSocketInstance);

    const { result } = renderHook(() => useSocketConnection(gameId));

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.gameInfo).toBeNull();
    expect(result.current.socket).toBeNull();

    await waitFor(() => {
      expect(result.current.gameInfo).toEqual(mockGameInfo);
    });

    expect(joinGame).toHaveBeenCalledWith(gameId);
    expect(initSocket).toHaveBeenCalledWith('mock-socket-token');
    expect(result.current.socket).toEqual(mockSocketInstance);
  });

  test('handles connection errors', async () => {
    joinGame.mockResolvedValue({
      success: false,
      error: 'Error de prueba'
    });

    const { result } = renderHook(() => useSocketConnection(gameId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Error de prueba');
    expect(result.current.gameInfo).toBeNull();
    expect(result.current.socket).toBeNull();
    expect(initSocket).not.toHaveBeenCalled();
  });

  test('leaveGame closes the connection and resets the state', async () => {
    joinGame.mockResolvedValue({
      success: true,
      gameInfo: mockGameInfo,
      socketToken: 'mock-socket-token'
    });

    initSocket.mockReturnValue(mockSocketInstance);

    const { result } = renderHook(() => useSocketConnection(gameId));

    await waitFor(() => {
      expect(result.current.gameInfo).toEqual(mockGameInfo);
    });

    expect(result.current.socket).toEqual(mockSocketInstance);

    act(() => {
      result.current.leaveGame();
    });

    expect(closeSocket).toHaveBeenCalled();

    const { result: newResult } = renderHook(() => useSocketConnection(gameId));
    expect(newResult.current.socket).toBeNull();
  });
});