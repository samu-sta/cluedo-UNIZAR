/*************************************************
 * Test de integración para mock de SuggestionService
 * 
 * Este mock simula el servicio de sugerencias del juego,
 * permitiendo probar la validación y respuesta a
 * sugerencias y acusaciones de los jugadores.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import { jest } from '@jest/globals';
import MESSAGES from '../../../src/messages/messages.js';

const suggestionService = {
  // Store for game suggestions
  _suggestionStore: new Map(),
  _roomStore: new Map(),
  
  // Validate a player's suggestion
  validateSuggestion: jest.fn().mockImplementation((gameId, playerId, suggestion) => {
    if (!gameId || !playerId || !suggestion) {
      return { valid: false, error: 'INVALID_PARAMETERS' };
    }
    
    // Get the room the player is in (using our room store)
    const playerRoom = suggestionService._roomStore.get(`${gameId}-${playerId}`);
    
    // No room, no suggestion
    if (!playerRoom) {
      return { valid: false, error: 'NOT_IN_ROOM', message: MESSAGES.NOT_IN_ROOM };
    }
    
    // Room name in suggestion must match player's room
    if (suggestion.room !== playerRoom.name) {
      return { 
        valid: false, 
        error: 'ROOM_MISMATCH', 
        message: MESSAGES.SUGGESTION_ROOM_MISMATCH 
      };
    }
    
    return {
      valid: true,
      playerRoom
    };
  }),
  
  // Set the room a player is in (helper for testing)
  __setPlayerRoom: jest.fn().mockImplementation((gameId, playerId, roomName) => {
    suggestionService._roomStore.set(`${gameId}-${playerId}`, {
      name: roomName,
      roomName: roomName
    });
  }),
  
  // Store a suggestion for a game
  setCurrentSuggestion: jest.fn().mockImplementation((gameId, suggestion) => {
    if (!gameId || !suggestion) return;
    
    suggestionService._suggestionStore.set(gameId, {
      suggestion,
      responses: [],
      currentResponderIndex: 0,
      responders: []
    });
  }),
  
  // Check if a player has any matching cards for the current suggestion
  checkPlayerCards: jest.fn().mockImplementation((gameId, playerId, playerCards) => {
    if (!gameId || !playerId) return [];
    
    const suggestionData = suggestionService._suggestionStore.get(gameId);
    if (!suggestionData) return [];
    
    const suggestion = suggestionData.suggestion;
    
    // Find cards that match the suggestion
    return playerCards.filter(card => 
      card.name === suggestion.character ||
      card.name === suggestion.weapon ||
      card.name === suggestion.room
    );
  }),
  
  // Player shows a card in response to a suggestion
  showCard: jest.fn().mockImplementation((gameId, playerId, card) => {
    if (!gameId || !playerId || !card) {
      return { success: false, message: MESSAGES.INVALID_DATA };
    }
    
    const suggestionData = suggestionService._suggestionStore.get(gameId);
    if (!suggestionData || !suggestionData.suggestion) {
      return { success: false, message: MESSAGES.NO_ACTIVE_SUGGESTION };
    }
    
    // Mock response - in real implementation would validate card ownership
    return {
      success: true,
      cardShown: card,
      suggestionMaker: suggestionData.suggestion.username
    };
  }),
  
  // Make an accusation
  makeAccusation: jest.fn().mockImplementation((gameId, playerId, accusation) => {
    if (!gameId || !playerId) {
      return { 
        success: false, 
        message: MESSAGES.INVALID_DATA 
      };
    }
    
    // For testing, we'll match against this predefined solution
    const mockSolution = {
      character: { name: 'Colonel Mustard' },
      weapon: { name: 'Candlestick' },
      room: { name: 'Kitchen' }
    };
    
    // Check if the accusation is correct
    const isCorrect = 
      accusation.character === mockSolution.character.name &&
      accusation.weapon === mockSolution.weapon.name && 
      accusation.room === mockSolution.room.name;
    
    return {
      success: true,
      isCorrect,
      accusation,
      solution: isCorrect ? mockSolution : null,
      shouldEndGame: !isCorrect, // If incorrect, player is eliminated
      winner: isCorrect ? playerId : null // If correct, this player wins
    };
  }),
  
  // Reset mock data
  __resetMockData: jest.fn().mockImplementation(() => {
    suggestionService._suggestionStore.clear();
    suggestionService._roomStore.clear();
  })
};

export default suggestionService;