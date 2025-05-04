/*************************************************
 * Servicio de gestión de cartas
 * 
 * Proporciona funcionalidades para manejar las cartas
 * del juego, incluyendo reparto, selección de solución
 * y gestión de cartas por jugador.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import { getCards, getCharacters, distributeCards, selectSolution } from '../utils/game.js';
import { getRandomItem } from '../utils/arrayUtils.js';
import { gameService } from './GameService.js';

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
    return game.playerCards?.[userId] || [];
  }

  /**
   * Obtiene la solución de la partida
   * @param {string} gameId - ID de la partida
   * @returns {Object|null} Solución de la partida
   */
  getSolution(gameId) {
    if (!gameService.hasGame(gameId)) return null;

    const game = gameService.getGame(gameId);
    return game.solution ? {
      character: game.solution.character,
      weapon: game.solution.weapon,
      room: game.solution.room
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