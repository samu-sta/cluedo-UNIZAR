import { jest } from '@jest/globals';
import { handlePassTurn, handleRollDice, handleMovePlayer } from '../../../src/socket/handlers/turnHandlers.js';
import { SOCKET_EVENTS, GAME_STATES } from '../../../src/config/constants.js';
import MESSAGES from '../../../src/messages/messages.js';

// Mock the dependencies
jest.mock('../../../src/messages/messages.js', () => ({
  DICE_ALREADY_ROLLED: 'Dice already rolled this turn',
  NOT_YOUR_TURN: 'Not your turn',
  INVALID_MOVE: 'Invalid move',
  GAME_NOT_IN_PROGRESS: 'Game not in progress'
}));

describe('turnHandlers', () => {
  // Common mocks
  let mockSocket;
  let mockIo;
  let mockGameStateManager;
  const gameId = 'game123';
  const userId = 'user123';

  beforeEach(() => {
    // Set up mocks
    mockSocket = {
      gameId,
      userId,
      emit: jest.fn()
    };

    mockIo = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn()
    };

    mockGameStateManager = {
      isPlayerTurn: jest.fn(),
      getGameState: jest.fn(),
      nextTurn: jest.fn(),
      getCanRollDice: jest.fn(),
      rollDice: jest.fn(),
      getValidMoves: jest.fn(),
      movePlayer: jest.fn(),
      getPlayers: jest.fn(),
      getCurrentTurnPlayer: jest.fn(),
      getCurrentTurnPlayerName: jest.fn()
    };
  });

  describe('handlePassTurn', () => {
    test('should pass turn and emit turn update', () => {
      // Arrange
      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      mockGameStateManager.isPlayerTurn.mockReturnValue(true);
      mockGameStateManager.nextTurn.mockReturnValue({
        playerId: 'user456',
        playerName: 'Player 2',
        turnIndex: 1,
        totalPlayers: 2
      });

      // Act
      handlePassTurn(mockGameStateManager, mockSocket, mockIo, gameId, userId);

      // Assert
      expect(mockGameStateManager.nextTurn).toHaveBeenCalledWith(gameId);
      expect(mockIo.to).toHaveBeenCalledWith(gameId);
      expect(mockIo.emit).toHaveBeenCalledWith(SOCKET_EVENTS.TURN_UPDATE, {
        currentTurn: {
          playerId: 'user456',
          playerName: 'Player 2',
          turnIndex: 1,
          totalPlayers: 2
        }
      });
    });

    test('should do nothing if not current player turn', () => {
      // Arrange
      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      mockGameStateManager.isPlayerTurn.mockReturnValue(false);

      // Act
      handlePassTurn(mockGameStateManager, mockSocket, mockIo, gameId, userId);

      // Assert
      expect(mockGameStateManager.nextTurn).not.toHaveBeenCalled();
      expect(mockSocket.emit).toHaveBeenCalledWith(SOCKET_EVENTS.ERROR, MESSAGES.NOT_YOUR_TURN);
    });

    test('should do nothing if nextTurn returns null', () => {
      // Arrange
      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      mockGameStateManager.isPlayerTurn.mockReturnValue(true);
      mockGameStateManager.nextTurn.mockReturnValue(null);

      // Act
      handlePassTurn(mockGameStateManager, mockSocket, mockIo, gameId, userId);

      // Assert
      expect(mockGameStateManager.nextTurn).toHaveBeenCalledWith(gameId);
      expect(mockIo.to).not.toHaveBeenCalled();
      expect(mockIo.emit).not.toHaveBeenCalled();
    });
  });

  describe('handleRollDice', () => {
    test('should roll dice and emit valid moves', () => {
      // Arrange
      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      mockGameStateManager.isPlayerTurn.mockReturnValue(true);
      mockGameStateManager.getCanRollDice.mockReturnValue(true);
      mockGameStateManager.rollDice.mockReturnValue({ dice1: 3, dice2: 4 });
      mockGameStateManager.getValidMoves.mockReturnValue([{ row: 1, column: 2 }, { row: 2, column: 3 }]);

      // Act
      handleRollDice(mockGameStateManager, mockSocket, mockIo, gameId, userId);

      // Assert
      expect(mockGameStateManager.getCanRollDice).toHaveBeenCalledWith(gameId);
      expect(mockGameStateManager.rollDice).toHaveBeenCalledWith(gameId);
      expect(mockGameStateManager.getValidMoves).toHaveBeenCalledWith(gameId, userId);
      expect(mockIo.to).toHaveBeenCalledWith(gameId);
      
      // Verify the content using a custom matcher to ignore exact structure
      const emitCall = mockIo.emit.mock.calls[0];
      expect(emitCall[0]).toBe(SOCKET_EVENTS.DICE_ROLLED);
      expect(emitCall[1]).toHaveProperty('validMoves');
      expect(Array.isArray(emitCall[1].validMoves)).toBe(true);
      expect(emitCall[1].validMoves.length).toBe(2);
    });

    test('should emit error if dice already rolled', () => {
      // Arrange
      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      mockGameStateManager.isPlayerTurn.mockReturnValue(true);
      mockGameStateManager.getCanRollDice.mockReturnValue(false);

      // Act
      handleRollDice(mockGameStateManager, mockSocket, mockIo, gameId, userId);

      // Assert
      expect(mockGameStateManager.getCanRollDice).toHaveBeenCalledWith(gameId);
      expect(mockSocket.emit).toHaveBeenCalledWith(SOCKET_EVENTS.ERROR, MESSAGES.DICE_ALREADY_ROLLED);
      expect(mockGameStateManager.rollDice).not.toHaveBeenCalled();
      expect(mockIo.to).not.toHaveBeenCalled();
    });

    test('should do nothing if not current player turn', () => {
      // Arrange
      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      mockGameStateManager.isPlayerTurn.mockReturnValue(false);

      // Act
      handleRollDice(mockGameStateManager, mockSocket, mockIo, gameId, userId);

      // Assert
      expect(mockGameStateManager.getCanRollDice).not.toHaveBeenCalled();
      expect(mockGameStateManager.rollDice).not.toHaveBeenCalled();
      expect(mockSocket.emit).toHaveBeenCalledWith(SOCKET_EVENTS.ERROR, MESSAGES.NOT_YOUR_TURN);
    });
  });

  describe('handleMovePlayer', () => {
    test('should move player and emit success', () => {
      // Arrange
      const targetPosition = { row: 3, column: 4 };
      const players = [
        { id: userId, position: targetPosition },
        { id: 'user456', position: { row: 5, column: 6 } }
      ];
      const path = [{ row: 1, column: 1 }, { row: 2, column: 2 }, targetPosition];

      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      mockGameStateManager.isPlayerTurn.mockReturnValue(true);
      mockGameStateManager.movePlayer.mockReturnValue({ success: true, path });
      mockGameStateManager.getPlayers.mockReturnValue(players);

      // Act
      handleMovePlayer(mockGameStateManager, mockSocket, mockIo, gameId, userId, targetPosition);

      // Assert
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

    test('should emit error for invalid move', () => {
      // Arrange
      const targetPosition = { row: 3, column: 4 };
      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      mockGameStateManager.isPlayerTurn.mockReturnValue(true);
      mockGameStateManager.movePlayer.mockReturnValue({ 
        success: false, 
        message: MESSAGES.INVALID_MOVE
      });

      // Act
      handleMovePlayer(mockGameStateManager, mockSocket, mockIo, gameId, userId, targetPosition);

      // Assert
      expect(mockGameStateManager.movePlayer).toHaveBeenCalledWith(gameId, userId, targetPosition);
      expect(mockSocket.emit).toHaveBeenCalledWith(SOCKET_EVENTS.ERROR, MESSAGES.INVALID_MOVE);
      expect(mockIo.to).not.toHaveBeenCalled();
      expect(mockGameStateManager.getPlayers).not.toHaveBeenCalled();
    });

    test('should do nothing if not current player turn', () => {
      // Arrange
      const targetPosition = { row: 3, column: 4 };
      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      mockGameStateManager.isPlayerTurn.mockReturnValue(false);

      // Act
      handleMovePlayer(mockGameStateManager, mockSocket, mockIo, gameId, userId, targetPosition);

      // Assert
      expect(mockGameStateManager.movePlayer).not.toHaveBeenCalled();
      expect(mockSocket.emit).toHaveBeenCalledWith(SOCKET_EVENTS.ERROR, MESSAGES.NOT_YOUR_TURN);
    });
  });
});