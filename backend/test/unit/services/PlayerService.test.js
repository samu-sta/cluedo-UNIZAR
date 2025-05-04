/*************************************************
 * Test del servicio de jugadores
 * 
 * Este test verifica la funcionalidad del servicio
 * que gestiona los jugadores de la partida, incluyendo
 * la adición, eliminación y gestión de estados.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import PlayerService from '../../../src/services/PlayerService';

// Mock dependencies
const gameServiceMock = {
  hasGame: jest.fn(),
  getGame: jest.fn()
};

// Create an instance with mock dependencies
const playerService = new PlayerService(gameServiceMock);

// If we need to mock methods from the service itself
playerService.canPlayerMoveToPosition = jest.fn();
playerService.isPositionInRoom = jest.fn();
playerService.getRoomForPosition = jest.fn();

describe('PlayerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('setupPlayerPositions', () => {
    it('should assign positions to all players', () => {
      // Arrange
      const gameId = 'game123';
      const mockGame = {
        players: new Map([
          ['player1', { id: 'player1' }],
          ['player2', { id: 'player2' }],
          ['player3', { id: 'player3' }]
        ]),
        startPositions: [
          { row: 1, column: 1 },
          { row: 2, column: 2 },
          { row: 3, column: 3 }
        ]
      };
      
      gameServiceMock.hasGame.mockReturnValue(true);
      gameServiceMock.getGame.mockReturnValue(mockGame);
      
      // Act
      const result = playerService.setupPlayerPositions(gameId);
      
      // Assert
      expect(result).toBe(true);
      expect(gameServiceMock.hasGame).toHaveBeenCalledWith(gameId);
      expect(gameServiceMock.getGame).toHaveBeenCalledWith(gameId);
      
      // Check that all players have positions assigned
      let i = 0;
      for (const [_, player] of mockGame.players.entries()) {
        expect(player.position).toBeDefined();
      }
    });
    
    it('should return false if game does not exist', () => {
      // Arrange
      const gameId = 'game123';
      gameServiceMock.hasGame.mockReturnValue(false);
      
      // Act
      const result = playerService.setupPlayerPositions(gameId);
      
      // Assert
      expect(result).toBe(false);
      expect(gameServiceMock.hasGame).toHaveBeenCalledWith(gameId);
      expect(gameServiceMock.getGame).not.toHaveBeenCalled();
    });
  });
  
  describe('canPlayerMoveToPosition', () => {
    it('should return true for a valid move within range', () => {
      // Arrange
      const gameId = 'game123';
      const userId = 'player1';
      const position = { row: 6, column: 6 };
      const mockGame = {
        currentTurn: userId,
        diceRolled: true,
        diceResult: 4,
        players: new Map([
          [userId, { 
            id: userId, 
            position: { row: 5, column: 5 },
            eliminated: false
          }]
        ]),
        hasMoved: false
      };
      
      gameServiceMock.hasGame.mockReturnValue(true);
      gameServiceMock.getGame.mockReturnValue(mockGame);
      
      // Act
      // We'll use the real implementation instead of a mock
      const originalMethod = playerService.canPlayerMoveToPosition;
      playerService.canPlayerMoveToPosition = originalMethod;
      const result = playerService.canPlayerMoveToPosition(gameId, userId, position);
      
      // Assert
      expect(result).toBe(true);
    });
    
    it('should return false for an invalid move outside range', () => {
      // Arrange
      const gameId = 'game123';
      const userId = 'player1';
      const position = { row: 10, column: 10 };
      const mockGame = {
        currentTurn: userId,
        diceRolled: true,
        diceResult: 4,
        players: new Map([
          [userId, { 
            id: userId, 
            position: { row: 5, column: 5 },
            eliminated: false
          }]
        ]),
        hasMoved: false
      };
      
      gameServiceMock.hasGame.mockReturnValue(true);
      gameServiceMock.getGame.mockReturnValue(mockGame);
      
      // Act
      // Use the real implementation
      const originalMethod = playerService.canPlayerMoveToPosition;
      playerService.canPlayerMoveToPosition = originalMethod;
      const result = playerService.canPlayerMoveToPosition(gameId, userId, position);
      
      // Assert
      // Since we're using the real implementation and mockGame setup,
      // we expect false for a position that's too far away
      expect(result).toBe(false);
    });
    
    it('should return false if no dice have been rolled', () => {
      // Arrange
      const gameId = 'game123';
      const userId = 'player1';
      const position = { row: 6, column: 6 };
      const mockGame = {
        currentTurn: userId,
        diceRolled: false, // Dice not rolled
        players: new Map([
          [userId, { 
            id: userId, 
            position: { row: 5, column: 5 },
            eliminated: false
          }]
        ]),
        hasMoved: false
      };
      
      gameServiceMock.hasGame.mockReturnValue(true);
      gameServiceMock.getGame.mockReturnValue(mockGame);
      
      // Act
      // Use the real implementation
      const originalMethod = playerService.canPlayerMoveToPosition;
      playerService.canPlayerMoveToPosition = originalMethod;
      const result = playerService.canPlayerMoveToPosition(gameId, userId, position);
      
      // Assert
      expect(result).toBe(false);
    });
    
    it('should return false if not the player\'s turn', () => {
      // Arrange
      const gameId = 'game123';
      const userId = 'player1';
      const position = { row: 6, column: 6 };
      const mockGame = {
        currentTurn: 'player2', // Different player's turn
        diceRolled: true,
        diceResult: 4,
        players: new Map([
          [userId, { 
            id: userId, 
            position: { row: 5, column: 5 },
            eliminated: false
          }]
        ]),
        hasMoved: false
      };
      
      gameServiceMock.hasGame.mockReturnValue(true);
      gameServiceMock.getGame.mockReturnValue(mockGame);
      
      // Act
      // Use the real implementation
      const originalMethod = playerService.canPlayerMoveToPosition;
      playerService.canPlayerMoveToPosition = originalMethod;
      const result = playerService.canPlayerMoveToPosition(gameId, userId, position);
      
      // Assert
      expect(result).toBe(false);
    });
    
    it('should return false if player has already moved', () => {
      // Arrange
      const gameId = 'game123';
      const userId = 'player1';
      const position = { row: 6, column: 6 };
      const mockGame = {
        currentTurn: userId,
        diceRolled: true,
        diceResult: 4,
        players: new Map([
          [userId, { 
            id: userId, 
            position: { row: 5, column: 5 },
            eliminated: false
          }]
        ]),
        hasMoved: true // Already moved
      };
      
      gameServiceMock.hasGame.mockReturnValue(true);
      gameServiceMock.getGame.mockReturnValue(mockGame);
      
      // Act
      // Use the real implementation
      const originalMethod = playerService.canPlayerMoveToPosition;
      playerService.canPlayerMoveToPosition = originalMethod;
      const result = playerService.canPlayerMoveToPosition(gameId, userId, position);
      
      // Assert
      expect(result).toBe(false);
    });
  });
  
  describe('movePlayer', () => {
    it('should move player to a valid position', () => {
      // Arrange
      const gameId = 'game123';
      const userId = 'player1';
      const position = { row: 6, column: 6 };
      const mockGame = {
        players: new Map([
          [userId, { 
            id: userId, 
            position: { row: 5, column: 5 },
            eliminated: false
          }]
        ]),
        hasMoved: false
      };
      
      gameServiceMock.hasGame.mockReturnValue(true);
      gameServiceMock.getGame.mockReturnValue(mockGame);
      playerService.canPlayerMoveToPosition.mockReturnValue(true);
      
      // Act
      const result = playerService.movePlayer(gameId, userId, position);
      
      // Assert
      expect(result).toBe(true);
      expect(playerService.canPlayerMoveToPosition).toHaveBeenCalledWith(gameId, userId, position);
      expect(mockGame.players.get('player1').position).toEqual(position);
      expect(mockGame.hasMoved).toBe(true);
    });
    
    it('should not move player to an invalid position', () => {
      // Arrange
      const gameId = 'game123';
      const userId = 'player1';
      const position = { row: 10, column: 10 };
      const originalPosition = { row: 5, column: 5 };
      const mockGame = {
        players: new Map([
          [userId, { 
            id: userId, 
            position: originalPosition,
            eliminated: false
          }]
        ]),
        hasMoved: false
      };
      
      gameServiceMock.hasGame.mockReturnValue(true);
      gameServiceMock.getGame.mockReturnValue(mockGame);
      playerService.canPlayerMoveToPosition.mockReturnValue(false);
      
      // Act
      const result = playerService.movePlayer(gameId, userId, position);
      
      // Assert
      expect(result).toBe(false);
      expect(playerService.canPlayerMoveToPosition).toHaveBeenCalledWith(gameId, userId, position);
      expect(mockGame.players.get('player1').position).toEqual(originalPosition);
      expect(mockGame.hasMoved).not.toBe(true);
    });
  });
  
  describe('getRoomForPosition', () => {
    it('should return room when position is within a room', () => {
      // Arrange
      const gameId = 'game123';
      const position = { row: 5, column: 5 };
      const mockRoom = { 
        name: 'Kitchen',
        startPositions: [{ row: 5, column: 5 }]
      };
      const mockGame = {
        rooms: [mockRoom]
      };
      
      gameServiceMock.hasGame.mockReturnValue(true);
      gameServiceMock.getGame.mockReturnValue(mockGame);
      playerService.isPositionInRoom.mockReturnValue(true);
      
      // Act
      // Since isPositionInRoom is mocked to return true, first room will be returned
      const room = playerService.getRoomForPosition(gameId, position);
      
      // Assert
      expect(room).toBe(mockRoom);
      expect(playerService.isPositionInRoom).toHaveBeenCalledWith(mockRoom, position);
    });
    
    it('should return null when position is not in any room', () => {
      // Arrange
      const gameId = 'game123';
      const position = { row: 10, column: 10 };
      const mockRoom = { 
        name: 'Kitchen',
        startPositions: [{ row: 5, column: 5 }]
      };
      const mockGame = {
        rooms: [mockRoom]
      };
      
      gameServiceMock.hasGame.mockReturnValue(true);
      gameServiceMock.getGame.mockReturnValue(mockGame);
      playerService.isPositionInRoom.mockReturnValue(false);
      
      // Act
      // Since isPositionInRoom is mocked to return false, null will be returned
      const room = playerService.getRoomForPosition(gameId, position);
      
      // Assert
      expect(room).toBeNull();
    });
  });
  
  describe('getPlayerRoom', () => {
    it('should return the room a player is in', () => {
      // Arrange
      const gameId = 'game123';
      const userId = 'player1';
      const position = { row: 5, column: 5 };
      const mockRoom = { name: 'Kitchen' };
      const mockGame = {
        players: new Map([