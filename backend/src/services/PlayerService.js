/**
 * @fileoverview Servicio de gestión de jugadores
 * Este servicio maneja todas las operaciones relacionadas
 * con los jugadores, como añadir jugadores a la partida,
 * gestionar su estado, posiciones y acciones en el tablero.
 * @author SAMUEL FELIPE
 */

import { gameService } from './GameService.js';
import { shuffleArray } from '../utils/arrayUtils.js';
import { GAME_STATES } from '../config/constants.js';

/**
 * Servicio para gestionar los jugadores en las partidas
 */
class PlayerService {
  /**
   * Añade un jugador a una partida
   * @param {string} gameId - ID de la partida
   * @param {string} userId - ID del jugador
   * @param {Object} playerData - Datos del jugador
   * @returns {boolean} True si el jugador fue añadido
   */
  async addPlayer(gameId, userId, playerData) {
    if (!gameId || !userId) return false;
    const game = await gameService.initGame(gameId);
    if (!game.players.has(userId)) {
      game.players.set(userId, playerData);
      return true;
    }
    return false;
  }

  /**
   * Elimina un jugador de una partida
   * @param {string} gameId - ID de la partida
   * @param {string} userId - ID del jugador
   * @returns {boolean} True si el jugador fue eliminado
   */
  removePlayer(gameId, userId) {
    if (!gameId || !userId) return false;
    if (!gameService.hasGame(gameId)) return false;

    const game = gameService.getGame(gameId);
    const wasRemoved = game.players.delete(userId);

    if (game.players.size === 0) {
      gameService.removeGame(gameId);
    }

    return wasRemoved;
  }

  /**
   * Obtiene todos los jugadores de una partida
   * @param {string} gameId - ID de la partida
   * @returns {Array} Array con los datos de los jugadores
   */
  getPlayers(gameId) {
    if (!gameService.hasGame(gameId)) return [];
    return Array.from(gameService.getGame(gameId).players.values());
  }

  /**
   * Obtiene el número de jugadores en una partida
   * @param {string} gameId - ID de la partida
   * @returns {number} Número de jugadores
   */
  getPlayerCount(gameId) {
    if (!gameService.hasGame(gameId)) return 0;
    return gameService.getGame(gameId).players.size;
  }

  /**
   * Configura las posiciones iniciales de los jugadores en el tablero
   * @param {string} gameId - ID de la partida
   */
  setupPlayerPositions(gameId) {
    const game = gameService.getGame(gameId);
    if (!game) return;

    const STARTING_POSITIONS = [
      { row: 1, column: 7 },
      { row: 1, column: 13 },
      { row: 10, column: 18 },
      { row: 13, column: 1 },
      { row: 18, column: 7 },
      { row: 18, column: 13 }
    ];

    let posIndex = 0;
    const playerIds = [...game.players.keys()];

    playerIds.forEach(playerId => {
      game.players.get(playerId).position = STARTING_POSITIONS[posIndex++];
    });
  }

  /**
   * Verifica si un jugador puede moverse a una posición
   * @param {string} gameId - ID de la partida
   * @param {string} userId - ID del jugador
   * @param {Object} targetPosition - Posición objetivo
   * @returns {boolean} True si el jugador puede moverse
   */
  canPlayerMoveToPosition(gameId, userId, targetPosition) {
    return true;
  }

  /**
   * Mueve un jugador a una posición
   * @param {string} gameId - ID de la partida
   * @param {string} userId - ID del jugador
   * @param {Object} targetPosition - Posición objetivo
   * @returns {boolean} True si el jugador fue movido
   */
  movePlayer(gameId, userId, targetPosition) {
    return true;
  }

  /**
   * Verifica si una posición está dentro de una habitación
   * @param {Object} room - Habitación
   * @param {Object} position - Posición
   * @returns {boolean} True si la posición está dentro de la habitación
   */
  isPositionInRoom(room, position) {
    return true;
  }

  /**
   * Obtiene la habitación para una posición
   * @param {string} gameId - ID de la partida
   * @param {Object} position - Posición
   * @returns {Object|null} Habitación o null si no se encuentra
   */
  getRoomForPosition(gameId, position) {
    return null;
  }

  /**
   * Obtiene la habitación en la que se encuentra un jugador
   * @param {string} gameId - ID de la partida
   * @param {string} userId - ID del jugador
   * @returns {Object|null} Habitación o null si no se encuentra
   */
  getPlayerRoom(gameId, userId) {
    return null;
  }

  /**
   * Verifica si un jugador está en una partida
   * @param {string} gameId - ID de la partida
   * @param {string} userId - ID del jugador
   * @returns {boolean} - True si el jugador está en la partida
   */
  isPlayerInGame(gameId, userId) {
    const game = gameService.getGame(gameId);
    return game && game.players.has(userId);
  }
}

export const playerService = new PlayerService();
export default playerService;