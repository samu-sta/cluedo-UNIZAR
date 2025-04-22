import { Router } from 'express';
import gameController from '../controllers/Game.Controller.js';
import { authMiddleware } from '../middlewares/auth.js';

export const GameRoutes = () => {
  const gameRouter = Router();

  gameRouter.use(authMiddleware);

  gameRouter.post('/create', gameController.createGame);
  gameRouter.post('/join/:gameId', gameController.joinGame);
  gameRouter.post('/random', gameController.findRandomGame);

  return gameRouter;
};