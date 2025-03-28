import gameController from '../controllers/Game.Controller.js';
import GameStateManager from './GameStateManager.js';
import CountdownManager from './CountdownManager.js';

export const gameStateManager = new GameStateManager();

export const setupSocketHandlers = (io) => {
  const countdownManager = new CountdownManager(io, gameStateManager);

  io.on('connection', async (socket) => {
    const { gameId, userId, username } = socket;

    if (gameStateManager.getGameState(gameId) === 'playing') {
      console.log(`Usuario intentó unirse a partida en progreso: ${username} (${userId})`);
      socket.disconnect();
      return;
    }

    console.log(`Usuario conectado: ${username} (${userId})`);

    socket.join(gameId);

    const isNewPlayer = await gameStateManager.addPlayer(gameId, userId, { username });

    if (!isNewPlayer) return;

    socket.emit('playerList', {
      players: gameStateManager.getPlayers(gameId)
    });

    socket.to(gameId).emit('playerJoined', { username });
    console.log(`Jugadores en partida ${gameId}:`, gameStateManager.getPlayers(gameId));

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

    socket.on('requestCards', () => {
      if (gameStateManager.getGameState(gameId) !== 'playing') {
        socket.emit('error', 'El juego no ha comenzado');
        return;
      }

      const cards = gameStateManager.getPlayerCards(gameId, userId);
      const leftoverCards = gameStateManager.getLeftoverCards(gameId);
      socket.emit('playerCards', { cards, leftoverCards });
    });

    socket.on('playerReady', () => {
      if (gameStateManager.getGameState(gameId) !== 'waiting') {
        return;
      }


      if (gameStateManager.getPlayerCount(gameId) >= 2) {
        countdownManager.startCountdown(gameId);
      }
    });

    socket.on('passTurn', () => {
      if (gameStateManager.getGameState(gameId) !== 'playing') {
        socket.emit('error', 'El juego no está en curso');
        return;
      }

      if (!gameStateManager.isPlayerTurn(gameId, userId)) {
        socket.emit('error', 'No es tu turno');
        return;
      }

      const currentTurn = gameStateManager.nextTurn(gameId);
      console.log('Siguiente turno:', currentTurn);
      if (currentTurn) {
        io.to(gameId).emit('turnUpdate', { currentTurn });
      }
    });

    socket.on('rollDice', () => {
      if (gameStateManager.getGameState(gameId) !== 'playing') {
        socket.emit('error', 'El juego no está en curso');
        return;
      }

      if (!gameStateManager.isPlayerTurn(gameId, userId)) {
        socket.emit('error', 'No es tu turno');
        return;
      }

      if (!gameStateManager.getCanRollDice(gameId)) {
        socket.emit('error', 'Ya lanzaste los dados');
        return;
      }

      const { diceResult1, diceResult2 } = gameStateManager.rollDice(gameId);
      const validMoves = gameStateManager.getValidMoves(gameId, userId);
      console.log(validMoves);
      io.to(gameId).emit('diceRolled', { diceResult: [diceResult1, diceResult2], validMoves });
    });

    socket.on('movePlayer', (targetPosition) => {
      if (gameStateManager.getGameState(gameId) !== 'playing') {
        socket.emit('error', 'El juego no está en curso');
        return;
      }

      if (!gameStateManager.isPlayerTurn(gameId, userId)) {
        socket.emit('error', 'No es tu turno');
        return;
      }

      console.log('Validando movimiento:', targetPosition);

      // Procesar el movimiento
      const result = gameStateManager.movePlayer(gameId, userId, targetPosition);

      if (!result.success) {
        socket.emit('error', result.message);
        return;
      }

      // Notificar a todos los jugadores del movimiento
      const players = gameStateManager.getPlayers(gameId);
      io.to(gameId).emit('playersMoved', {
        players,
        movedPlayer: userId,
        path: result.path
      });

      // Si el movimiento fue exitoso, enviar un mensaje de éxito
      socket.emit('moveSuccess');
    });

  });
};