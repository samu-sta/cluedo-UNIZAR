import MESSAGES from "../messages/messages.js";
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export default class GameController {
  constructor({ userModel }) {
    this.userModel = userModel;
    // Almacén temporal para partidas activas
    this.activeGames = new Map();
  }

  // Endpoint para crear una partida
  createGame = async (req, res) => {
    try {
      const userId = req.userId;

      // Obtener datos del usuario
      const user = await this.userModel.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          error: MESSAGES.USER_NOT_FOUND
        });
      }

      // Crear ID único para la partida
      const gameId = uuidv4();

      // Crear nueva partida
      this.activeGames.set(gameId, {
        players: [{
          username: user.username
        }]
      });

      // Generar token específico para el socket con gameId incluido
      const socketToken = jwt.sign(
        {
          userId,
          gameId,
          username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Devolver ID y token para conexión socket
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

      // Verificar que el juego existe
      if (!this.activeGames.has(gameId)) {
        return res.status(404).json({ error: "Partida no encontrada" });
      }

      const game = this.activeGames.get(gameId);

      // Obtener datos del usuario
      const user = await this.userModel.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: MESSAGES.USER_NOT_FOUND });
      }

      // Verificar si ya está en la partida
      const isAlreadyInGame = game.players.some(player => player.id === userId);

      if (!isAlreadyInGame) {
        // Agregar usuario a la partida
        game.players.push({
          username: user.username
        });
      }

      // Actualizar la partida
      this.activeGames.set(gameId, game);

      // Generar token específico para el socket con gameId incluido
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