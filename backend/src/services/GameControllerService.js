import { getGame } from "../utils/game.js";
import auth from "../utils/auth.js";
import { gameStateManager } from '../socket/GameStateManager.js';

/**
 * Servicio para gestionar funcionalidades relacionadas con partidas
 */
class GameService {
  /**
   * Prepara la respuesta estándar para crear/unirse a partida
   * @param {Object} user - Datos del usuario
   * @param {string} gameId - ID de la partida
   * @returns {Promise<Object>} Objeto con datos para la respuesta
   */
  async prepareGameResponse(user, gameId) {
    const socketToken = auth.generateSocketToken(user, gameId);
    const gameInfo = await getGame();

    return {
      success: true,
      gameId,
      gameInfo,
      socketToken
    };
  }

  /**
   * Obtiene todas las partidas
   * @returns {Map} - Mapa con todas las partidas
   */
  getAllGames() {
    return gameStateManager.getAllGames ? gameStateManager.getAllGames() : new Map();
  }

  /**
   * Obtiene una partida
   * @param {string} gameId - ID de la partida
   * @returns {Object|null} - Datos de la partida o null
   */
  getGame(gameId) {
    return gameStateManager.getGame(gameId);
  }

  /**
   * Verifica si existe una partida
   * @param {string} gameId - ID de la partida
   * @returns {boolean} - True si existe
   */
  hasGame(gameId) {
    return gameStateManager.hasGame(gameId);
  }

  /**
   * Inicializa una partida
   * @param {string} gameId - ID de la partida
   * @returns {Object} - Datos de la partida
   */
  async initGame(gameId) {
    return await gameStateManager.initGame(gameId);
  }

  /**
   * Establece el estado de una partida
   * @param {string} gameId - ID de la partida
   * @param {string} state - Estado a establecer
   */
  setGameState(gameId, state) {
    gameStateManager.setGameState(gameId, state);
  }

  /**
   * Obtiene el estado de una partida
   * @param {string} gameId - ID de la partida
   * @returns {string|null} - Estado de la partida o null
   */
  getGameState(gameId) {
    return gameStateManager.getGameState(gameId);
  }

  /**
   * Elimina una partida
   * @param {string} gameId - ID de la partida
   * @returns {boolean} - True si fue eliminada
   */
  removeGame(gameId) {
    return gameStateManager.removeGame(gameId);
  }

  /**
   * Obtiene el número de partidas activas
   * @returns {number} - Número de partidas
   */
  getActiveGamesCount() {
    return gameStateManager.getAvailableGames ? gameStateManager.getAvailableGames().length : 0;
  }
}

const gameService = new GameService();
export { gameService };
export default gameService;