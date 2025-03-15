import { activeGames } from "../controllers/Game.Controller.js";
import GameStateManager from './GameStateManager.js';
import CountdownManager from './CountdownManager.js';

export const setupSocketHandlers = (io) => {
  const gameStateManager = new GameStateManager();
  const countdownManager = new CountdownManager(io, gameStateManager);

  io.on('connection', (socket) => {
    const { gameId, userId, username } = socket;

    console.log(`Usuario conectado: ${username} (${userId})`);

    socket.join(gameId);

    const isNewPlayer = gameStateManager.addPlayer(gameId, userId, { username });

    if (!isNewPlayer) return;

    socket.emit('playerList', {
      players: gameStateManager.getPlayers(gameId)
    });

    socket.to(gameId).emit('playerJoined', { username });

    if (gameStateManager.getPlayerCount(gameId) >= 2) {
      countdownManager.startCountdown(gameId);
    }

    socket.on('disconnect', () => {
      console.log(`Usuario desconectado: ${username}`);

      if (!gameStateManager.removePlayer(gameId, userId)) return;

      io.to(gameId).emit('playerLeft', { username });

      if (gameStateManager.getPlayerCount(gameId) < 2) {
        countdownManager.cancelCountdown(gameId);
      }

      if (gameStateManager.getPlayerCount(gameId) === 0) {
        activeGames.delete(gameId);
      }
    });
  });
};