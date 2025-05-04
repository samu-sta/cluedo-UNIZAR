import { jest } from '@jest/globals';
import MESSAGES from '../../src/messages/messages.js';

class GameStateManager {
  constructor() {
    // Game state storage
    this.games = new Map();
    this.playerSockets = new Map();
    this.socketPlayers = new Map();
    this.playerTokens = new Map();
    
    // Bind methods so they can be used as callbacks
    this.addPlayer = this.addPlayer.bind(this);
    this.removePlayer = this.removePlayer.bind(this);
    this.setPlayerReady = this.setPlayerReady.bind(this);
    this.startGame = this.startGame.bind(this);
    this.rollDice = this.rollDice.bind(this);
    this.movePlayer = this.movePlayer.bind(this);
    this.endTurn = this.endTurn.bind(this);
    this.makeSuggestion = this.makeSuggestion.bind(this);
    this.respondToSuggestion = this.respondToSuggestion.bind(this);
    this.makeAccusation = this.makeAccusation.bind(this);
    this.leaveGame = this.leaveGame.bind(this);
  }

  // Initialize game state
  initializeGame(gameId) {
    const gameState = {
      id: gameId,
      status: 'waiting',
      players: new Map(),
      started: false,
      turnPlayerId: null,
      currentSuggestion: null,
      suggestingPlayer: null,
      respondingPlayer: null,
      winner: null,
      eliminated: new Set()
    };
    
    this.games.set(gameId, gameState);
    return gameState;
  }

  // Get game by ID
  getGame(gameId) {
    return this.games.get(gameId);
  }

  // Add player to game
  addPlayer(socket, { gameId, userId, username, token }) {
    if (!gameId || !userId) {
      return { success: false, message: MESSAGES.INVALID_DATA };
    }
    
    // Get or initialize game state
    let gameState = this.games.get(gameId);
    if (!gameState) {
      gameState = this.initializeGame(gameId);
    }
    
    // Check if game already started
    if (gameState.started) {
      return { success: false, message: MESSAGES.GAME_ALREADY_STARTED };
    }
    
    // Check if player is already in the game
    if (gameState.players.has(userId)) {
      // If player reconnecting, update socket
      this.playerSockets.set(userId, socket);
      this.socketPlayers.set(socket.id, userId);
      return { 
        success: true, 
        reconnected: true,
        message: MESSAGES.PLAYER_RECONNECTED,
        players: Array.from(gameState.players.values())
      };
    }
    
    // Add new player
    const player = {
      id: userId,
      username,
      ready: false,
      character: null,
      position: null,
      cards: []
    };
    
    gameState.players.set(userId, player);
    
    // Map socket to player
    this.playerSockets.set(userId, socket);
    this.socketPlayers.set(socket.id, userId);
    
    // Store token
    if (token) {
      this.playerTokens.set(userId, token);
    }
    
    return { 
      success: true, 
      message: MESSAGES.PLAYER_JOINED,
      players: Array.from(gameState.players.values())
    };
  }

  // Remove player from game
  removePlayer(gameId, userId) {
    if (!gameId || !userId) {
      return { success: false, message: MESSAGES.INVALID_DATA };
    }
    
    const gameState = this.games.get(gameId);
    if (!gameState) {
      return { success: false, message: MESSAGES.GAME_NOT_FOUND };
    }
    
    // Remove player
    gameState.players.delete(userId);
    
    // Clean up mappings
    const socket = this.playerSockets.get(userId);
    if (socket) {
      this.socketPlayers.delete(socket.id);
    }
    this.playerSockets.delete(userId);
    this.playerTokens.delete(userId);
    
    return { 
      success: true, 
      message: MESSAGES.PLAYER_LEFT,
      players: Array.from(gameState.players.values()) 
    };
  }

  // Set player ready status
  setPlayerReady(gameId, userId, isReady = true) {
    if (!gameId || !userId) {
      return { success: false, message: MESSAGES.INVALID_DATA };
    }
    
    const gameState = this.games.get(gameId);
    if (!gameState) {
      return { success: false, message: MESSAGES.GAME_NOT_FOUND };
    }
    
    // Check if player exists
    const player = gameState.players.get(userId);
    if (!player) {
      return { success: false, message: MESSAGES.PLAYER_NOT_FOUND };
    }
    
    // Update ready status
    player.ready = isReady;
    
    return { 
      success: true, 
      message: isReady ? MESSAGES.PLAYER_READY : MESSAGES.PLAYER_NOT_READY,
      players: Array.from(gameState.players.values())
    };
  }

  // Start the game
  startGame(gameId) {
    if (!gameId) {
      return { success: false, message: MESSAGES.INVALID_DATA };
    }
    
    const gameState = this.games.get(gameId);
    if (!gameState) {
      return { success: false, message: MESSAGES.GAME_NOT_FOUND };
    }
    
    // Check if all players are ready
    let allReady = true;
    gameState.players.forEach(player => {
      if (!player.ready) {
        allReady = false;
      }
    });
    
    if (!allReady) {
      return { success: false, message: MESSAGES.NOT_ALL_PLAYERS_READY };
    }
    
    // Check min players
    if (gameState.players.size < 2) {
      return { success: false, message: MESSAGES.NOT_ENOUGH_PLAYERS };
    }
    
    // Start the game
    gameState.started = true;
    gameState.status = 'playing';
    
    // Set first player's turn
    const players = Array.from(gameState.players.keys());
    gameState.turnPlayerId = players[0];
    
    return { 
      success: true,
      message: MESSAGES.GAME_STARTED,
      turnPlayerId: gameState.turnPlayerId
    };
  }

  // Roll dice in game
  rollDice(gameId, userId) {
    if (!gameId || !userId) {
      return { success: false, message: MESSAGES.INVALID_DATA };
    }
    
    const gameState = this.games.get(gameId);
    if (!gameState) {
      return { success: false, message: MESSAGES.GAME_NOT_FOUND };
    }
    
    // Check if it's player's turn
    if (gameState.turnPlayerId !== userId) {
      return { success: false, message: MESSAGES.NOT_YOUR_TURN };
    }
    
    // Roll dice (generate random numbers)
    const diceResult1 = Math.floor(Math.random() * 6) + 1;
    const diceResult2 = Math.floor(Math.random() * 6) + 1;
    const total = diceResult1 + diceResult2;
    
    // Update game state
    gameState.lastDiceRoll = { diceResult1, diceResult2, total };
    
    return {
      success: true, 
      diceResult1, 
      diceResult2,
      total
    };
  }

  // Move player on board
  movePlayer(gameId, userId, targetPosition) {
    if (!gameId || !userId || !targetPosition) {
      return { success: false, message: MESSAGES.INVALID_DATA };
    }
    
    const gameState = this.games.get(gameId);
    if (!gameState) {
      return { success: false, message: MESSAGES.GAME_NOT_FOUND };
    }
    
    // Check if it's player's turn
    if (gameState.turnPlayerId !== userId) {
      return { success: false, message: MESSAGES.NOT_YOUR_TURN };
    }
    
    // Update player position
    const player = gameState.players.get(userId);
    if (player) {
      player.position = targetPosition;
    }
    
    return {
      success: true,
      message: MESSAGES.PLAYER_MOVED,
      position: targetPosition,
      playerId: userId
    };
  }

  // End a player's turn
  endTurn(gameId, userId) {
    if (!gameId || !userId) {
      return { success: false, message: MESSAGES.INVALID_DATA };
    }
    
    const gameState = this.games.get(gameId);
    if (!gameState) {
      return { success: false, message: MESSAGES.GAME_NOT_FOUND };
    }
    
    // Check if it's player's turn
    if (gameState.turnPlayerId !== userId) {
      return { success: false, message: MESSAGES.NOT_YOUR_TURN };
    }
    
    // Move to next player
    const players = Array.from(gameState.players.keys())
      .filter(id => !gameState.eliminated.has(id));
    
    if (players.length === 0) return { success: false };
    
    const currentIndex = players.indexOf(userId);
    const nextIndex = (currentIndex + 1) % players.length;
    gameState.turnPlayerId = players[nextIndex];
    
    return {
      success: true,
      message: MESSAGES.TURN_ENDED,
      nextPlayerId: gameState.turnPlayerId
    };
  }

  // Make a suggestion
  makeSuggestion(gameId, userId, suggestion) {
    if (!gameId || !userId || !suggestion) {
      return { success: false, message: MESSAGES.INVALID_DATA };
    }
    
    const gameState = this.games.get(gameId);
    if (!gameState) {
      return { success: false, message: MESSAGES.GAME_NOT_FOUND };
    }
    
    // Check if it's player's turn
    if (gameState.turnPlayerId !== userId) {
      return { success: false, message: MESSAGES.NOT_YOUR_TURN };
    }
    
    // Store suggestion
    gameState.currentSuggestion = suggestion;
    gameState.suggestingPlayer = userId;
    
    // Find next player to respond
    const players = Array.from(gameState.players.keys())
      .filter(id => id !== userId && !gameState.eliminated.has(id));
    
    if (players.length === 0) {
      // No one to respond
      return { 
        success: true,
        message: MESSAGES.NO_PLAYERS_TO_RESPOND,
        suggestion
      };
    }
    
    // Set first player to respond
    gameState.respondingPlayer = players[0];
    
    return {
      success: true,
      message: MESSAGES.SUGGESTION_MADE,
      suggestion,
      respondingPlayerId: gameState.respondingPlayer
    };
  }

  // Respond to a suggestion
  respondToSuggestion(gameId, userId, response) {
    if (!gameId || !userId) {
      return { success: false, message: MESSAGES.INVALID_DATA };
    }
    
    const gameState = this.games.get(gameId);
    if (!gameState) {
      return { success: false, message: MESSAGES.GAME_NOT_FOUND };
    }
    
    // Check if this player should respond
    if (gameState.respondingPlayer !== userId) {
      return { success: false, message: MESSAGES.NOT_YOUR_TURN_TO_RESPOND };
    }
    
    // Find next player to respond
    const players = Array.from(gameState.players.keys())
      .filter(id => id !== gameState.suggestingPlayer && !gameState.eliminated.has(id));
    
    const currentIndex = players.indexOf(userId);
    
    if (currentIndex === players.length - 1 || players.length === 0) {
      // Last player responded
      gameState.respondingPlayer = null;
      
      return {
        success: true,
        message: MESSAGES.ALL_PLAYERS_RESPONDED,
        response
      };
    }
    
    // Set next player to respond
    gameState.respondingPlayer = players[currentIndex + 1];
    
    return {
      success: true,
      message: MESSAGES.PLAYER_RESPONDED,
      response,
      nextResponderId: gameState.respondingPlayer
    };
  }

  // Make an accusation
  makeAccusation(gameId, userId, accusation) {
    if (!gameId || !userId || !accusation) {
      return { success: false, message: MESSAGES.INVALID_DATA };
    }
    
    const gameState = this.games.get(gameId);
    if (!gameState) {
      return { success: false, message: MESSAGES.GAME_NOT_FOUND };
    }
    
    // Check if it's player's turn
    if (gameState.turnPlayerId !== userId) {
      return { success: false, message: MESSAGES.NOT_YOUR_TURN };
    }
    
    // For testing, we'll just simulate a response
    // In a real implementation, this would check against the actual solution
    const isCorrect = Math.random() > 0.5; // 50% chance of being correct
    
    if (isCorrect) {
      // Player wins
      gameState.status = 'ended';
      gameState.winner = userId;
      
      return {
        success: true,
        message: MESSAGES.ACCUSATION_CORRECT,
        accusation,
        isCorrect: true,
        winner: userId
      };
    } else {
      // Player is eliminated
      gameState.eliminated.add(userId);
      
      // Check if all players are eliminated
      const activePlayers = Array.from(gameState.players.keys())
        .filter(id => !gameState.eliminated.has(id));
      
      if (activePlayers.length === 0) {
        // Game over, no winners
        gameState.status = 'ended';
        
        return {
          success: true,
          message: MESSAGES.GAME_OVER_NO_WINNERS,
          accusation,
          isCorrect: false
        };
      }
      
      // Move to next player's turn
      const nextPlayerId = activePlayers[0];
      gameState.turnPlayerId = nextPlayerId;
      
      return {
        success: true,
        message: MESSAGES.ACCUSATION_INCORRECT,
        accusation,
        isCorrect: false,
        eliminated: userId,
        nextPlayerId
      };
    }
  }

  // Handle player leaving game
  leaveGame(gameId, userId) {
    if (!gameId || !userId) {
      return { success: false, message: MESSAGES.INVALID_DATA };
    }
    
    const gameState = this.games.get(gameId);
    if (!gameState) {
      return { success: false, message: MESSAGES.GAME_NOT_FOUND };
    }
    
    // Remove player
    gameState.players.delete(userId);
    
    // If it was player's turn, move to next player
    if (gameState.turnPlayerId === userId) {
      const players = Array.from(gameState.players.keys())
        .filter(id => !gameState.eliminated.has(id));
      
      if (players.length > 0) {
        gameState.turnPlayerId = players[0];
      } else {
        gameState.status = 'ended';
      }
    }
    
    // Clean up mappings
    const socket = this.playerSockets.get(userId);
    if (socket) {
      this.socketPlayers.delete(socket.id);
    }
    this.playerSockets.delete(userId);
    this.playerTokens.delete(userId);
    
    return { 
      success: true, 
      message: MESSAGES.PLAYER_LEFT,
      players: Array.from(gameState.players.values()),
      nextPlayerId: gameState.turnPlayerId
    };
  }
  
  // Get socket by player ID
  getSocketByPlayerId(playerId) {
    return this.playerSockets.get(playerId);
  }
  
  // Get player ID by socket ID
  getPlayerBySocketId(socketId) {
    return this.socketPlayers.get(socketId);
  }
  
  // Get player token
  getPlayerToken(playerId) {
    return this.playerTokens.get(playerId);
  }
  
  // Reset all mock data
  __resetMockData() {
    this.games.clear();
    this.playerSockets.clear();
    this.socketPlayers.clear();
    this.playerTokens.clear();
  }
}

// Create singleton instance
const gameStateManager = new GameStateManager();

// Mock all methods with Jest
for (const methodName of Object.getOwnPropertyNames(GameStateManager.prototype)) {
  if (methodName !== 'constructor') {
    gameStateManager[methodName] = jest.fn(gameStateManager[methodName]);
  }
}

export default gameStateManager;