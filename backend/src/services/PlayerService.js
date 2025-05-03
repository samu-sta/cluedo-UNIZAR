import { gameService } from './GameService.js';

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