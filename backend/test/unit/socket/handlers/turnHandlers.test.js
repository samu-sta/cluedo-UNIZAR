/*************************************************
 * Test de los manejadores de turnos
 * 
 * Este test verifica los manejadores de eventos
 * socket.io para la gestión de turnos en el juego,
 * incluyendo el inicio, cambio y finalización de
 * turnos.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { GAME_STATES, SOCKET_EVENTS } from '../../../../src/config/constants.js';
import MESSAGES from '../../../../src/messages/messages.js';
import * as utils from '../../../../src/socket/handlers/utils.js';
import { handlePassTurn, handleRollDice, handleMovePlayer } from '../../../../src/socket/handlers/turnHandlers.js';

// Mock the utils module to control validateGameAction behavior
jest.mock('../../../../src/socket/handlers/utils.js', () => ({
  validateGameAction: jest.fn()
}));

describe('Turn Handlers', () => {
  let mockGameStateManager;
  let mockSocket;
  let mockIo;
  let gameId;
  let userId;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock GameStateManager with all required methods
    mockGameStateManager = {
      nextTurn: jest.fn(),
      getCanRollDice: jest.fn(),
      rollDice: jest.fn(),
      getValidMoves: jest.fn(),
      movePlayer: jest.fn(),
      getPlayers: jest.fn(),
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

  describe('handlePassTurn', () => {
    test('should not proceed if validateGameAction returns false', () => {
      // Arrange
      utils.validateGameAction.mockReturnValue(false);

      // Act
      handlePassTurn(mockGameStateManager, mockSocket, mockIo, gameId, userId);

      // Assert
      expect(utils.validateGameAction).toHaveBeenCalledWith(mockGameStateManager, mockSocket, gameId, userId);
      expect(mockGameStateManager.nextTurn).not.toHaveBeenCalled();
      expect(mockIo.to).not.toHaveBeenCalled();
    });

    test('should pass turn and emit turn update', () => {
      // Arrange
      utils.validateGameAction.mockReturnValue(true);
      mockGameStateManager.nextTurn.mockReturnValue('user456');

      // Act
      handlePassTurn(mockGameStateManager, mockSocket, mockIo, gameId, userId);

      // Assert
      expect(utils.validateGameAction).toHaveBeenCalledWith(mockGameStateManager, mockSocket, gameId, userId);
      expect(mockGameStateManager.nextTurn).toHaveBeenCalledWith(gameId);
      expect(mockIo.to).toHaveBeenCalledWith(gameId);
      expect(mockIo.emit).toHaveBeenCalledWith(SOCKET_EVENTS.TURN_UPDATE, { currentTurn: 'user456' });
    });

    test('should do nothing if nextTurn returns null', () => {
      // Arrange
      utils.validateGameAction.mockReturnValue(true);
      mockGameStateManager.nextTurn.mockReturnValue(null);

      // Act
      handlePassTurn(mockGameStateManager, mockSocket, mockIo, gameId, userId);

      // Assert
      expect(utils.validateGameAction).toHaveBeenCalledWith(mockGameStateManager, mockSocket, gameId, userId);
      expect(mockGameStateManager.nextTurn).toHaveBeenCalledWith(gameId);
      expect(mockIo.to).not.toHaveBeenCalled();
      expect(mockIo.emit).not.toHaveBeenCalled();
    });
  });

  describe('handleRollDice', () => {
    test('should not proceed if validateGameAction returns false', () => {
      // Arrange
      utils.validateGameAction.mockReturnValue(false);

      // Act
      handleRollDice(mockGameStateManager, mockSocket, mockIo, gameId, userId);

      // Assert
      expect(utils.validateGameAction).toHaveBeenCalledWith(mockGameStateManager, mockSocket, gameId, userId);
      expect(mockGameStateManager.getCanRollDice).not.toHaveBeenCalled();
      expect(mockGameStateManager.rollDice).not.toHaveBeenCalled();
    });

    test('should emit error if dice already rolled', () => {
      // Arrange
      utils.validateGameAction.mockReturnValue(true);
      mockGameStateManager.getCanRollDice.mockReturnValue(false);

      // Act
      handleRollDice(mockGameStateManager, mockSocket, mockIo, gameId, userId);

      // Assert
      expect(utils.validateGameAction).toHaveBeenCalledWith(mockGameStateManager, mockSocket, gameId, userId);
      expect(mockGameStateManager.getCanRollDice).toHaveBeenCalledWith(gameId);
      expect(mockSocket.emit).toHaveBeenCalledWith(SOCKET_EVENTS.ERROR, MESSAGES.DICE_ALREADY_ROLLED);
      expect(mockGameStateManager.rollDice).not.toHaveBeenCalled();
    });

    test('should roll dice and emit valid moves', () => {
      // Arrange
      utils.validateGameAction.mockReturnValue(true);
      mockGameStateManager.getCanRollDice.mockReturnValue(true);
      mockGameStateManager.rollDice.mockReturnValue({ diceResult1: 3, diceResult2: 4 });
      mockGameStateManager.getValidMoves.mockReturnValue([{ x: 1, y: 2 }, { x: 3, y: 4 }]);

      // Act
      handleRollDice(mockGameStateManager, mockSocket, mockIo, gameId, userId);

      // Assert
      expect(utils.validateGameAction).toHaveBeenCalledWith(mockGameStateManager, mockSocket, gameId, userId);
      expect(mockGameStateManager.getCanRollDice).toHaveBeenCalledWith(gameId);
      expect(mockGameStateManager.rollDice).toHaveBeenCalledWith(gameId);
      expect(mockGameStateManager.getValidMoves).toHaveBeenCalledWith(gameId, userId);
      expect(mockIo.to).toHaveBeenCalledWith(gameId);
      expect(mockIo.emit).toHaveBeenCalledWith(SOCKET_EVENTS.DICE_ROLLED, {
        diceResult: [3, 4],
        validMoves: [{ x: 1, y: 2 }, { x: 3, y: 4 }]
      });
    });
  });

  describe('handleMovePlayer', () => {
    test('should not proceed if validateGameAction returns false', () => {
      // Arrange
      utils.validateGameAction.mockReturnValue(false);
      const targetPosition = { x: 3, y: 4 };

      // Act
      handleMovePlayer(mockGameStateManager, mockSocket, mockIo, gameId, userId, targetPosition);

      // Assert
      expect(utils.validateGameAction).toHaveBeenCalledWith(mockGameStateManager, mockSocket, gameId, userId);
      expect(mockGameStateManager.movePlayer).not.toHaveBeenCalled();
    });

    test('should emit error for invalid move', () => {
      // Arrange
      utils.validateGameAction.mockReturnValue(true);
      const targetPosition = { x: 3, y: 4 };
      mockGameStateManager.movePlayer.mockReturnValue({ 
        success: false, 
        message: MESSAGES.INVALID_MOVE 
      });

      // Act
      handleMovePlayer(mockGameStateManager, mockSocket, mockIo, gameId, userId, targetPosition);

      // Assert
      expect(utils.validateGameAction).toHaveBeenCalledWith(mockGameStateManager, mockSocket, gameId, userId);
      expect(mockGameStateManager.movePlayer).toHaveBeenCalledWith(gameId, userId, targetPosition);
      expect(mockSocket.emit).toHaveBeenCalledWith(SOCKET_EVENTS.ERROR, MESSAGES.INVALID_MOVE);
      expect(mockGameStateManager.getPlayers).not.toHaveBeenCalled();
      expect(mockIo.to).not.toHaveBeenCalled();
    });

    test('should move player and emit success', () => {
      // Arrange
      utils.validateGameAction.mockReturnValue(true);
      const targetPosition = { x: 3, y: 4 };
      const path = [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 4 }];
      const players = [
        { id: 'user123', position: { x: 3, y: 4 } },
        { id: 'user456', position: { x: 5, y: 5 } }
      ];
      
      mockGameStateManager.movePlayer.mockReturnValue({ 
        success: true, 
        path 
      });
      mockGameStateManager.getPlayers.mockReturnValue(players);

      // Act
      handleMovePlayer(mockGameStateManager, mockSocket, mockIo, gameId, userId, targetPosition);

      // Assert
      expect(utils.validateGameAction).toHaveBeenCalledWith(mockGameStateManager, mockSocket, gameId, userId);
      expect(mockGameStateManager.movePlayer).toHaveBeenCalledWith(gameId, userId, targetPosition);
      expect(mockGameStateManager.getPlayers).toHaveBeenCalledWith(gameId);
      expect(mockIo.to).toHaveBeenCalledWith(gameId);
      expect(mockIo.emit).toHaveBeenCalledWith(SOCKET_EVENTS.PLAYERS_MOVED, {
        players,
        movedPlayer: userId,
        path
      });
      expect(mockSocket.emit).toHaveBeenCalledWith(SOCKET_EVENTS.MOVE_SUCCESS);
    });
  });
});