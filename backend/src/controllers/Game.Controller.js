/*************************************************
 * Controlador de juego
 * 
 * Este controlador gestiona las operaciones relacionadas
 * con partidas, incluyendo creación, unión y búsqueda
 * de partidas disponibles a través de la API REST.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import MESSAGES from "../messages/messages.js";
import { v4 as uuidv4 } from 'uuid';
import { gameStateManager } from "../socket/GameStateManager.js";
import gameService from "../services/GameControllerService.js";
import { GAME_STATES } from "../config/constants.js";
import { GAME_CONFIG } from "../config/constants.js";
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

      if (gameStateManager.isPlayerInGame(gameId, user)) {
        return res.status(403).json({
          success: false,
          message: MESSAGES.ALREADY_IN_GAME
        });
      }

      if (gameStateManager.getPlayerCount(gameId) === GAME_CONFIG.MAX_PLAYERS) {

        return res.status(403).json({
          success: false,
          message: MESSAGES.GAME_FULL
        });
      }

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

  /**
   * Buscar una partida aleatoria para unirse
   * @param {Object} req - Objeto request de Express
   * @param {Object} res - Objeto response de Express
   * @returns {Object} Respuesta JSON con los datos de la partida encontrada
   */
  async findRandomGame(req, res) {
    try {
      const user = req.account;
      const availableGames = gameStateManager.getAvailableGames();

      if (!availableGames || availableGames.length === 0) {
        return res.status(404).json({
          success: false,
          message: MESSAGES.GAME_NOT_FOUND
        });
      }

      const randomIndex = Math.floor(Math.random() * availableGames.length);
      const randomGameId = availableGames[randomIndex];

      const response = await gameService.prepareGameResponse(user, randomGameId);
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