/*************************************************
 * Test de integración para API del juego
 * 
 * Este test verifica la funcionalidad de la API
 * del juego, incluyendo creación, recuperación y
 * gestión de estados del juego, así como la
 * interacción con la base de datos.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

const request = require('supertest');
const app = require('../../src/app/app');
const { MESSAGES } = require('../../src/messages/messages');

// Mock auth utilities
jest.mock('../../src/utils/auth', () => ({
  createToken: jest.fn().mockReturnValue('fake-jwt-token'),
  verifyToken: jest.fn(),
  generateSocketToken: jest.fn().mockReturnValue('fake-socket-token')
}));

// Mock GameStateManager with inline mock object
jest.mock('../../src/socket/GameStateManager', () => ({
  gameStateManager: {
    registerGame: jest.fn(),
    getGameById: jest.fn(),
    getAvailableGames: jest.fn(),
    removeGame: jest.fn(),
    addPlayerToGame: jest.fn(),
    isGamePlaying: jest.fn(),
    isPlayerInGame: jest.fn()
  }
}));

// Import User model after mocking
jest.mock('../../src/models/User', () => ({
  findOne: jest.fn().mockResolvedValue({
    id: 'test-user-id',
    username: 'testuser'
  })
}));

// Import Account model after mocking
jest.mock('../../src/models/Account', () => ({
  findOne: jest.fn().mockResolvedValue({
    id: 'test-account-id',
    userId: 'test-user-id'
  })
}));

// Mock UUID
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('test-game-id')
}));

// Import the mock references
const auth = require('../../src/utils/auth');
const { gameStateManager } = require('../../src/socket/GameStateManager');

describe('Game API Integration Tests', () => {
  let authToken;
  
  beforeEach(() => {
    jest.clearAllMocks();
    authToken = 'Bearer fake-jwt-token';
    
    // Setup default mock behavior
    auth.verifyToken.mockReturnValue({
      accountId: 'test-account-id',
      userId: 'test-user-id'
    });
    
    gameStateManager.registerGame.mockReturnValue(true);
    gameStateManager.getGameById.mockReturnValue({
      id: 'test-game-id',
      players: new Map([['test-account-id', { id: 'test-account-id', username: 'testuser' }]]),
      status: 'waiting'
    });
  });
  
  describe('POST /api/games', () => {
    it('should create a new game', async () => {
      const response = await request(app)
        .post('/api/games')
        .set('Authorization', authToken);
      
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id', 'test-game-id');
      expect(gameStateManager.registerGame).toHaveBeenCalled();
    });
    
    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .post('/api/games');
      
      expect(response.statusCode).toBe(401);
      expect(gameStateManager.registerGame).not.toHaveBeenCalled();
    });
  });
  
  describe('GET /api/games', () => {
    it('should list available games', async () => {
      gameStateManager.getAvailableGames.mockReturnValue([
        {
          id: 'game1',
          players: new Map([['player1', { username: 'Player 1' }]]),
          status: 'waiting'
        },
        {
          id: 'game2',
          players: new Map([['player2', { username: 'Player 2' }]]),
          status: 'waiting'
        }
      ]);
      
      const response = await request(app)
        .get('/api/games')
        .set('Authorization', authToken);
      
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
    });
    
    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/games');
      
      expect(response.statusCode).toBe(401);
    });
  });
  
  describe('GET /api/games/:id', () => {
    it('should get a specific game', async () => {
      const response = await request(app)
        .get('/api/games/test-game-id')
        .set('Authorization', authToken);
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id', 'test-game-id');
      expect(gameStateManager.getGameById).toHaveBeenCalledWith('test-game-id');
    });
    
    it('should return 404 for non-existent game', async () => {
      gameStateManager.getGameById.mockReturnValueOnce(null);
      
      const response = await request(app)
        .get('/api/games/nonexistent-game')
        .set('Authorization', authToken);
      
      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('message', MESSAGES.GAME_NOT_FOUND);
    });
    
    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/games/test-game-id');
      
      expect(response.statusCode).toBe(401);
    });
  });
  
  describe('POST /api/games/:id/join', () => {
    it('should join a game successfully', async () => {
      gameStateManager.isGamePlaying.mockReturnValue(false);
      gameStateManager.isPlayerInGame.mockReturnValue(false);
      gameStateManager.addPlayerToGame.mockReturnValue(true);
      
      const response = await request(app)
        .post('/api/games/test-game-id/join')
        .set('Authorization', authToken);
      
      expect(response.statusCode).toBe(200);
      expect(gameStateManager.addPlayerToGame).toHaveBeenCalledWith('test-game-id', {
        id: 'test-account-id',
        userId: 'test-user-id',
        username: 'testuser'
      });
    });
    
    it('should return 404 for non-existent game', async () => {
      gameStateManager.getGameById.mockReturnValueOnce(null);
      
      const response = await request(app)
        .post('/api/games/nonexistent-game/join')
        .set('Authorization', authToken);
      
      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('message', MESSAGES.GAME_NOT_FOUND);
    });
    
    it('should return 403 when game is already playing', async () => {
      gameStateManager.isGamePlaying.mockReturnValue(true);
      
      const response = await request(app)
        .post('/api/games/test-game-id/join')
        .set('Authorization', authToken);
      
      expect(response.statusCode).toBe(403);
      expect(response.body).toHaveProperty('message', MESSAGES.GAME_ALREADY_STARTED);
    });
    
    it('should return 409 when player is already in the game', async () => {
      gameStateManager.isGamePlaying.mockReturnValue(false);
      gameStateManager.isPlayerInGame.mockReturnValue(true);
      
      const response = await request(app)
        .post('/api/games/test-game-id/join')
        .set('Authorization', authToken);
      
      expect(response.statusCode).toBe(409);
      expect(response.body).toHaveProperty('message', MESSAGES.PLAYER_ALREADY_IN_GAME);
    });
    
    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .post('/api/games/test-game-id/join');
      
      expect(response.statusCode).toBe(401);
    });
  });
  
  describe('DELETE /api/games/:id', () => {
    it('should delete a game', async () => {
      gameStateManager.removeGame.mockReturnValue(true);
      
      const response = await request(app)
        .delete('/api/games/test-game-id')
        .set('Authorization', authToken);
      
      expect(response.statusCode).toBe(200);
      expect(gameStateManager.removeGame).toHaveBeenCalledWith('test-game-id');
    });
    
    it('should return 404 for non-existent game', async () => {
      gameStateManager.getGameById.mockReturnValueOnce(null);
      
      const response = await request(app)
        .delete('/api/games/nonexistent-game')
        .set('Authorization', authToken);
      
      expect(response.statusCode).toBe(404);
    });
    
    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .delete('/api/games/test-game-id');
      
      expect(response.statusCode).toBe(401);
    });
  });
  
  describe('POST /api/games/random', () => {
    it('should find or create a random game', async () => {
      gameStateManager.getAvailableGames.mockReturnValue([
        {
          id: 'game1',
          players: new Map([['player1', { username: 'Player 1' }]]),
          status: 'waiting'
        }
      ]);
      
      const response = await request(app)
        .post('/api/games/random')
        .set('Authorization', authToken);
      
      expect(response.statusCode).toBe(200);
    });
    
    it('should create a new game when no available games', async () => {
      gameStateManager.getAvailableGames.mockReturnValue([]);
      
      const response = await request(app)
        .post('/api/games/random')
        .set('Authorization', authToken);
      
      expect(response.statusCode).toBe(200);
      expect(gameStateManager.registerGame).toHaveBeenCalled();
    });
    
    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .post('/api/games/random');
      
      expect(response.statusCode).toBe(401);
    });
  });
});