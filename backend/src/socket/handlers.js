import gameController from '../controllers/Game.Controller.js';
import GameStateManager from './GameStateManager.js';
import CountdownManager from './CountdownManager.js';

export const gameStateManager = new GameStateManager();

export const setupSocketHandlers = (io) => {
  const countdownManager = new CountdownManager(io, gameStateManager);

  io.on('connection', (socket) => {
    const { gameId, userId, username } = socket;

    if (gameStateManager.getGameState(gameId) === 'playing') {
      console.log(`Usuario intentó unirse a partida en progreso: ${username} (${userId})`);
      socket.disconnect();
      return;
    }

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

      if (gameStateManager.getGameState(gameId) === 'playing') {
        gameStateManager.removeGame(gameId);
        io.to(gameId).emit('gameEnd', { reason: 'Jugador desconectado' });
        return;
      }

      if (gameStateManager.getPlayerCount(gameId) < 2) {
        countdownManager.cancelCountdown(gameId);
      }

      if (gameStateManager.getPlayerCount(gameId) === 0) {
        gameController.deleteGame(gameId);
      }
    });

    // Manejador para cuando un jugador solicita sus cartas
    socket.on('requestCards', () => {
      if (gameStateManager.getGameState(gameId) !== 'playing') {
        socket.emit('error', 'El juego no ha comenzado');
        return;
      }

      const cards = gameStateManager.getPlayerCards(gameId, userId);
      socket.emit('playerCards', { cards });
    });

    // Manejador para iniciar el juego (para pruebas o cuando el anfitrión decide comenzar)
    socket.on('playerReady', () => {
      if (gameStateManager.getGameState(gameId) !== 'waiting') {
        return;
      }


      if (gameStateManager.getPlayerCount(gameId) >= 2) {
        countdownManager.startCountdown(gameId);
      }
    });
  });
};