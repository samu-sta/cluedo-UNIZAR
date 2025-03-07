import { Server } from 'socket.io';
import { socketAuthMiddleware } from './middleware.js';
import { setupSocketHandlers } from './handlers.js';

export const configureSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.use(socketAuthMiddleware);

  setupSocketHandlers(io);

  return io;
};