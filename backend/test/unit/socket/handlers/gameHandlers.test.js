/*************************************************
 * Test de los manejadores de juego
 * 
 * Este test verifica los manejadores de eventos
 * socket.io para la gestión general del juego,
 * incluyendo creación, unión y finalización de partidas.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import { jest } from '@jest/globals';
import { SOCKET_EVENTS, GAME_STATES } from '../../../../src/config/constants.js';

// Mock dependencies
const gameStateManagerMock = {
  getGame: jest.fn(),
  setGame: jest.fn(),
  getPlayerCount: jest.fn(),
  getGameState: jest.fn(),
  isPlayerInGame: jest.fn(),
  startGame: jest.fn(),
  setWinner: jest.fn(),
  addPlayer: jest.fn(),
  removePlayer: jest.fn(),
  getPlayers: jest.fn(),
  deleteGame: jest.fn()
};

jest.unstable_mockModule('../../../../src/socket/GameStateManager.js', () => ({
  gameStateManager: gameStateManagerMock
}));

const countdownManagerMock = {
  startCountdown: jest.fn(),
  stopCountdown: jest.fn(),
  cancelCountdown: jest.fn()
};

jest.unstable_mockModule('../../../../src/socket/CountdownManager.js', () => ({
  countdownManager: countdownManagerMock
}));

// Import handlers after mocking dependencies
const importHandlers = async () => {
  return await import('../../../../src/socket/handlers/playerHandlers.js');
};

describe('Game Socket Handlers', () => {
  let handlers;
  let socket;
  let io;
  
  beforeAll(async () => {
    handlers = await importHandlers();
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    socket = {
      id: 'socket-id',
      gameId: 'game-123',
      userId: 'user-123',
      username: 'testuser',
      join: jest.fn(),
      emit: jest.fn(),
      to: jest.fn().mockReturnThis(),
      broadcast: {
        to: jest.fn().mockReturnThis(),
        emit: jest.fn()
      }
    };
    
    io = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn()
    };
  });
  
  describe('handlePlayerConnection', () => {
    it('should handle new player connections', async () => {
      // Arrange
      const gameId = 'game-123';
      const userId = 'user-123';
      const username = 'testuser';
      const mockGame = {
        id: gameId,
        players: new Map([
          [userId, { id: userId, username, connected: false }]
        ])
      };
      
      gameStateManagerMock.getGame.mockReturnValue(mockGame);
      gameStateManagerMock.isPlayerInGame.mockReturnValue(true);
      gameStateManagerMock.addPlayer.mockResolvedValue(true); // isNewPlayer = true
      gameStateManagerMock.getPlayers.mockReturnValue([
        { id: userId, username, connected: true }
      ]);
      
      // Act
      const result = await handlers.handlePlayerConnection(
        gameStateManagerMock,
        socket,
        io,
        gameId,
        userId,
        username
      );
      
      // Assert
      expect(socket.join).toHaveBeenCalledWith(gameId);
      expect(socket.emit).toHaveBeenCalledWith(
        SOCKET_EVENTS.PLAYER_LIST,
        expect.any(Object)
      );
      expect(socket.to).toHaveBeenCalledWith(gameId);
      expect(socket.to().emit).toHaveBeenCalledWith(
        SOCKET_EVENTS.PLAYER_JOINED,
        expect.objectContaining({ username })
      );
      expect(result).toBe(true);
    });
  });
  
  describe('handlePlayerLeave', () => {
    it('should handle player disconnections', () => {
      // Arrange
      const gameId = 'game-123';
      const userId = 'user-123';
      const username = 'testuser';
      
      const mockPlayers = new Map([
        [userId, { id: userId, username, connected: true }]
      ]);
      const mockGame = {
        id: gameId,
        players: mockPlayers,
        state: GAME_STATES.WAITING
      };
      
      gameStateManagerMock.getGame.mockReturnValue(mockGame);
      gameStateManagerMock.getGameState.mockReturnValue(GAME_STATES.WAITING);
      gameStateManagerMock.getPlayerCount.mockReturnValue(0);
      gameStateManagerMock.removePlayer.mockReturnValue(true);
      
      // Act
      handlers.handlePlayerLeave(
        gameStateManagerMock,
        countdownManagerMock,
        socket,
        io,
        gameId,
        userId,
        username
      );
      
      // Assert
      expect(io.to).toHaveBeenCalledWith(gameId);
      expect(io.to().emit).toHaveBeenCalledWith(
        SOCKET_EVENTS.PLAYER_LEFT,
        expect.objectContaining({ username })
      );
      
      // Check countdownManager methods called
      expect(countdownManagerMock.cancelCountdown).toHaveBeenCalledWith(gameId);
      expect(gameStateManagerMock.deleteGame).toHaveBeenCalledWith(gameId);
    });

    it('should not change game state if still enough connected players', () => {
      // Arrange
      const gameId = 'game-123';
      const userId = 'user-123';
      const username = 'testuser';
      
      const mockPlayers = new Map([
        [userId, { id: userId, username, connected: true }],
        ['user2', { id: 'user2', username: 'user2', connected: true }]
      ]);
      const mockGame = {
        id: gameId,
        players: mockPlayers,
        state: GAME_STATES.WAITING
      };
      
      gameStateManagerMock.getGame.mockReturnValue(mockGame);
      gameStateManagerMock.getGameState.mockReturnValue(GAME_STATES.WAITING);
      gameStateManagerMock.getPlayerCount.mockReturnValue(2);
      gameStateManagerMock.removePlayer.mockReturnValue(true);
      
      // Act
      handlers.handlePlayerLeave(
        gameStateManagerMock,
        countdownManagerMock,
        socket,
        io,
        gameId,
        userId,
        username
      );
      
      // Assert
      expect(mockGame.state).toBe(GAME_STATES.WAITING);
      expect(countdownManagerMock.cancelCountdown).not.toHaveBeenCalled();
      expect(gameStateManagerMock.deleteGame).not.toHaveBeenCalled();
    });
  });
  
  describe('handlePlayerReady', () => {
    it('should start game when all players are ready', () => {
      // Arrange
      const gameId = 'game-123';
      
      gameStateManagerMock.getPlayerCount.mockReturnValue(2);
      
      // Act
      handlers.handlePlayerReady(gameStateManagerMock, countdownManagerMock, gameId);
      
      // Assert
      expect(countdownManagerMock.startCountdown).toHaveBeenCalledWith(gameId);
    });
    
    it('should not start game when not enough players', () => {
      // Arrange
      const gameId = 'game-123';
      
      gameStateManagerMock.getPlayerCount.mockReturnValue(1);
      
      // Act
      handlers.handlePlayerReady(gameStateManagerMock, countdownManagerMock, gameId);
      
      // Assert
      expect(countdownManagerMock.startCountdown).not.toHaveBeenCalled();
    });
  });
});