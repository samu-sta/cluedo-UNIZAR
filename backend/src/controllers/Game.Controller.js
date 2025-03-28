import MESSAGES from "../messages/messages.js";
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { gameStateManager } from "../socket/handlers.js";
import { getGame } from "../utils/game.js";
class GameController {
  constructor() {

    if (GameController.instance) {
      return GameController.instance;
    }
    this.activeGames = new Map();
    GameController.instance = this;
  }

  deleteGame = (gameId) => {
    this.activeGames.delete(gameId);
  }

  getActiveGames = () => {
    return this.activeGames;
  }

  getGameById = (gameId) => {
    return this.activeGames.get(gameId);
  }

  createGame = async (req, res) => {
    try {
      const user = req.account;
      const gameId = uuidv4();


      this.activeGames.set(gameId, {
        players: [{
          username: user.username,
          id: user.id
        }]
      });
      console.log(Array.from(this.activeGames.keys()));
      console.log('Partida creada:', gameId);

      const socketToken = jwt.sign(
        {
          userId: user.id,
          gameId,
          username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      const gameInfo = await getGame();

      return res.status(201).json({
        success: true,
        gameId,
        gameInfo,
        socketToken
      });
    }
    catch (error) {
      console.error('Error al crear partida:', error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  }

  joinGame = async (req, res) => {
    try {
      const { gameId } = req.params;
      const user = req.account;
      const userId = user.id;
      console.log('Usuario intenta unirse a partida:', gameId);
      console.log(this.activeGames.values());

      if (!this.activeGames.has(gameId)) {
        return res.status(404).json({ success: false, message: "Partida no encontrada" });
      }

      const game = this.activeGames.get(gameId);

      if (gameStateManager.getGameState(gameId) === 'playing') {
        return res.status(403).json({ success: false, message: "La partida ya ha comenzado" });
      }

      const isAlreadyInGame = game.players.some(player => player.id === userId);

      if (!isAlreadyInGame) {
        game.players.push({
          username: user.username,
          id: userId
        });
      }
      console.log(game.players);

      this.activeGames.set(gameId, game);

      const socketToken = jwt.sign(
        {
          userId,
          gameId,
          username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      const gameInfo = await getGame();

      return res.status(200).json({
        success: true,
        gameId,
        gameInfo,
        socketToken
      });
    }
    catch (error) {
      console.error('Error al unirse a partida:', error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  }
}

const gameController = new GameController();
export default gameController;