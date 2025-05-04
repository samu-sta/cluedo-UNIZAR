import { jest } from '@jest/globals';
import { CHARACTERS } from '../../../src/config/gameConstants.js';

class PlayerService {
  constructor() {
    this.players = new Map();
    this.positions = new Map();
    this.characters = [...CHARACTERS];
    this.cards = new Map();
    this.notes = new Map();
    
    // Bind methods for using as callbacks
    this.addPlayer = this.addPlayer.bind(this);
    this.removePlayer = this.removePlayer.bind(this);
    this.getPlayers = this.getPlayers.bind(this);
    this.getPlayer = this.getPlayer.bind(this);
    this.setPlayerPosition = this.setPlayerPosition.bind(this);
    this.getPlayerPosition = this.getPlayerPosition.bind(this);
    this.assignCharacter = this.assignCharacter.bind(this);
    this.dealCards = this.dealCards.bind(this);
    this.getPlayerCards = this.getPlayerCards.bind(this);
    this.addNote = this.addNote.bind(this);
    this.getNotes = this.getNotes.bind(this);
  }

  // Add a player to the game
  addPlayer(gameId, player) {
    if (!gameId || !player || !player.id) {
      return { success: false, error: 'Invalid player data' };
    }
    
    if (!this.players.has(gameId)) {
      this.players.set(gameId, new Map());
      this.positions.set(gameId, new Map());
      this.cards.set(gameId, new Map());
      this.notes.set(gameId, new Map());
    }
    
    const gamePlayers = this.players.get(gameId);
    
    // Check if player already exists
    if (gamePlayers.has(player.id)) {
      return { success: false, error: 'Player already in game' };
    }
    
    // Set default player properties
    const newPlayer = {
      id: player.id,
      username: player.username || `Player ${gamePlayers.size + 1}`,
      ready: false,
      character: null,
      isHost: gamePlayers.size === 0, // First player is host
      ...player
    };
    
    gamePlayers.set(player.id, newPlayer);
    
    return { 
      success: true, 
      player: newPlayer,
      players: Array.from(gamePlayers.values())
    };
  }
  
  // Remove a player from the game
  removePlayer(gameId, playerId) {
    if (!gameId || !playerId) {
      return { success: false, error: 'Invalid data' };
    }
    
    if (!this.players.has(gameId)) {
      return { success: false, error: 'Game not found' };
    }
    
    const gamePlayers = this.players.get(gameId);
    const gamePositions = this.positions.get(gameId);
    const gameCards = this.cards.get(gameId);
    const gameNotes = this.notes.get(gameId);
    
    // Check if player exists
    if (!gamePlayers.has(playerId)) {
      return { success: false, error: 'Player not found' };
    }
    
    const removedPlayer = gamePlayers.get(playerId);
    
    // Release the character if assigned
    if (removedPlayer.character) {
      this.characters.push(removedPlayer.character);
    }
    
    // Remove player from all collections
    gamePlayers.delete(playerId);
    gamePositions.delete(playerId);
    gameCards.delete(playerId);
    gameNotes.delete(playerId);
    
    // If removed player was host, assign new host
    if (removedPlayer.isHost && gamePlayers.size > 0) {
      const nextPlayerId = gamePlayers.keys().next().value;
      const nextPlayer = gamePlayers.get(nextPlayerId);
      nextPlayer.isHost = true;
    }
    
    return { 
      success: true, 
      removedPlayerId: playerId,
      players: Array.from(gamePlayers.values())
    };
  }
  
  // Get all players in a game
  getPlayers(gameId) {
    if (!gameId) {
      return { success: false, error: 'Invalid game ID' };
    }
    
    if (!this.players.has(gameId)) {
      return { success: false, error: 'Game not found' };
    }
    
    return { 
      success: true, 
      players: Array.from(this.players.get(gameId).values()) 
    };
  }
  
  // Get a specific player
  getPlayer(gameId, playerId) {
    if (!gameId || !playerId) {
      return { success: false, error: 'Invalid data' };
    }
    
    if (!this.players.has(gameId)) {
      return { success: false, error: 'Game not found' };
    }
    
    const gamePlayers = this.players.get(gameId);
    
    if (!gamePlayers.has(playerId)) {
      return { success: false, error: 'Player not found' };
    }
    
    return { 
      success: true, 
      player: gamePlayers.get(playerId) 
    };
  }
  
  // Set player position
  setPlayerPosition(gameId, playerId, position) {
    if (!gameId || !playerId || !position) {
      return { success: false, error: 'Invalid data' };
    }
    
    if (!this.players.has(gameId)) {
      return { success: false, error: 'Game not found' };
    }
    
    const gamePlayers = this.players.get(gameId);
    const gamePositions = this.positions.get(gameId);
    
    if (!gamePlayers.has(playerId)) {
      return { success: false, error: 'Player not found' };
    }
    
    // Update position
    gamePositions.set(playerId, position);
    
    return { 
      success: true, 
      playerId,
      position 
    };
  }
  
  // Get player position
  getPlayerPosition(gameId, playerId) {
    if (!gameId || !playerId) {
      return { success: false, error: 'Invalid data' };
    }
    
    if (!this.positions.has(gameId)) {
      return { success: false, error: 'Game not found' };
    }
    
    const gamePositions = this.positions.get(gameId);
    
    if (!gamePositions.has(playerId)) {
      return { success: false, error: 'Position not found for player' };
    }
    
    return { 
      success: true, 
      position: gamePositions.get(playerId) 
    };
  }
  
  // Assign character to player
  assignCharacter(gameId, playerId, characterName) {
    if (!gameId || !playerId) {
      return { success: false, error: 'Invalid data' };
    }
    
    if (!this.players.has(gameId)) {
      return { success: false, error: 'Game not found' };
    }
    
    const gamePlayers = this.players.get(gameId);
    
    if (!gamePlayers.has(playerId)) {
      return { success: false, error: 'Player not found' };
    }
    
    const player = gamePlayers.get(playerId);
    
    // If character is already assigned, remove it
    if (player.character) {
      this.characters.push(player.character);
    }
    
    // If specific character requested
    if (characterName) {
      // Check if character is available
      const index = this.characters.indexOf(characterName);
      if (index === -1) {
        return { success: false, error: 'Character not available' };
      }
      
      // Remove character from available list
      this.characters.splice(index, 1);
      
      // Assign to player
      player.character = characterName;
    } else {
      // Assign random character
      if (this.characters.length === 0) {
        return { success: false, error: 'No characters available' };
      }
      
      // Get random character
      const randomIndex = Math.floor(Math.random() * this.characters.length);
      const character = this.characters[randomIndex];
      
      // Remove from available list
      this.characters.splice(randomIndex, 1);
      
      // Assign to player
      player.character = character;
    }
    
    return { 
      success: true, 
      playerId,
      character: player.character 
    };
  }
  
  // Deal cards to players
  dealCards(gameId, playerCards) {
    if (!gameId || !playerCards) {
      return { success: false, error: 'Invalid data' };
    }
    
    if (!this.players.has(gameId)) {
      return { success: false, error: 'Game not found' };
    }
    
    const gameCards = this.cards.get(gameId);
    
    // Assign cards to each player
    Object.entries(playerCards).forEach(([playerId, cards]) => {
      gameCards.set(playerId, [...cards]);
    });
    
    return { 
      success: true, 
      cardsDealt: true 
    };
  }
  
  // Get player's cards
  getPlayerCards(gameId, playerId) {
    if (!gameId || !playerId) {
      return { success: false, error: 'Invalid data' };
    }
    
    if (!this.cards.has(gameId)) {
      return { success: false, error: 'Game not found' };
    }
    
    const gameCards = this.cards.get(gameId);
    
    if (!gameCards.has(playerId)) {
      return { success: false, error: 'No cards found for player' };
    }
    
    return { 
      success: true, 
      cards: gameCards.get(playerId) 
    };
  }
  
  // Add a note for a player
  addNote(gameId, playerId, note) {
    if (!gameId || !playerId || !note) {
      return { success: false, error: 'Invalid data' };
    }
    
    if (!this.notes.has(gameId)) {
      return { success: false, error: 'Game not found' };
    }
    
    const gameNotes = this.notes.get(gameId);
    
    if (!gameNotes.has(playerId)) {
      gameNotes.set(playerId, []);
    }
    
    const playerNotes = gameNotes.get(playerId);
    playerNotes.push({
      id: Date.now().toString(),
      text: note,
      timestamp: new Date().toISOString()
    });
    
    return { 
      success: true, 
      note: playerNotes[playerNotes.length - 1] 
    };
  }
  
  // Get all notes for a player
  getNotes(gameId, playerId) {
    if (!gameId || !playerId) {
      return { success: false, error: 'Invalid data' };
    }
    
    if (!this.notes.has(gameId)) {
      return { success: false, error: 'Game not found' };
    }
    
    const gameNotes = this.notes.get(gameId);
    
    if (!gameNotes.has(playerId)) {
      return { success: true, notes: [] };
    }
    
    return { 
      success: true, 
      notes: gameNotes.get(playerId) 
    };
  }
  
  // Get the game host
  getGameHost(gameId) {
    if (!gameId) {
      return { success: false, error: 'Invalid game ID' };
    }
    
    if (!this.players.has(gameId)) {
      return { success: false, error: 'Game not found' };
    }
    
    const gamePlayers = this.players.get(gameId);
    
    for (const player of gamePlayers.values()) {
      if (player.isHost) {
        return { success: true, hostId: player.id, host: player };
      }
    }
    
    return { success: false, error: 'No host found' };
  }
  
  // Set player ready status
  setPlayerReady(gameId, playerId, ready = true) {
    if (!gameId || !playerId) {
      return { success: false, error: 'Invalid data' };
    }
    
    if (!this.players.has(gameId)) {
      return { success: false, error: 'Game not found' };
    }
    
    const gamePlayers = this.players.get(gameId);
    
    if (!gamePlayers.has(playerId)) {
      return { success: false, error: 'Player not found' };
    }
    
    const player = gamePlayers.get(playerId);
    player.ready = ready;
    
    return { 
      success: true, 
      playerId,
      ready 
    };
  }
  
  // Check if all players are ready
  areAllPlayersReady(gameId) {
    if (!gameId) {
      return { success: false, error: 'Invalid game ID' };
    }
    
    if (!this.players.has(gameId)) {
      return { success: false, error: 'Game not found' };
    }
    
    const gamePlayers = this.players.get(gameId);
    
    let allReady = true;
    for (const player of gamePlayers.values()) {
      if (!player.ready) {
        allReady = false;
        break;
      }
    }
    
    return { 
      success: true, 
      allReady 
    };
  }
  
  // Reset the mock state for testing
  __resetMockState() {
    this.players.clear();
    this.positions.clear();
    this.characters = [...CHARACTERS];
    this.cards.clear();
    this.notes.clear();
  }
}

// Create singleton instance
const playerService = new PlayerService();

// Mock all methods with Jest
Object.getOwnPropertyNames(PlayerService.prototype).forEach(method => {
  if (method !== 'constructor' && !method.startsWith('__')) {
    playerService[method] = jest.fn(playerService[method]);
  }
});

export default playerService;
