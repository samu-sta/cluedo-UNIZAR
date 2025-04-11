import MESSAGES from "../messages/messages.js";
import { v4 as uuidv4 } from 'uuid';
import { gameStateManager } from "../socket/GameStateManager.js";
import gameService from "../services/GameControllerService.js";
import { GAME_STATES } from "../config/constants.js";

/**
 * Controlador para gestionar las partidas del juego a través de HTTP
 */
class GameController {

  /**
   * Crear una nueva partida
   * @param {Object} req - Objeto request de Express
   * @param {Object} res - Objeto response de Express
   * @returns {Object} Respuesta JSON con los datos de la partida creada
   */
  async createGame(req, res) {
    try {
      const user = req.account;
      const gameId = uuidv4();

      gameStateManager.registerGame(gameId, user);

      const response = await gameService.prepareGameResponse(user, gameId);
      return res.status(201).json(response);
    }
    catch (error) {
      return res.status(500).json({
        success: false,
        message: MESSAGES.ERROR_500
      });
    }
  }

  /**
   * Unirse a una partida existente
   * @param {Object} req - Objeto request de Express
   * @param {Object} res - Objeto response de Express
   * @returns {Object} Respuesta JSON con los datos de la partida
   */
  async joinGame(req, res) {
    try {
      const { gameId } = req.params;
      const user = req.account;

      if (!gameStateManager.gameExists(gameId)) {
        return res.status(404).json({
          success: false,
          message: MESSAGES.GAME_NOT_FOUND
        });
      }


      if (gameStateManager.getGameState(gameId) === GAME_STATES.PLAYING) {
        return res.status(403).json({
          success: false,
          message: MESSAGES.GAME_ALREADY_STARTED
        });
      }

      gameStateManager.addPlayerToGame(gameId, user);

      const response = await gameService.prepareGameResponse(user, gameId);
      return res.status(200).json(response);
    }
    catch (error) {
      return res.status(500).json({
        success: false,
        message: MESSAGES.ERROR_500
      });
    }
  }
}

const gameController = new GameController();
export default gameController;