import { Router } from 'express';
import GameController from '../controllers/Game.Controller.js';
import { authMiddleware } from '../middlewares/auth.js';

export const GameRoutes = () => {
  const gameRouter = Router();
  const gameController = new GameController();

  gameRouter.use(authMiddleware);

  gameRouter.post('/create', gameController.createGame);
  gameRouter.post('/join/:gameId', gameController.joinGame);

  return gameRouter;
};