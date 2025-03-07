import jwt from 'jsonwebtoken';

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