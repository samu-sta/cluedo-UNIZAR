/*************************************************
 * Test de integración para mock de TurnService
 * 
 * Este mock simula el servicio de gestión de turnos,
 * permitiendo probar la lógica de alternancia entre
 * jugadores y control del flujo de juego.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import { jest } from '@jest/globals';
import MESSAGES from '../../../src/messages/messages.js';

const turnService = {
  // Store for turn information
  _gameStore: new Map(),
  
  // Setup turn order for a game
  setupPlayerTurns: jest.fn().mockImplementation((gameId) => {
    if (!gameId) return false;
    
    let gameState = turnService._gameStore.get(gameId);
    if (!gameState) {
      gameState = {
        players: new Map(),
        turnOrder: [],
        currentTurnIndex: 0,
        currentTurnPlayer: null
      };
      turnService._gameStore.set(gameId, gameState);
    }
    
    // If we have players, set up the turn order
    if (gameState.players.size > 0) {
      gameState.turnOrder = Array.from(gameState.players.keys());
      gameState.currentTurnIndex = 0;
      gameState.currentTurnPlayer = gameState.turnOrder[0];
    }
    
    return true;
  }),
  
  // Add a player to the game
  addPlayer: jest.fn().mockImplementation((gameId, playerId, playerData = {}) => {
    if (!gameId || !playerId) return false;
    
    let gameState = turnService._gameStore.get(gameId);
    if (!gameState) {
      gameState = {
        players: new Map(),
        turnOrder: [],
        currentTurnIndex: 0,
        currentTurnPlayer: null
      };
      turnService._gameStore.set(gameId, gameState);
    }
    
    // Add the player if they don't exist
    if (!gameState.players.has(playerId)) {
      gameState.players.set(playerId, {
        id: playerId,
        username: playerData.username || `Player-${playerId}`,
        ...playerData
      });
      
      // Update turn order if the game hasn't started yet
      if (gameState.turnOrder.length === 0) {
        gameState.turnOrder = Array.from(gameState.players.keys());
        gameState.currentTurnIndex = 0;
        gameState.currentTurnPlayer = gameState.turnOrder[0];
      }
    }
    
    return true;
  }),
  
  // Get the current turn player ID
  getCurrentTurnPlayer: jest.fn().mockImplementation((gameId) => {
    if (!gameId) return null;
    
    const gameState = turnService._gameStore.get(gameId);
    return gameState ? gameState.currentTurnPlayer : null;
  }),
  
  // Get the current turn player name
  getCurrentTurnPlayerName: jest.fn().mockImplementation((gameId) => {
    if (!gameId) return null;
    
    const gameState = turnService._gameStore.get(gameId);
    if (!gameState || !gameState.currentTurnPlayer) return null;
    
    const player = gameState.players.get(gameState.currentTurnPlayer);
    return player ? player.username : null;
  }),
  
  // Check if it's a player's turn
  isPlayerTurn: jest.fn().mockImplementation((gameId, playerId) => {
    if (!gameId || !playerId) return false;
    
    const gameState = turnService._gameStore.get(gameId);
    return gameState ? gameState.currentTurnPlayer === playerId : false;
  }),
  
  // Move to the next player's turn
  nextTurn: jest.fn().mockImplementation((gameId) => {
    if (!gameId) return null;
    
    const gameState = turnService._gameStore.get(gameId);
    if (!gameState || gameState.turnOrder.length === 0) return null;
    
    // Advance to the next player
    gameState.currentTurnIndex = (gameState.currentTurnIndex + 1) % gameState.turnOrder.length;
    gameState.currentTurnPlayer = gameState.turnOrder[gameState.currentTurnIndex];
    
    // Return the new turn information
    return {
      playerId: gameState.currentTurnPlayer,
      playerName: turnService.getCurrentTurnPlayerName(gameId),
      turnIndex: gameState.currentTurnIndex,
      totalPlayers: gameState.turnOrder.length
    };
  }),
  
  // Update turn order when a player leaves
  updatePlayerTurnOrder: jest.fn().mockImplementation((gameId, playerId) => {
    if (!gameId || !playerId) return false;
    
    const gameState = turnService._gameStore.get(gameId);
    if (!gameState) return false;
    
    // Remove the player from the turn order
    const playerIndex = gameState.turnOrder.indexOf(playerId);
    if (playerIndex !== -1) {
      gameState.turnOrder.splice(playerIndex, 1);
      
      // If it was the current player's turn, adjust current turn index
      if (gameState.currentTurnPlayer === playerId) {
        if (gameState.turnOrder.length > 0) {
          // Keep the current turn index or reset if it's out of bounds
          if (gameState.currentTurnIndex >= gameState.turnOrder.length) {
            gameState.currentTurnIndex = 0;
          }
          gameState.currentTurnPlayer = gameState.turnOrder[gameState.currentTurnIndex];
        } else {
          // No players left
          gameState.currentTurnIndex = 0;
          gameState.currentTurnPlayer = null;
        }
      } else if (playerIndex < gameState.currentTurnIndex) {
        // If we removed a player before the current player, adjust the index
        gameState.currentTurnIndex--;
      }
    }
    
    // Also remove the player from the players map
    gameState.players.delete(playerId);
    
    return true;
  }),
  
  // Set the current turn player (for testing)
  __setCurrentTurnPlayer: jest.fn().mockImplementation((gameId, playerId) => {
    if (!gameId || !playerId) return false;
    
    let gameState = turnService._gameStore.get(gameId);
    if (!gameState) {
      gameState = {
        players: new Map(),
        turnOrder: [playerId],
        currentTurnIndex: 0,
        currentTurnPlayer: playerId
      };
      turnService._gameStore.set(gameId, gameState);
      return true;
    }
    
    // Update the current turn player
    gameState.currentTurnPlayer = playerId;
    
    // Find the player's position in the turn order
    const playerIndex = gameState.turnOrder.indexOf(playerId);
    if (playerIndex !== -1) {
      gameState.currentTurnIndex = playerIndex;
    } else if (gameState.players.has(playerId)) {
      // If player exists but isn't in turn order, add them
      gameState.turnOrder.push(playerId);
      gameState.currentTurnIndex = gameState.turnOrder.length - 1;
    }
    
    return true;
  }),
  
  // Reset mock data
  __resetMockData: jest.fn().mockImplementation(() => {
    turnService._gameStore.clear();
  }),
  
  // Setup a test scenario
  __setupTestScenario: jest.fn().mockImplementation((gameId = 'game123') => {
    // Reset any existing data for this game
    let gameState = turnService._gameStore.get(gameId);
    if (gameState) {
      gameState.players.clear();
      gameState.turnOrder = [];
      gameState.currentTurnIndex = 0;
      gameState.currentTurnPlayer = null;
    } else {
      gameState = {
        players: new Map(),
        turnOrder: [],
        currentTurnIndex: 0,
        currentTurnPlayer: null
      };
      turnService._gameStore.set(gameId, gameState);
    }
    
    // Add test players
    const players = [
      { id: 'user123', username: 'Player1' },
      { id: 'user456', username: 'Player2' },
      { id: 'user789', username: 'Player3' }
    ];
    
    players.forEach(player => {
      gameState.players.set(player.id, player);
    });
    
    // Set up turn order
    gameState.turnOrder = players.map(p => p.id);
    gameState.currentTurnIndex = 0;
    gameState.currentTurnPlayer = gameState.turnOrder[0];
    
    return gameState;
  })
};

export default turnService;