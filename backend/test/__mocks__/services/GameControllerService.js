import { jest } from '@jest/globals';
import auth from '../../../src/utils/auth.js';
import { GAME_STATES } from '../../../src/config/constants.js';

const gameControllerService = {
  // Store for games
  _gameStore: new Map(),
  
  // Prepare game response data
  prepareGameResponse: jest.fn().mockImplementation(async (user, gameId) => {
    const socketToken = await auth.generateSocketToken(user, gameId);
    
    let gameInfo = {
      id: gameId,
      players: []
    };
    
    if (gameControllerService._gameStore.has(gameId)) {
      gameInfo = gameControllerService._gameStore.get(gameId);
    }
    
    return {
      success: true,
      gameId,
      gameInfo,
      token: socketToken
    };
  }),
  
  // Initialize a new game
  initGame: jest.fn().mockImplementation((gameId) => {
    if (gameControllerService._gameStore.has(gameId)) {
      return gameControllerService._gameStore.get(gameId);
    }
    
    const game = {
      id: gameId,
      state: GAME_STATES.WAITING,
      players: new Map(),
      turnOrder: [],
      currentTurnIndex: 0,
      canRollDice: true,
      hasMoved: false,
      hasSuggested: false,
      currentSuggestion: null,
      suggestionResponses: []
    };
    
    gameControllerService._gameStore.set(gameId, game);
    return game;
  }),
  
  // Check if a game exists
  hasGame: jest.fn().mockImplementation((gameId) => {
    return gameControllerService._gameStore.has(gameId);
  }),
  
  // Get a game by ID
  getGame: jest.fn().mockImplementation((gameId) => {
    return gameControllerService._gameStore.get(gameId) || null;
  }),
  
  // Get all games
  getAllGames: jest.fn().mockImplementation(() => {
    return gameControllerService._gameStore;
  }),
  
  // Set a game's state
  setGameState: jest.fn().mockImplementation((gameId, state) => {
    const game = gameControllerService._gameStore.get(gameId);
    if (game) {
      game.state = state;
    }
  }),
  
  // Get a game's state
  getGameState: jest.fn().mockImplementation((gameId) => {
    const game = gameControllerService._gameStore.get(gameId);
    return game ? game.state : null;
  }),
  
  // Remove a game
  removeGame: jest.fn().mockImplementation((gameId) => {
    return gameControllerService._gameStore.delete(gameId);
  }),
  
  // Get the count of active games
  getActiveGamesCount: jest.fn().mockImplementation(() => {
    return gameControllerService._gameStore.size;
  }),
  
  // Reset mock data
  __resetMockData: jest.fn().mockImplementation(() => {
    gameControllerService._gameStore.clear();
  })
};

export default gameControllerService;
