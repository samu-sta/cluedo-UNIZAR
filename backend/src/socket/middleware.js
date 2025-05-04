/*************************************************
 * Middleware de autenticación para WebSocket
 * 
 * Verifica la validez de los tokens y credenciales de
 * los usuarios que se conectan mediante WebSockets,
 * asegurando conexiones autorizadas al juego.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

export const socketAuthMiddleware = (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    socket.gameId = decoded.gameId;
    socket.username = decoded.username;
    next();
  }
  catch (err) {
    console.error('Socket authentication error:', err);
    next(new Error('Authentication error'));
  }
};