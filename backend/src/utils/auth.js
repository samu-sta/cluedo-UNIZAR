/*************************************************
 * Utilidades de autenticación
 * 
 * Funciones para la gestión de tokens JWT, incluyendo
 * creación, verificación y generación de tokens para
 * conexiones de socket.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = 86400;  // 24 hours

const createToken = (user) => {
  return jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRATION
  });
}

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Token verification failed:', error.message);
    throw new Error('Invalid token');
  }
}

const generateSocketToken = (user, gameId) => {
  return jwt.sign(
    {
      userId: user.id,
      gameId,
      username: user.username
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

const auth = {
  createToken,
  verifyToken,
  generateSocketToken
}

export default auth;