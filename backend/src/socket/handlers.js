import { activeGames } from "../controllers/Game.Controller.js";

const COUNT_DOWN_TIME = 10;

export const setupSocketHandlers = (io) => {
  const roomPlayers = new Map();
  const gameTimers = new Map();
  const gameCounts = new Map();

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

    if (gamePlayerMap.size >= 2 && !gameTimers.has(socket.gameId)) {
      startCountdown(socket.gameId);
    }

    socket.on('disconnect', () => {
      console.log(`Usuario desconectado: ${socket.username}`);

      if (roomPlayers.has(socket.gameId)) {
        const gamePlayerMap = roomPlayers.get(socket.gameId);
        gamePlayerMap.delete(socket.userId);

        if (gamePlayerMap.size < 2) {
          clearCountdown(socket.gameId);
          io.to(socket.gameId).emit('countdownCancelled');
        }

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

  function startCountdown(gameId) {

    gameCounts.set(gameId, COUNT_DOWN_TIME);

    const timerId = setInterval(() => {
      let currentCount = gameCounts.get(gameId);
      currentCount -= 1;
      gameCounts.set(gameId, currentCount);

      io.to(gameId).emit('countdownUpdate', { seconds: currentCount });

      if (currentCount === 0) {
        clearInterval(timerId);
        gameTimers.delete(gameId);
        gameCounts.delete(gameId);

        io.to(gameId).emit('gameStart');
      }
    }, 1000);

    gameTimers.set(gameId, timerId);
  }

  function clearCountdown(gameId) {
    if (gameTimers.has(gameId)) {
      clearInterval(gameTimers.get(gameId));
      gameTimers.delete(gameId);
    }
    gameCounts.delete(gameId);
  }
};