import { Router } from 'express';
import UserController from '../controllers/User.Controller.js';

export const UserRoutes = () => {
  const userRouter = Router();
  const userController = new UserController();

  userRouter.post('/register', userController.register);
  userRouter.post('/login', userController.login);
  userRouter.post('/logout', userController.logout);

  return userRouter;
}
