import express from 'express';
import gameController from '../controllers/Game.Controller.js';
import { authMiddleware } from '../middlewares/auth.js';

export const GameRoutes = () => {
  const router = express.Router();

  /**
   * @route POST /api/game
   * @desc Crear una nueva partida
   * @access Private (requiere autenticación)
   */
  router.post('/', authMiddleware, gameController.createGame);

  /**
   * @route POST /api/game/:gameId/join
   * @desc Unirse a una partida existente
   * @access Private (requiere autenticación)
   */
  router.post('/:gameId/join', authMiddleware, gameController.joinGame);

  /**
   * @route GET /api/game/random
   * @desc Buscar una partida disponible para unirse
   * @access Private (requiere autenticación)
   */
  router.get('/random', authMiddleware, gameController.findRandomGame);

  return router;
};