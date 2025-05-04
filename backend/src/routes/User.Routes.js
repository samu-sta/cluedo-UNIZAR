import express from 'express';
import UserController from '../controllers/User.Controller.js';
import { authMiddleware } from '../middlewares/auth.js';

export const UserRoutes = () => {
  const router = express.Router();
  const userController = new UserController();

<<<<<<< HEAD
  /**
   * @route POST /api/user/register
   * @desc Registrar nuevo usuario
   * @access Public
   */
  router.post('/register', userController.register);
=======
  userRouter.post('/register', userController.register);
  userRouter.post('/login', userController.login);
  userRouter.post('/logout', userController.logout);
>>>>>>> 835393ab0392a70e64ef3a7fb12bb762306382d0

  /**
   * @route POST /api/user/login
   * @desc Login de usuario
   * @access Public
   */
  router.post('/login', userController.login);

  /**
   * @route GET /api/user/logout
   * @desc Cerrar sesión
   * @access Private
   */
  router.get('/logout', userController.logout);

  /**
   * @route POST /api/user/change-password
   * @desc Cambiar contraseña
   * @access Private
   */
  router.post('/change-password', authMiddleware, userController.changePassword);

  return router;
};
