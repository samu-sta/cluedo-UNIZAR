/*************************************************
 * Pruebas para el componente StartGames
 * 
 * Verifica que la página de inicio de partidas funcione
 * correctamente, permitiendo al usuario crear nuevas
 * partidas o unirse a partidas existentes.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import StartGames from '../../../src/components/startGames/StartGames';
import useStartGames from '../../../src/components/startGames/hooks/useStartGames';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../../src/components/startGames/hooks/useStartGames', () => jest.fn());

describe('StartGames Component', () => {
  const testUser = { id: 1, username: 'testuser' };
  const mockGameResponses = {
    create: {
      success: true,
      gameId: 'test-game-123',
      gameInfo: { players: [{ id: 1, username: 'testuser' }] },
      socketToken: 'socket-token-123'
    },
    random: {
      success: true,
      gameId: 'random-game-456',
      gameInfo: { players: [{ id: 1, username: 'testuser' }, { id: 2, username: 'other-player' }] },
      socketToken: 'socket-token-456'
    },
    join: {
      success: true,
      gameId: 'join-game-789',
      gameInfo: { players: [{ id: 1, username: 'creator' }, { id: 2, username: 'testuser' }] },
      socketToken: 'socket-token-789'
    }
  };

  let mockNavigate;
  let mockUseStartGames;

  beforeEach(() => {
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    mockUseStartGames = {
      isLoading: false,
      error: null,
      gameId: '',
      handleCreateGame: jest.fn(),
      handleJoinGame: jest.fn(),
      handleFindRandomGame: jest.fn(),
      handleGameIdChange: jest.fn(),
      clearError: jest.fn(),
    };

    useStartGames.mockReturnValue(mockUseStartGames);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Autenticación y renderizado', () => {
    test('redirige a login si el usuario no está autenticado', () => {
      render(<StartGames user={null} />);
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    test('renderiza correctamente con un usuario con sesión iniciada', () => {
      render(<StartGames user={testUser} />);

      expect(screen.getByText(/Partidas de/i)).toBeInTheDocument();
      expect(screen.getByText(/Cluedo UNIZAR/i)).toBeInTheDocument();

      expect(screen.getByText(/Crear nueva partida/i)).toBeInTheDocument();
      expect(screen.getByText(/Buscar partida/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/ID de la partida/i)).toBeInTheDocument();
      expect(screen.getByText(/Unirse/i)).toBeInTheDocument();
    });
  });

  describe('Estados de interfaz', () => {
    test('muestra estados de carga cuando isLoading es true', () => {
      mockUseStartGames.isLoading = true;
      useStartGames.mockReturnValue(mockUseStartGames);

      render(<StartGames user={testUser} />);

      expect(screen.getByText(/Creando partida.../i)).toBeInTheDocument();
      expect(screen.getByText(/Buscando partida.../i)).toBeInTheDocument();
      expect(screen.getByText(/Uniéndose.../i)).toBeInTheDocument();
    });

    test('muestra mensaje de error cuando existe un error', () => {
      const errorMessage = 'Error de prueba';
      mockUseStartGames.error = errorMessage;
      useStartGames.mockReturnValue(mockUseStartGames);

      render(<StartGames user={testUser} />);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    test('deshabilita botones cuando isLoading es true', () => {
      mockUseStartGames.isLoading = true;
      useStartGames.mockReturnValue(mockUseStartGames);

      render(<StartGames user={testUser} />);

      const buttons = {
        create: screen.getByText(/Creando partida.../i),
        find: screen.getByText(/Buscando partida.../i),
        join: screen.getByText(/Uniéndose.../i)
      };
      const input = screen.getByPlaceholderText(/ID de la partida/i);

      Object.values(buttons).forEach(button => expect(button).toBeDisabled());
      expect(input).toBeDisabled();
    });
  });

  describe('Interacciones del usuario', () => {
    test('llama a handleCreateGame al hacer clic en el botón de crear partida', () => {
      render(<StartGames user={testUser} />);

      fireEvent.click(screen.getByText(/Crear nueva partida/i));
      expect(mockUseStartGames.handleCreateGame).toHaveBeenCalledTimes(1);
    });

    test('llama a handleFindRandomGame al hacer clic en el botón de buscar partida', () => {
      render(<StartGames user={testUser} />);

      fireEvent.click(screen.getByText(/Buscar partida/i));
      expect(mockUseStartGames.handleFindRandomGame).toHaveBeenCalledTimes(1);
    });

    test('llama a handleJoinGame al enviar el formulario de unirse', () => {
      render(<StartGames user={testUser} />);

      const joinForm = screen.getByRole('button', { name: /unirse/i }).closest('form');
      fireEvent.submit(joinForm);

      expect(mockUseStartGames.handleJoinGame).toHaveBeenCalledTimes(1);
    });

    test('llama a handleGameIdChange cuando cambia el input', () => {
      render(<StartGames user={testUser} />);

      const input = screen.getByPlaceholderText(/ID de la partida/i);
      fireEvent.change(input, { target: { value: 'test-game-id' } });

      expect(mockUseStartGames.handleGameIdChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('Integración de respuestas exitosas', () => {
    test('handleCreateGame procesa correctamente una respuesta exitosa', async () => {
      mockUseStartGames.handleCreateGame.mockResolvedValue(mockGameResponses.create);
      useStartGames.mockReturnValue(mockUseStartGames);

      render(<StartGames user={testUser} />);

      fireEvent.click(screen.getByText(/Crear nueva partida/i));

      await waitFor(() => {
        expect(mockUseStartGames.handleCreateGame).toHaveBeenCalledTimes(1);
      });

      const result = await mockUseStartGames.handleCreateGame.mock.results[0].value;
      expect(result).toEqual(mockGameResponses.create);
    });

    test('handleFindRandomGame procesa correctamente una respuesta exitosa', async () => {
      mockUseStartGames.handleFindRandomGame.mockResolvedValue(mockGameResponses.random);
      useStartGames.mockReturnValue(mockUseStartGames);

      render(<StartGames user={testUser} />);

      fireEvent.click(screen.getByText(/Buscar partida/i));

      await waitFor(() => {
        expect(mockUseStartGames.handleFindRandomGame).toHaveBeenCalledTimes(1);
      });

      const result = await mockUseStartGames.handleFindRandomGame.mock.results[0].value;
      expect(result).toEqual(mockGameResponses.random);
    });

    test('handleJoinGame procesa correctamente una respuesta exitosa', async () => {
      const joinGameId = 'join-game-789';
      mockUseStartGames.gameId = joinGameId;
      mockUseStartGames.handleJoinGame.mockImplementation(e => {
        e.preventDefault();
        return Promise.resolve(mockGameResponses.join);
      });
      useStartGames.mockReturnValue(mockUseStartGames);

      render(<StartGames user={testUser} />);

      const joinForm = screen.getByRole('button', { name: /unirse/i }).closest('form');
      fireEvent.submit(joinForm);

      await waitFor(() => {
        expect(mockUseStartGames.handleJoinGame).toHaveBeenCalledTimes(1);
      });

      const result = await mockUseStartGames.handleJoinGame.mock.results[0].value;
      expect(result).toEqual(mockGameResponses.join);
    });
  });
});