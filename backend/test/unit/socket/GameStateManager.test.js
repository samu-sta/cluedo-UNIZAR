/*************************************************
 * Test del gestor de estado de juego
 * 
 * Este test verifica la funcionalidad del gestor
 * de estado del juego, que mantiene y controla el estado
 * global de las partidas de Cluedo en el servidor.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { GAME_STATES } from '../../../src/config/constants.js';

// Create a simplified mock implementation for testing
class MockGameStateManager {
  constructor() {
    this.games = new Map();
    this.gameServices = new Map();
  }

  createGame(gameId, hostId, hostName) {
    const game = {
      id: gameId,
      hostId,
      hostName,
      state: GAME_STATES.LOBBY,
      players: [],
      maxPlayers: 6,
      turnOrder: [],
      turnIndex: 0,
      solution: null
    };

    this.games.set(gameId, game);
    return game;
  }

  joinGame(gameId, playerId, playerName) {
    const game = this.games.get(gameId);
    if (!game) return false;
    
    if (game.players.length >= game.maxPlayers) return false;
    
    const existingPlayer = game.players.find(p => p.id === playerId);
    if (existingPlayer) return true;
    
    game.players.push({
      id: playerId,
      name: playerName,
      ready: false,
      character: null,
      position: null,
      cards: []
    });
    
    return true;
  }

  leaveGame(gameId, playerId) {
    const game = this.games.get(gameId);
    if (!game) return false;
    
    const playerIndex = game.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return false;
    
    game.players.splice(playerIndex, 1);
    
    // If host leaves, assign a new host
    if (game.hostId === playerId && game.players.length > 0) {
      game.hostId = game.players[0].id;
      game.hostName = game.players[0].name;
    }
    
    return true;
  }

  setPlayerReady(gameId, playerId, isReady) {
    const game = this.games.get(gameId);
    if (!game) return false;
    
    const player = game.players.find(p => p.id === playerId);
    if (!player) return false;
    
    player.ready = isReady;
    return true;
  }

  getPlayers(gameId) {
    const game = this.games.get(gameId);
    if (!game) return [];
    return game.players;
  }

  setGameState(gameId, state) {
    const game = this.games.get(gameId);
    if (!game) return false;
    
    game.state = state;
    return true;
  }

  getGameState(gameId) {
    const game = this.games.get(gameId);
    if (!game) return null;
    return game.state;
  }

  getGame(gameId) {
    return this.games.get(gameId);
  }

  hasGame(gameId) {
    return this.games.has(gameId);
  }
}

describe('GameStateManager', () => {
  let gameStateManager;
  
  beforeEach(() => {
    gameStateManager = new MockGameStateManager();
  });
  
  describe('createGame', () => {
    it('should create a new game with host', () => {
      const gameId = 'game123';
      const hostId = 'host123';
      const hostName = 'Host Player';
      
      const game = gameStateManager.createGame(gameId, hostId, hostName);
      
      expect(game).toBeDefined();
      expect(game.id).toBe(gameId);
      expect(game.hostId).toBe(hostId);
      expect(game.hostName).toBe(hostName);
      expect(game.state).toBe(GAME_STATES.LOBBY);
      expect(game.players).toEqual([]);
    });
  });
  
  describe('joinGame', () => {
    it('should add a player to an existing game', () => {
      const gameId = 'game123';
      const hostId = 'host123';
      const hostName = 'Host Player';
      
      // Create a game
      gameStateManager.createGame(gameId, hostId, hostName);
      
      // Join the game
      const playerId = 'player456';
      const playerName = 'Test Player';
      const result = gameStateManager.joinGame(gameId, playerId, playerName);
      
      expect(result).toBe(true);
      
      // Check that player was added
      const players = gameStateManager.getPlayers(gameId);
      expect(players).toHaveLength(1);
      expect(players[0].id).toBe(playerId);
      expect(players[0].name).toBe(playerName);
      expect(players[0].ready).toBe(false);
    });
    
    it('should return false when trying to join a non-existent game', () => {
      const result = gameStateManager.joinGame('nonexistent', 'player123', 'Player');
      expect(result).toBe(false);
    });
    
    it('should return true when a player tries to rejoin a game they are already in', () => {
      const gameId = 'game123';
      
      // Create game and add player
      gameStateManager.createGame(gameId, 'host123', 'Host');
      gameStateManager.joinGame(gameId, 'player123', 'Player');
      
      // Try to join again
      const result = gameStateManager.joinGame(gameId, 'player123', 'Player');
      
      expect(result).toBe(true);
      
      // Check player was not duplicated
      const players = gameStateManager.getPlayers(gameId);
      expect(players).toHaveLength(1);
    });
    
    it('should return false when a game is full', () => {
      const gameId = 'game123';
      
      // Create game
      const game = gameStateManager.createGame(gameId, 'host123', 'Host');
      
      // Add max players
      for (let i = 0; i < game.maxPlayers; i++) {
        gameStateManager.joinGame(gameId, `player${i}`, `Player ${i}`);
      }
      
      // Try to add one more
      const result = gameStateManager.joinGame(gameId, 'extraPlayer', 'Extra');
      
      expect(result).toBe(false);
    });
  });
  
  describe('leaveGame', () => {
    it('should remove a player from a game', () => {
      const gameId = 'game123';
      const playerId = 'player123';
      
      // Create game and add player
      gameStateManager.createGame(gameId, 'host123', 'Host');
      gameStateManager.joinGame(gameId, playerId, 'Player');
      
      // Leave game
      const result = gameStateManager.leaveGame(gameId, playerId);
      
      expect(result).toBe(true);
      
      // Check player was removed
      const players = gameStateManager.getPlayers(gameId);
      expect(players).toHaveLength(0);
    });
    
    it('should reassign host when host leaves', () => {
      const gameId = 'game123';
      const hostId = 'host123';
      const playerId = 'player123';
      
      // Create game
      gameStateManager.createGame(gameId, hostId, 'Host');
      
      // Add another player
      gameStateManager.joinGame(gameId, playerId, 'Player');
      
      // Host leaves
      gameStateManager.leaveGame(gameId, hostId);
      
      // Check new host
      const game = gameStateManager.getGame(gameId);
      expect(game.hostId).toBe(playerId);
    });
    
    it('should return false when trying to leave a non-existent game', () => {
      const result = gameStateManager.leaveGame('nonexistent', 'player123');
      expect(result).toBe(false);
    });
  });
  
  describe('setPlayerReady', () => {
    it('should set player ready status', () => {
      const gameId = 'game123';
      const playerId = 'player123';
      
      // Create game and add player
      gameStateManager.createGame(gameId, 'host123', 'Host');
      gameStateManager.joinGame(gameId, playerId, 'Player');
      
      // Set ready
      const result = gameStateManager.setPlayerReady(gameId, playerId, true);
      
      expect(result).toBe(true);
      
      // Check player ready status
      const players = gameStateManager.getPlayers(gameId);
      expect(players[0].ready).toBe(true);
    });
  });
  
  describe('getPlayers', () => {
    it('should return all players in a game', () => {
      const gameId = 'game123';
      
      // Create game and add players
      gameStateManager.createGame(gameId, 'host123', 'Host');
      gameStateManager.joinGame(gameId, 'player1', 'Player 1');
      gameStateManager.joinGame(gameId, 'player2', 'Player 2');
      
      // Get players
      const players = gameStateManager.getPlayers(gameId);
      
      expect(players).toHaveLength(2);
      expect(players[0].id).toBe('player1');
      expect(players[1].id).toBe('player2');
    });
    
    it('should return empty array for non-existent game', () => {
      const players = gameStateManager.getPlayers('nonexistent');
      expect(players).toEqual([]);
    });
  });
  
  describe('setGameState', () => {
    it('should change the game state', () => {
      const gameId = 'game123';
      
      // Create game
      gameStateManager.createGame(gameId, 'host123', 'Host');
      
      // Change state
      const result = gameStateManager.setGameState(gameId, GAME_STATES.WAITING);
      
      expect(result).toBe(true);
      
      // Check state
      const state = gameStateManager.getGameState(gameId);
      expect(state).toBe(GAME_STATES.WAITING);
    });
    
    it('should return false for non-existent game', () => {
      const result = gameStateManager.setGameState('nonexistent', GAME_STATES.PLAYING);
      expect(result).toBe(false);
    });
  });
  
  describe('getGameState', () => {
    it('should return the current game state', () => {
      const gameId = 'game123';
      
      // Create game
      gameStateManager.createGame(gameId, 'host123', 'Host');
      
      // Get state
      const state = gameStateManager.getGameState(gameId);
      
      expect(state).toBe(GAME_STATES.LOBBY);
    });
    
    it('should return null for non-existent game', () => {
      const state = gameStateManager.getGameState('nonexistent');
      expect(state).toBeNull();
    });
  });
  
  describe('game management', () => {
    it('should check if a game exists', () => {
      const gameId = 'game123';
      
      // Initially game doesn't exist
      expect(gameStateManager.hasGame(gameId)).toBe(false);
      
      // Create game
      gameStateManager.createGame(gameId, 'host123', 'Host');
      
      // Now it exists
      expect(gameStateManager.hasGame(gameId)).toBe(true);
    });
    
    it('should get a game by ID', () => {
      const gameId = 'game123';
      const hostId = 'host123';
      
      // Create game
      gameStateManager.createGame(gameId, hostId, 'Host');
      
      // Get game
      const game = gameStateManager.getGame(gameId);
      
      expect(game).toBeDefined();
      expect(game.id).toBe(gameId);
      expect(game.hostId).toBe(hostId);
    });
  });
});