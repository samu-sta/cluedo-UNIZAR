/*************************************************
 * Enrutamiento de Usuarios
 * 
 * Define las rutas para la gestión de usuarios,
 * incluyendo registro, inicio de sesión,
 * cierre de sesión y cambio de contraseña.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/
import { Router } from 'express';
import UserController from '../controllers/User.Controller.js';

export const UserRoutes = () => {
  const userRouter = Router();
  const userController = new UserController();

  userRouter.post('/register', userController.register);
  userRouter.post('/login', userController.login);
  userRouter.post('/logout', userController.logout);
  userRouter.post('/change-password', userController.changePassword);

  return userRouter;
}
