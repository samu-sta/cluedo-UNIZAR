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
    return this.games.get(gameId);
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
    let board = null;
    try {
      board = await getBoard();
    }
    catch (error) {
      console.log('Error al cargar el tablero:', error);
    }

    if (!this.games.has(gameId)) {
      this.games.set(gameId, {
        players: new Map(),
        timer: null,
        countdown: null,
        state: GAME_STATES.WAITING,
        board,
        solution: null,
        playerCards: null,
        leftoverCards: null,
        diceResult: null
      });
    }
    return this.games.get(gameId);
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
}

export const gameService = new GameService();