/*************************************************
 * Pruebas para el hook useStartGames
 * 
 * Verifica la lógica del hook que gestiona la creación
 * y unión a partidas, incluyendo el manejo de estado,
 * errores y respuestas del servidor.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import { renderHook, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import useStartGames from '../../../../src/components/startGames/hooks/useStartGames';
import { createGame, joinGame, findRandomGame } from '../../../../src/services/Game';
import React from 'react';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../../../src/services/Game', () => ({
  createGame: jest.fn(),
  joinGame: jest.fn(),
  findRandomGame: jest.fn(),
}));

describe('useStartGames Hook', () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    jest.clearAllMocks();
  });

  test('should initialize with default values', () => {
    const { result } = renderHook(() => useStartGames());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.gameId).toBe('');
  });

  test('should update gameId when handleGameIdChange is called', () => {
    const { result } = renderHook(() => useStartGames());

    act(() => {
      result.current.handleGameIdChange({ target: { value: 'test-game-id' } });
    });

    expect(result.current.gameId).toBe('test-game-id');
  });

  test('should clear error when clearError is called', () => {
    let errorState = ["Test error", jest.fn(val => { errorState[0] = val; })];
    jest.spyOn(React, 'useState').mockImplementation(init => {
      if (init === null) {
        return errorState;
      }
      return [init, jest.fn()];
    });

    const { result } = renderHook(() => useStartGames());

    expect(result.current.error).toBe("Test error");

    act(() => {
      result.current.clearError();
    });

    expect(errorState[0]).toBeNull();

    React.useState.mockRestore();
  });

  test('handleCreateGame should navigate to game page on success', async () => {
    createGame.mockResolvedValue({ success: true, gameId: 'new-game-id' });

    const loadingStateMock = [false, jest.fn(val => { loadingStateMock[0] = val; })];
    const errorStateMock = [null, jest.fn(val => { errorStateMock[0] = val; })];

    jest.spyOn(React, 'useState').mockImplementation(init => {
      if (init === false) return loadingStateMock;
      if (init === null) return errorStateMock;
      return [init, jest.fn()];
    });

    const { result } = renderHook(() => useStartGames());

    await act(async () => {
      await result.current.handleCreateGame();
      loadingStateMock[0] = false;
    });

    expect(createGame).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/game/new-game-id');
    expect(loadingStateMock[0]).toBe(false);

    React.useState.mockRestore();
  });

  test('handleCreateGame should set error on failure', async () => {
    createGame.mockResolvedValue({ success: false, error: 'Error creating game' });

    const loadingStateMock = [false, jest.fn(val => { loadingStateMock[0] = val; })];
    const errorStateMock = [null, jest.fn(val => { errorStateMock[0] = val; })];

    jest.spyOn(React, 'useState').mockImplementation(init => {
      if (init === false) return loadingStateMock;
      if (init === null) return errorStateMock;
      return [init, jest.fn()];
    });

    const { result } = renderHook(() => useStartGames());

    await act(async () => {
      await result.current.handleCreateGame();
    });

    expect(createGame).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(errorStateMock[0]).toBe('Error creating game');
    expect(loadingStateMock[0]).toBe(false);

    React.useState.mockRestore();
  });

  test('handleCreateGame should handle exceptions', async () => {
    createGame.mockRejectedValue(new Error('Connection error'));

    const loadingStateMock = [false, jest.fn(val => { loadingStateMock[0] = val; })];
    const errorStateMock = [null, jest.fn(val => { errorStateMock[0] = val; })];

    jest.spyOn(React, 'useState').mockImplementation(init => {
      if (init === false) return loadingStateMock;
      if (init === null) return errorStateMock;
      return [init, jest.fn()];
    });

    const { result } = renderHook(() => useStartGames());

    await act(async () => {
      await result.current.handleCreateGame();
    });

    expect(createGame).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(errorStateMock[0]).toBe('Error de conexión al servidor');
    expect(loadingStateMock[0]).toBe(false);

    React.useState.mockRestore();
  });

  test('handleJoinGame should navigate to game page on success', async () => {
    joinGame.mockResolvedValue({ success: true, gameId: 'existing-game-id' });

    const { result } = renderHook(() => useStartGames());

    const mockEvent = {
      preventDefault: jest.fn(),
      target: {
        get: jest.fn()
      }
    };

    const originalFormData = global.FormData;
    global.FormData = jest.fn(() => ({
      get: jest.fn().mockReturnValue('existing-game-id')
    }));

    await act(async () => {
      await result.current.handleJoinGame(mockEvent);
    });

    global.FormData = originalFormData;

    expect(joinGame).toHaveBeenCalledWith('existing-game-id');
    expect(mockNavigate).toHaveBeenCalledWith('/game/existing-game-id');
  });

  test('handleJoinGame should set error if no gameId provided', async () => {
    const { result } = renderHook(() => useStartGames());

    const mockEvent = {
      preventDefault: jest.fn(),
      target: {
        get: jest.fn()
      }
    };

    const originalFormData = global.FormData;
    global.FormData = jest.fn(() => ({
      get: jest.fn().mockReturnValue('')
    }));

    await act(async () => {
      await result.current.handleJoinGame(mockEvent);
    });

    global.FormData = originalFormData;

    expect(joinGame).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(result.current.error).toBe('Introduce un ID de partida válido');
  });

  test('handleJoinGame should set error on failure', async () => {
    joinGame.mockResolvedValue({ success: false, error: 'Game not found' });

    const { result } = renderHook(() => useStartGames());

    const mockEvent = {
      preventDefault: jest.fn(),
      target: {
        get: jest.fn()
      }
    };

    const originalFormData = global.FormData;
    global.FormData = jest.fn(() => ({
      get: jest.fn().mockReturnValue('invalid-game-id')
    }));

    await act(async () => {
      await result.current.handleJoinGame(mockEvent);
    });

    global.FormData = originalFormData;

    expect(joinGame).toHaveBeenCalledWith('invalid-game-id');
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(result.current.error).toBe('Game not found');
  });

  test('handleFindRandomGame should navigate to game page on success', async () => {
    findRandomGame.mockResolvedValue({ success: true, gameId: 'random-game-id' });

    const { result } = renderHook(() => useStartGames());

    await act(async () => {
      await result.current.handleFindRandomGame();
    });

    expect(findRandomGame).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/game/random-game-id');
  });

  test('handleFindRandomGame should set error on failure', async () => {
    findRandomGame.mockResolvedValue({ success: false });

    const { result } = renderHook(() => useStartGames());

    await act(async () => {
      await result.current.handleFindRandomGame();
    });

    expect(findRandomGame).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(result.current.error).toBe('No hay partidas disponibles');
  });
});