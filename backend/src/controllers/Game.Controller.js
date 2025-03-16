import MESSAGES from "../messages/messages.js";
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import accountModel from "../models/Account.js";
import { gameStateManager } from "../socket/handlers.js";

let activeGames = new Map();

export { activeGames };

export default class GameController {

  createGame = async (req, res) => {
    try {
      const userId = req.userId;

      const user = await accountModel.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          error: MESSAGES.USER_NOT_FOUND
        });
      }

      const gameId = uuidv4();

      activeGames.set(gameId, {
        players: [{
          username: user.username
        }]
      });

      const socketToken = jwt.sign(
        {
          userId,
          gameId,
          username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.status(201).json({
        success: true,
        gameId,
        socketToken,
        message: "Partida creada con éxito"
      });
    }
    catch (error) {
      console.error('Error al crear partida:', error);
      return res.status(500).json({ error: MESSAGES.ERROR_500 });
    }
  }

  joinGame = async (req, res) => {
    try {
      const { gameId } = req.params;
      const userId = req.userId;

      if (!activeGames.has(gameId)) {
        return res.status(404).json({ error: "Partida no encontrada" });
      }

      const game = activeGames.get(gameId);

      if (gameStateManager.getGameState(gameId) === 'playing') {
        return res.status(403).json({ error: "La partida ya ha comenzado" });
      }

      const user = await accountModel.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: MESSAGES.USER_NOT_FOUND });
      }

      const isAlreadyInGame = game.players.some(player => player.id === userId);

      if (!isAlreadyInGame) {
        game.players.push({
          username: user.username
        });
      }

      activeGames.set(gameId, game);

      const socketToken = jwt.sign(
        {
          userId,
          gameId,
          username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        success: true,
        gameId,
        socketToken
      });
    }
    catch (error) {
      console.error('Error al unirse a partida:', error);
      return res.status(500).json({ error: MESSAGES.ERROR_500 });
    }
  }
}