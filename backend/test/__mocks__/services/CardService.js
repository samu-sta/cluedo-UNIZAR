import { jest } from '@jest/globals';
import { CHARACTERS, WEAPONS, ROOMS } from '../../../src/config/gameConstants.js';

class CardService {
  constructor() {
    this.characters = [...CHARACTERS];
    this.weapons = [...WEAPONS];
    this.rooms = [...ROOMS];
    this.envelopes = new Map();
    this.playerCards = new Map();
    
    // Bind methods for using as callbacks
    this.createCardDeck = this.createCardDeck.bind(this);
    this.shuffleCards = this.shuffleCards.bind(this);
    this.distributeCards = this.distributeCards.bind(this);
    this.getPlayerCards = this.getPlayerCards.bind(this);
    this.getEnvelope = this.getEnvelope.bind(this);
    this.getCardByName = this.getCardByName.bind(this);
    this.getCardById = this.getCardById.bind(this);
  }

  // Create a complete deck of cards
  createCardDeck(gameId) {
    if (!gameId) {
      return { success: false, error: 'Invalid game ID' };
    }
    
    // Initialize card collections for this game
    const characterCards = this.characters.map(character => ({
      id: `character_${character}`,
      type: 'character',
      name: character,
    }));
    
    const weaponCards = this.weapons.map(weapon => ({
      id: `weapon_${weapon}`,
      type: 'weapon',
      name: weapon,
    }));
    
    const roomCards = this.rooms.map(room => ({
      id: `room_${room}`,
      type: 'room',
      name: room,
    }));
    
    const allCards = [
      ...characterCards,
      ...weaponCards,
      ...roomCards
    ];
    
    return { 
      success: true, 
      cards: allCards,
      characterCards,
      weaponCards,
      roomCards
    };
  }
  
  // Shuffle array of cards - Fisher-Yates shuffle
  shuffleCards(cards) {
    if (!Array.isArray(cards)) {
      return { success: false, error: 'Invalid cards array' };
    }
    
    const shuffled = [...cards];
    
    // Use Fisher-Yates algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return { 
      success: true, 
      shuffledCards: shuffled 
    };
  }
  
  // Distribute cards to players
  distributeCards(gameId, playerIds) {
    if (!gameId || !Array.isArray(playerIds) || playerIds.length === 0) {
      return { success: false, error: 'Invalid data' };
    }
    
    // Create deck
    const { cards, characterCards, weaponCards, roomCards } = this.createCardDeck(gameId);
    
    // Select murder cards for the envelope
    const envelopeCharacter = characterCards[Math.floor(Math.random() * characterCards.length)];
    const envelopeWeapon = weaponCards[Math.floor(Math.random() * weaponCards.length)];
    const envelopeRoom = roomCards[Math.floor(Math.random() * roomCards.length)];
    
    // Set the envelope for this game
    const envelope = {
      character: envelopeCharacter,
      weapon: envelopeWeapon,
      room: envelopeRoom
    };
    this.envelopes.set(gameId, envelope);
    
    // Remove envelope cards from the deck
    const remainingCards = cards.filter(card => 
      card.id !== envelopeCharacter.id && 
      card.id !== envelopeWeapon.id && 
      card.id !== envelopeRoom.id
    );
    
    // Shuffle remaining cards
    const { shuffledCards } = this.shuffleCards(remainingCards);
    
    // Distribute cards to players
    const playerCardMap = {};
    playerIds.forEach((playerId, index) => {
      playerCardMap[playerId] = [];
    });
    
    let playerIndex = 0;
    shuffledCards.forEach(card => {
      playerCardMap[playerIds[playerIndex]].push(card);
      playerIndex = (playerIndex + 1) % playerIds.length;
    });
    
    // Store player cards
    this.playerCards.set(gameId, new Map(Object.entries(playerCardMap)));
    
    return { 
      success: true, 
      envelope,
      playerCardMap
    };
  }
  
  // Get cards for a specific player
  getPlayerCards(gameId, playerId) {
    if (!gameId || !playerId) {
      return { success: false, error: 'Invalid data' };
    }
    
    const gameCards = this.playerCards.get(gameId);
    if (!gameCards) {
      return { success: false, error: 'Game not found' };
    }
    
    const playerCards = gameCards.get(playerId);
    if (!playerCards) {
      return { success: false, error: 'No cards for player' };
    }
    
    return { 
      success: true, 
      cards: playerCards 
    };
  }
  
  // Get the envelope (solution) for a game
  getEnvelope(gameId) {
    if (!gameId) {
      return { success: false, error: 'Invalid game ID' };
    }
    
    const envelope = this.envelopes.get(gameId);
    if (!envelope) {
      return { success: false, error: 'Envelope not found for game' };
    }
    
    return { 
      success: true, 
      envelope 
    };
  }
  
  // Get a card by name
  getCardByName(gameId, cardName) {
    if (!gameId || !cardName) {
      return { success: false, error: 'Invalid data' };
    }
    
    const { cards } = this.createCardDeck(gameId);
    
    const card = cards.find(c => c.name.toLowerCase() === cardName.toLowerCase());
    if (!card) {
      return { success: false, error: 'Card not found' };
    }
    
    return { 
      success: true, 
      card 
    };
  }
  
  // Get a card by ID
  getCardById(gameId, cardId) {
    if (!gameId || !cardId) {
      return { success: false, error: 'Invalid data' };
    }
    
    const { cards } = this.createCardDeck(gameId);
    
    const card = cards.find(c => c.id === cardId);
    if (!card) {
      return { success: false, error: 'Card not found' };
    }
    
    return { 
      success: true, 
      card 
    };
  }
  
  // Check if a player has a specific card
  playerHasCard(gameId, playerId, cardName) {
    if (!gameId || !playerId || !cardName) {
      return { success: false, error: 'Invalid data' };
    }
    
    const { success, cards } = this.getPlayerCards(gameId, playerId);
    if (!success) {
      return { success: false, error: 'Could not get player cards' };
    }
    
    const hasCard = cards.some(card => card.name.toLowerCase() === cardName.toLowerCase());
    
    return { 
      success: true, 
      hasCard 
    };
  }
  
  // Reset mock state for testing
  __resetMockState() {
    this.envelopes.clear();
    this.playerCards.clear();
  }
}

// Create singleton instance
const cardService = new CardService();

// Mock all methods with Jest
Object.getOwnPropertyNames(CardService.prototype).forEach(method => {
  if (method !== 'constructor' && !method.startsWith('__')) {
    cardService[method] = jest.fn(cardService[method]);
  }
});

export default cardService;
