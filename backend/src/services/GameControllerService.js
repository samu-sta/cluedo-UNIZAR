import { getGame } from "../utils/game.js";
import auth from "../utils/auth.js";

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

const gameService = new GameService();
export default gameService;