import { activeGames } from "../controllers/Game.Controller.js";

export const setupSocketHandlers = (io) => {
  const roomPlayers = new Map();

  io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.username} (${socket.userId})`);

    socket.join(socket.gameId);

    if (!roomPlayers.has(socket.gameId)) {
      roomPlayers.set(socket.gameId, new Map());
    }

    const gamePlayerMap = roomPlayers.get(socket.gameId);

    if (gamePlayerMap.has(socket.userId)) {
      return;
    }

    gamePlayerMap.set(socket.userId, {
      username: socket.username
    });

    const players = Array.from(gamePlayerMap.values());

    io.to(socket.gameId).emit('playerJoined', {
      username: socket.username
    });

    socket.emit('playerList', { players });

    socket.on('disconnect', () => {
      console.log(`Usuario desconectado: ${socket.username}`);

      if (roomPlayers.has(socket.gameId)) {
        const gamePlayerMap = roomPlayers.get(socket.gameId);
        gamePlayerMap.delete(socket.userId);

        if (gamePlayerMap.size === 0) {
          roomPlayers.delete(socket.gameId);
          activeGames.delete(socket.gameId);
        }
      }

      io.to(socket.gameId).emit('playerLeft', {
        username: socket.username
      });
    });
  });
};