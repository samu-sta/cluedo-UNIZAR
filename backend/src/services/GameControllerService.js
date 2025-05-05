/*************************************************
 * Servicio de control del juego
 * 
 * Gestiona la creación de respuestas para la API,
 * preparando datos de partidas y generando tokens
 * para la conexión de WebSockets.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import { getGame } from "../utils/game.js";
import auth from "../utils/auth.js";
import { gameService } from './GameService.js';

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
}

const gameControllerService = new GameService();
export default gameControllerService;