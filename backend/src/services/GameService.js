import { GAME_STATES } from '../config/constants.js';
import { getBoard } from '../utils/game.js';

/**
 * Servicio para gestionar las partidas
 */
class GameService {
  constructor() {
    this.games = new Map();
  }

  /**
   * Obtiene una partida por su ID
   * @param {string} gameId - ID de la partida
   * @returns {Object|null} Datos de la partida o null si no existe
   */
  getGame(gameId) {
    return this.games.get(gameId) || null;
  }

  /**
   * Verifica si una partida existe
   * @param {string} gameId - ID de la partida
   * @returns {boolean} - Verdadero si existe
   */
  hasGame(gameId) {
    return this.games.has(gameId);
  }

  /**
   * Establece el estado de una partida
   * @param {string} gameId - ID de la partida
   * @param {string} state - Nuevo estado de la partida
   */
  setGameState(gameId, state) {
    if (!this.hasGame(gameId)) return;
    this.getGame(gameId).state = state;
  }

  /**
   * Obtiene el estado actual de una partida
   * @param {string} gameId - ID de la partida
   * @returns {string} Estado actual de la partida
   */
  getGameState(gameId) {
    if (!this.hasGame(gameId)) return GAME_STATES.WAITING;
    return this.getGame(gameId).state;
  }

  /**
   * Inicializa una nueva partida
   * @param {string} gameId - ID de la partida
   * @returns {Object} Datos de la partida inicializada
   */
  async initGame(gameId) {
    if (this.games.has(gameId)) {
      return this.games.get(gameId);
    }

    const game = {
      id: gameId,
      players: new Map(),
      state: GAME_STATES.WAITING,
      board: null,
      solution: null,
      playerCards: {},
      leftoverCards: [],
      canRollDice: true,
      hasMoved: false,
      hasSuggested: false,
      currentSuggestion: null,
      suggestionResponses: []
    };

    this.games.set(gameId, game);
    return game;
  }

  /**
   * Elimina una partida
   * @param {string} gameId - ID de la partida
   * @returns {boolean} - True si la partida fue eliminada
   */
  removeGame(gameId) {
    return this.games.delete(gameId);
  }

  /**
   * Obtiene el número de partidas activas
   * @returns {number} Número de partidas activas
   */
  getActiveGamesCount() {
    return this.games.size;
  }

  /**
   * Obtiene todas las partidas activas
   * @returns {Map} Map con todas las partidas activas
   */
  getAllGames() {
    return this.games;
  }

  /**
   * Prepara una respuesta de partida para la API HTTP
   * @param {Object} user - Datos del usuario
   * @param {string} gameId - ID de la partida
   * @returns {Object} - Respuesta formateada
   */
  prepareGameResponse(user, gameId) {
    return {
      success: true,
      gameId,
      token: 'test-socket-token'
    };
  }
}

export const gameService = new GameService();
export default gameService;