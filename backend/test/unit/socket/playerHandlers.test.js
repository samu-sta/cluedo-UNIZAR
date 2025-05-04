import { jest } from '@jest/globals';
import { handlePlayerConnection, handlePlayerLeave, handleRequestCards, handlePlayerReady } from '../../../src/socket/handlers/playerHandlers.js';
import { GAME_STATES, SOCKET_EVENTS } from '../../../src/config/constants.js';
import MESSAGES from '../../../src/messages/messages.js';

// Mock the dependencies
jest.mock('../../../src/messages/messages.js', () => ({
  ALL_PLAYERS_LEFT: 'All players have left the game',
  PLAYER_LEFT_ONE_REMAINING: 'left the game. Only one player remaining, game ended.',
  GAME_NOT_STARTED: 'Game has not started yet',
}));

describe('playerHandlers', () => {
  // Common mocks
  let mockSocket;
  let mockIo;
  let mockGameStateManager;
  let mockCountdownManager;
  const gameId = 'game123';
  const userId = 'user123';
  const username = 'testplayer';

  beforeEach(() => {
    // Set up mocks
    mockSocket = {
      join: jest.fn(),
      emit: jest.fn(),
      to: jest.fn().mockReturnThis()
    };

    mockIo = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn()
    };

    mockGameStateManager = {
      addPlayer: jest.fn(),
      removePlayer: jest.fn(),
      getPlayers: jest.fn(),
      getPlayerCount: jest.fn(),
      getGameState: jest.fn(),
      setGameState: jest.fn(),
      handlePlayerLeaveInGame: jest.fn(),
      deleteGame: jest.fn(),
      getPlayerCards: jest.fn(),
      getLeftoverCards: jest.fn()
    };

    mockCountdownManager = {
      startCountdown: jest.fn(),
      cancelCountdown: jest.fn()
    };
  });

  describe('handlePlayerConnection', () => {
    test('should add player and emit player list', async () => {
      // Arrange
      const players = [{ id: 'user123', username: 'testplayer' }];
      mockGameStateManager.addPlayer.mockResolvedValue(true);
      mockGameStateManager.getPlayers.mockReturnValue(players);

      // Act
      const result = await handlePlayerConnection(
        mockGameStateManager, mockSocket, mockIo, gameId, userId, username
      );

      // Assert
      expect(mockSocket.join).toHaveBeenCalledWith(gameId);
      expect(mockGameStateManager.addPlayer).toHaveBeenCalledWith(gameId, userId, { username });
      expect(mockSocket.emit).toHaveBeenCalledWith(SOCKET_EVENTS.PLAYER_LIST, { players });
      expect(mockSocket.to).toHaveBeenCalledWith(gameId);
      expect(result).toBe(true);
    });

    test('should not emit player joined event for returning players', async () => {
      // Arrange
      mockGameStateManager.addPlayer.mockResolvedValue(false); // Not a new player

      // Act
      const result = await handlePlayerConnection(
        mockGameStateManager, mockSocket, mockIo, gameId, userId, username
      );

      // Assert
      expect(mockSocket.join).toHaveBeenCalledWith(gameId);
      expect(mockGameStateManager.addPlayer).toHaveBeenCalledWith(gameId, userId, { username });
      expect(mockSocket.to).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('handlePlayerLeave', () => {
    test('should handle player leave during game with next turn', () => {
      // Arrange
      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      mockGameStateManager.handlePlayerLeaveInGame.mockReturnValue({
        success: true,
        nextTurn: 'user456',
        shouldEndGame: false
      });

      // Act
      handlePlayerLeave(
        mockGameStateManager, mockCountdownManager, mockSocket, mockIo, gameId, userId, username
      );

      // Assert
      expect(mockGameStateManager.getGameState).toHaveBeenCalledWith(gameId);
      expect(mockGameStateManager.handlePlayerLeaveInGame).toHaveBeenCalledWith(gameId, userId);
      expect(mockIo.to).toHaveBeenCalledWith(gameId);
      expect(mockIo.emit).toHaveBeenCalledWith(SOCKET_EVENTS.TURN_UPDATE, { currentTurn: 'user456' });
      expect(mockIo.emit).toHaveBeenCalledWith(SOCKET_EVENTS.PLAYER_LEFT, { username });
    });

    test('should end game when only one player remains', () => {
      // Arrange
      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      mockGameStateManager.handlePlayerLeaveInGame.mockReturnValue({
        success: true,
        shouldEndGame: true,
        remainingPlayers: ['user456'],
        winner: 'user456'
      });

      // Act
      handlePlayerLeave(
        mockGameStateManager, mockCountdownManager, mockSocket, mockIo, gameId, userId, username
      );

      // Assert
      expect(mockGameStateManager.getGameState).toHaveBeenCalledWith(gameId);
      expect(mockGameStateManager.handlePlayerLeaveInGame).toHaveBeenCalledWith(gameId, userId);
      expect(mockGameStateManager.setGameState).toHaveBeenCalledWith(gameId, GAME_STATES.ENDED);
      expect(mockIo.to).toHaveBeenCalledWith(gameId);
      expect(mockIo.emit).toHaveBeenCalledWith(SOCKET_EVENTS.GAME_END, {
        reason: `${username} ${MESSAGES.PLAYER_LEFT_ONE_REMAINING}`,
        winner: 'user456'
      });
    });

    test('should end game when all players leave', () => {
      // Arrange
      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      mockGameStateManager.handlePlayerLeaveInGame.mockReturnValue({
        success: true,
        shouldEndGame: true,
        remainingPlayers: [], // No players left
        winner: null
      });

      // Act
      handlePlayerLeave(
        mockGameStateManager, mockCountdownManager, mockSocket, mockIo, gameId, userId, username
      );

      // Assert
      expect(mockGameStateManager.setGameState).toHaveBeenCalledWith(gameId, GAME_STATES.ENDED);
      expect(mockIo.to).toHaveBeenCalledWith(gameId);
      expect(mockIo.emit).toHaveBeenCalledWith(SOCKET_EVENTS.GAME_END, {
        reason: MESSAGES.ALL_PLAYERS_LEFT,
        winner: null
      });
    });

    test('should do nothing on failed handlePlayerLeaveInGame', () => {
      // Arrange
      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      mockGameStateManager.handlePlayerLeaveInGame.mockReturnValue({
        success: false
      });

      // Act
      handlePlayerLeave(
        mockGameStateManager, mockCountdownManager, mockSocket, mockIo, gameId, userId, username
      );

      // Assert
      expect(mockGameStateManager.handlePlayerLeaveInGame).toHaveBeenCalledWith(gameId, userId);
      expect(mockIo.to).not.toHaveBeenCalled();
      expect(mockIo.emit).not.toHaveBeenCalled();
    });

    test('should handle player leave before game starts', () => {
      // Arrange
      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.WAITING);
      mockGameStateManager.removePlayer.mockReturnValue(true);
      mockGameStateManager.getPlayerCount.mockReturnValue(1);

      // Act
      handlePlayerLeave(
        mockGameStateManager, mockCountdownManager, mockSocket, mockIo, gameId, userId, username
      );

      // Assert
      expect(mockGameStateManager.removePlayer).toHaveBeenCalledWith(gameId, userId);
      expect(mockIo.to).toHaveBeenCalledWith(gameId);
      expect(mockIo.emit).toHaveBeenCalledWith(SOCKET_EVENTS.PLAYER_LEFT, { username });
      expect(mockCountdownManager.cancelCountdown).toHaveBeenCalledWith(gameId);
    });

    test('should delete game when last player leaves', () => {
      // Arrange
      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.WAITING);
      mockGameStateManager.removePlayer.mockReturnValue(true);
      mockGameStateManager.getPlayerCount.mockReturnValue(0);

      // Act
      handlePlayerLeave(
        mockGameStateManager, mockCountdownManager, mockSocket, mockIo, gameId, userId, username
      );

      // Assert
      expect(mockGameStateManager.removePlayer).toHaveBeenCalledWith(gameId, userId);
      expect(mockGameStateManager.getPlayerCount).toHaveBeenCalledWith(gameId);
      expect(mockGameStateManager.deleteGame).toHaveBeenCalledWith(gameId);
    });

    test('should do nothing if removePlayer fails', () => {
      // Arrange
      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.WAITING);
      mockGameStateManager.removePlayer.mockReturnValue(false);

      // Act
      handlePlayerLeave(
        mockGameStateManager, mockCountdownManager, mockSocket, mockIo, gameId, userId, username
      );

      // Assert
      expect(mockGameStateManager.removePlayer).toHaveBeenCalledWith(gameId, userId);
      expect(mockIo.to).not.toHaveBeenCalled();
      expect(mockIo.emit).not.toHaveBeenCalled();
      expect(mockCountdownManager.cancelCountdown).not.toHaveBeenCalled();
    });
  });

  describe('handleRequestCards', () => {
    test('should send player cards when game is playing', () => {
      // Arrange
      const cards = [{ name: 'Card1' }, { name: 'Card2' }];
      const leftoverCards = [{ name: 'Card3' }];
      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      mockGameStateManager.getPlayerCards.mockReturnValue(cards);
      mockGameStateManager.getLeftoverCards.mockReturnValue(leftoverCards);

      // Act
      handleRequestCards(mockGameStateManager, mockSocket, gameId, userId);

      // Assert
      expect(mockGameStateManager.getGameState).toHaveBeenCalledWith(gameId);
      expect(mockGameStateManager.getPlayerCards).toHaveBeenCalledWith(gameId, userId);
      expect(mockGameStateManager.getLeftoverCards).toHaveBeenCalledWith(gameId);
      expect(mockSocket.emit).toHaveBeenCalledWith(SOCKET_EVENTS.PLAYER_CARDS, { cards, leftoverCards });
    });

    test('should send error when game has not started', () => {
      // Arrange
      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.WAITING);

      // Act
      handleRequestCards(mockGameStateManager, mockSocket, gameId, userId);

      // Assert
      expect(mockGameStateManager.getGameState).toHaveBeenCalledWith(gameId);
      expect(mockSocket.emit).toHaveBeenCalledWith(SOCKET_EVENTS.ERROR, MESSAGES.GAME_NOT_STARTED);
      expect(mockGameStateManager.getPlayerCards).not.toHaveBeenCalled();
    });
  });

  describe('handlePlayerReady', () => {
    test('should start countdown if enough players', () => {
      // Arrange
      mockGameStateManager.getPlayerCount.mockReturnValue(2);

      // Act
      handlePlayerReady(mockGameStateManager, mockCountdownManager, gameId);

      // Assert
      expect(mockGameStateManager.getPlayerCount).toHaveBeenCalledWith(gameId);
      expect(mockCountdownManager.startCountdown).toHaveBeenCalledWith(gameId);
    });

    test('should not start countdown if not enough players', () => {
      // Arrange
      mockGameStateManager.getPlayerCount.mockReturnValue(1);

      // Act
      handlePlayerReady(mockGameStateManager, mockCountdownManager, gameId);

      // Assert
      expect(mockGameStateManager.getPlayerCount).toHaveBeenCalledWith(gameId);
      expect(mockCountdownManager.startCountdown).not.toHaveBeenCalled();
    });
  });
});