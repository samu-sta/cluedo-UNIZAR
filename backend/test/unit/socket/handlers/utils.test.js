/*************************************************
 * Test de utilidades para manejadores de socket
 * 
 * Este test verifica las funciones de utilidad usadas
 * por los manejadores de socket.io, incluyendo la
 * validación de acciones de juego y gestión de datos.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { GAME_STATES, SOCKET_EVENTS } from '../../../../src/config/constants.js';
import MESSAGES from '../../../../src/messages/messages.js';
import { validateGameAction, endGame } from '../../../../src/socket/handlers/utils.js';

describe('Socket Handler Utils', () => {
  let mockGameStateManager;
  let mockSocket;
  let mockIo;
  let gameId;
  let userId;

  beforeEach(() => {
    // Mock GameStateManager
    mockGameStateManager = {
      getGameState: jest.fn(),
      isPlayerTurn: jest.fn(),
      setGameState: jest.fn()
    };

    // Mock Socket
    mockSocket = {
      emit: jest.fn()
    };

    // Mock Socket.io
    mockIo = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn()
    };

    // Test data
    gameId = 'game123';
    userId = 'user123';
  });

  describe('validateGameAction', () => {
    test('should return false if game is not in PLAYING state', () => {
      // Arrange
      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.WAITING);
      
      // Act
      const result = validateGameAction(mockGameStateManager, mockSocket, gameId, userId);
      
      // Assert
      expect(result).toBe(false);
      expect(mockGameStateManager.getGameState).toHaveBeenCalledWith(gameId);
      expect(mockSocket.emit).toHaveBeenCalledWith(SOCKET_EVENTS.ERROR, MESSAGES.GAME_NOT_IN_PROGRESS);
      expect(mockGameStateManager.isPlayerTurn).not.toHaveBeenCalled();
    });

    test('should return false if it is not player turn', () => {
      // Arrange
      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      mockGameStateManager.isPlayerTurn.mockReturnValue(false);
      
      // Act
      const result = validateGameAction(mockGameStateManager, mockSocket, gameId, userId);
      
      // Assert
      expect(result).toBe(false);
      expect(mockGameStateManager.getGameState).toHaveBeenCalledWith(gameId);
      expect(mockGameStateManager.isPlayerTurn).toHaveBeenCalledWith(gameId, userId);
      expect(mockSocket.emit).toHaveBeenCalledWith(SOCKET_EVENTS.ERROR, MESSAGES.NOT_YOUR_TURN);
    });

    test('should return true if game is in PLAYING state and it is player turn', () => {
      // Arrange
      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      mockGameStateManager.isPlayerTurn.mockReturnValue(true);
      
      // Act
      const result = validateGameAction(mockGameStateManager, mockSocket, gameId, userId);
      
      // Assert
      expect(result).toBe(true);
      expect(mockGameStateManager.getGameState).toHaveBeenCalledWith(gameId);
      expect(mockGameStateManager.isPlayerTurn).toHaveBeenCalledWith(gameId, userId);
      expect(mockSocket.emit).not.toHaveBeenCalled();
    });
  });

  describe('endGame', () => {
    test('should update game state and emit end event with reason and winner', () => {
      // Arrange
      const reason = 'Player won';
      const winner = 'Player 1';
      
      // Act
      endGame(mockGameStateManager, mockIo, gameId, reason, winner);
      
      // Assert
      expect(mockGameStateManager.setGameState).toHaveBeenCalledWith(gameId, GAME_STATES.ENDED);
      expect(mockIo.to).toHaveBeenCalledWith(gameId);
      expect(mockIo.emit).toHaveBeenCalledWith(SOCKET_EVENTS.GAME_END, { 
        reason, 
        winner,
        solution: null 
      });
    });

    test('should include solution in the end game event if provided', () => {
      // Arrange
      const reason = 'Player accused correctly';
      const winner = 'Player 1';
      const solution = {
        room: 'Kitchen',
        suspect: 'Colonel Mustard',
        weapon: 'Knife'
      };
      
      // Act
      endGame(mockGameStateManager, mockIo, gameId, reason, winner, solution);
      
      // Assert
      expect(mockGameStateManager.setGameState).toHaveBeenCalledWith(gameId, GAME_STATES.ENDED);
      expect(mockIo.to).toHaveBeenCalledWith(gameId);
      expect(mockIo.emit).toHaveBeenCalledWith(SOCKET_EVENTS.GAME_END, { 
        reason, 
        winner, 
        solution 
      });
    });
  });
});