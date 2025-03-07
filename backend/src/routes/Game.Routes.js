import { Router } from 'express';
import GameController from '../controllers/Game.Controller.js';
import { authMiddleware } from '../middlewares/auth.js';

export const GameRoutes = ({ userModel }) => {
  const gameRouter = Router();
  const gameController = new GameController({ userModel });

  // Aplicar middleware de autenticación a todas las rutas
  gameRouter.use(authMiddleware);

  // Rutas para partidas
  gameRouter.post('/create', gameController.createGame);
  gameRouter.post('/join/:gameId', gameController.joinGame);

  return gameRouter;
};