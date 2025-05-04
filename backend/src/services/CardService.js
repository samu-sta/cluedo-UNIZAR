/**
 * @fileoverview Servicio de gestión de cartas del juego
 * Este servicio maneja la distribución de cartas entre jugadores,
 * la selección de la solución del juego y las operaciones relacionadas
 * con verificación de cartas para acusaciones y sugerencias.
 * @author SAMUEL FELIPE
 */

import { getCards, getCharacters, distributeCards, selectSolution } from '../utils/game.js';
import { getRandomItem } from '../utils/arrayUtils.js';
import { gameService } from './GameService.js';
import { CARD_TYPES } from '../config/gameConstants.js';

/**
 * Servicio para gestionar las cartas en el juego
 */
class CardService {
  /**
   * Obtiene todas las cartas del juego agrupadas por tipo
   * @returns {Object} Cartas agrupadas por tipo
   */
  async getAllCards() {
    const cards = await getCards();
    const characters = cards.filter(card => card.type === 'character');
    const weapons = cards.filter(card => card.type === 'weapon');
    const rooms = cards.filter(card => card.type === 'room');
    return {
      characters,
      weapons,
      rooms,
      allCards: [...characters, ...weapons, ...rooms]
    };
  }

  /**
   * Distribuye las cartas entre los jugadores
   * @param {Array} cards - Cartas a distribuir
   * @param {Array} playerIds - IDs de los jugadores
   * @returns {Object} Objeto con las cartas por jugador y las sobrantes
   */
  distributeCardsToPlayers(cards, playerIds) {
    return distributeCards(cards, playerIds);
  }

  /**
   * Inicializa el mazo para un juego
   * @returns {Object} Mazo con las cartas de la solución y las cartas restantes
   */
  initializeDeck() {
    const characters = [
      { type: CARD_TYPES.SUSPECT, value: 'Colonel Mustard' },
      { type: CARD_TYPES.SUSPECT, value: 'Mrs. White' },
      { type: CARD_TYPES.SUSPECT, value: 'Miss Scarlett' }
    ];
    
    const weapons = [
      { type: CARD_TYPES.WEAPON, value: 'Knife' },
      { type: CARD_TYPES.WEAPON, value: 'Rope' },
      { type: CARD_TYPES.WEAPON, value: 'Candlestick' }
    ];
    
    const rooms = [
      { type: CARD_TYPES.ROOM, value: 'Kitchen' },
      { type: CARD_TYPES.ROOM, value: 'Ballroom' },
      { type: CARD_TYPES.ROOM, value: 'Library' }
    ];

    const murderer = getRandomItem(characters);
    const murderWeapon = getRandomItem(weapons);
    const murderRoom = getRandomItem(rooms);

    const remainingCharacters = characters.filter(c => c.value !== murderer.value);
    const remainingWeapons = weapons.filter(w => w.value !== murderWeapon.value);
    const remainingRooms = rooms.filter(r => r.value !== murderRoom.value);

    const cards = [
      ...remainingCharacters,
      ...remainingWeapons,
      ...remainingRooms
    ];

    return {
      murderer,
      murderWeapon,
      murderRoom,
      cards
    };
  }

  /**
   * Reparte las cartas a los jugadores
   * @param {string} gameId - ID de la partida
   * @returns {boolean} - True si se repartieron correctamente, False en caso contrario
   */
  dealCards(gameId) {
    if (!gameService.hasGame(gameId)) {
      return false;
    }

    const game = gameService.getGame(gameId);
    const playerIds = Array.from(game.players.keys());
    const cards = [...game.deck.cards];
    
    // Shuffle cards
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    
    // Calculate cards per player
    const cardsPerPlayer = Math.floor(cards.length / playerIds.length);
    
    // Distribute cards
    for (let i = 0; i < playerIds.length; i++) {
      const playerId = playerIds[i];
      const start = i * cardsPerPlayer;
      const end = (i === playerIds.length - 1) ? cards.length : (i + 1) * cardsPerPlayer;
      game.players.get(playerId).cards = cards.slice(start, end);
    }
    
    return true;
  }

  /**
   * Verifica si un jugador puede refutar una sugerencia
   * @param {string} gameId - ID de la partida
   * @param {string} playerId - ID del jugador
   * @param {Object} suggestion - Sugerencia a comprobar
   * @returns {Object|null} - Carta que refuta la sugerencia o null
   */
  checkCard(gameId, playerId, suggestion) {
    if (!gameService.hasGame(gameId)) {
      return null;
    }
    
    const game = gameService.getGame(gameId);
    const player = game.players.get(playerId);
    
    if (!player || !player.cards || player.cards.length === 0) {
      return null;
    }
    
    // Check for suspect match
    const suspectCard = player.cards.find(card => 
      card.type === CARD_TYPES.SUSPECT && card.value === suggestion.suspect);
    if (suspectCard) {
      return suspectCard;
    }
    
    // Check for weapon match
    const weaponCard = player.cards.find(card => 
      card.type === CARD_TYPES.WEAPON && card.value === suggestion.weapon);
    if (weaponCard) {
      return weaponCard;
    }
    
    // Check for room match
    const roomCard = player.cards.find(card => 
      card.type === CARD_TYPES.ROOM && card.value === suggestion.room);
    if (roomCard) {
      return roomCard;
    }
    
    return null;
  }

  /**
   * Obtiene una carta de un tipo específico para un jugador
   * @param {string} gameId - ID de la partida
   * @param {string} playerId - ID del jugador
   * @param {string} type - Tipo de carta (character, weapon, room)
   * @returns {Object|null} - Carta del tipo especificado o null si no la tiene
   */
  getPlayerCardForType(gameId, playerId, type) {
    const cards = this.getPlayerCards(gameId, playerId);
    return cards.find(card => card.type === type) || null;
  }

  /**
   * Selecciona una solución al azar (personaje, arma, habitación)
   * @param {Object} allCards - Todas las cartas por tipo
   * @returns {Object} Solución seleccionada y cartas restantes
   */
  selectGameSolution(allCards) {
    return selectSolution(allCards);
  }

  /**
   * Asigna personajes a los jugadores de una partida
   * @param {string} gameId - ID de la partida
   */
  async assignCharactersToPlayers(gameId) {
    const game = gameService.getGame(gameId);
    if (!game) return;

    try {
      const characters = await getCharacters();
      this.distributeCharacters(game, characters);
    }
    catch (error) {
      console.log('Error al asignar personajes:', error);
    }
  }

  /**
   * Asigna personajes a los jugadores
   * @param {Object} game - Datos de la partida
   * @param {Array} characters - Personajes disponibles
   */
  distributeCharacters(game, characters) {
    const availableCharacters = [...characters];
    const playerIds = [...game.players.keys()];

    playerIds.forEach(playerId => {
      const character = getRandomItem(availableCharacters);
      const characterIndex = availableCharacters.findIndex(c => c.name === character.name);
      availableCharacters.splice(characterIndex, 1);

      game.players.get(playerId).character = character;
    });
  }

  /**
   * Obtiene las cartas de un jugador
   * @param {string} gameId - ID de la partida
   * @param {string} userId - ID del jugador
   * @returns {Array} Cartas del jugador
   */
  getPlayerCards(gameId, userId) {
    if (!gameService.hasGame(gameId)) return [];

    const game = gameService.getGame(gameId);
    const player = game.players.get(userId);
    return player?.cards || [];
  }

  /**
   * Obtiene la solución de la partida
   * @param {string} gameId - ID de la partida
   * @returns {Object|null} Solución de la partida
   */
  getSolution(gameId) {
    if (!gameService.hasGame(gameId)) return null;

    const game = gameService.getGame(gameId);
    return game.deck ? {
      suspect: game.deck.murderer.value,
      weapon: game.deck.murderWeapon.value,
      room: game.deck.murderRoom.value
    } : null;
  }

  /**
   * Obtiene las cartas sobrantes de la partida
   * @param {string} gameId - ID de la partida
   * @returns {Array} Cartas sobrantes
   */
  getLeftoverCards(gameId) {
    if (!gameService.hasGame(gameId)) return [];

    const game = gameService.getGame(gameId);
    return game.leftoverCards || [];
  }

  /**
   * Redistribuye las cartas de un jugador que sale del juego
   * @param {string} gameId - ID de la partida
   * @param {string} userId - ID del jugador
   */
  redistributePlayerCards(gameId, userId) {
    const game = gameService.getGame(gameId);
    const playerCards = this.getPlayerCards(gameId, userId);

    if (playerCards?.length) {
      game.leftoverCards = [...(game.leftoverCards || []), ...playerCards];
      delete game.playerCards?.[userId];
    }
  }
}

export const cardService = new CardService();
export default cardService;