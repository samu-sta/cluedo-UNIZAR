import { GAME_STATES, SOCKET_EVENTS } from '../../config/constants.js';
import MESSAGES from '../../messages/messages.js';

/**
 * Maneja la conexión de un nuevo jugador al juego
 */
export const handlePlayerConnection = async (gameStateManager, socket, io, gameId, userId, username) => {

  socket.join(gameId);

  const isNewPlayer = await gameStateManager.addPlayer(gameId, userId, { username });

  socket.emit(SOCKET_EVENTS.PLAYER_LIST, {
    players: gameStateManager.getPlayers(gameId)
  });

  if (isNewPlayer) {
    socket.to(gameId).emit(SOCKET_EVENTS.PLAYER_JOINED, { username });
  }

  return isNewPlayer;
};

/**
 * Maneja cuando un jugador sale del juego
 */
export const handlePlayerLeave = (gameStateManager, countdownManager, socket, io, gameId, userId, username) => {
  if (gameStateManager.getGameState(gameId) === GAME_STATES.PLAYING) {
    const result = gameStateManager.handlePlayerLeaveInGame(gameId, userId);

    if (!result.success) return;

    result.nextTurn && io.to(gameId).emit(SOCKET_EVENTS.TURN_UPDATE, { currentTurn: result.nextTurn });

    if (result.shouldEndGame) {
      gameStateManager.setGameState(gameId, GAME_STATES.ENDED);

      const endReason = result.remainingPlayers.length === 0
        ? MESSAGES.ALL_PLAYERS_LEFT
        : `${username} ${MESSAGES.PLAYER_LEFT_ONE_REMAINING}`;

      io.to(gameId).emit(SOCKET_EVENTS.GAME_END, { reason: endReason, winner: result.winner });
      return;
    }

    io.to(gameId).emit(SOCKET_EVENTS.PLAYER_LEFT, { username });
    return;
  }

  if (!gameStateManager.removePlayer(gameId, userId)) return;

  io.to(gameId).emit(SOCKET_EVENTS.PLAYER_LEFT, { username });

  const playerCount = gameStateManager.getPlayerCount(gameId);
  playerCount < 2 && countdownManager.cancelCountdown(gameId);
  playerCount === 0 && gameStateManager.deleteGame(gameId);
};

/**
 * Maneja cuando un jugador solicita sus cartas
 */
export const handleRequestCards = (gameStateManager, socket, gameId, userId) => {
  if (gameStateManager.getGameState(gameId) !== GAME_STATES.PLAYING) {
    socket.emit(SOCKET_EVENTS.ERROR, MESSAGES.GAME_NOT_STARTED);
    return;
  }

  const cards = gameStateManager.getPlayerCards(gameId, userId);
  const leftoverCards = gameStateManager.getLeftoverCards(gameId);
  socket.emit(SOCKET_EVENTS.PLAYER_CARDS, { cards, leftoverCards });
};

/**
 * Maneja cuando un jugador está listo para jugar
 */
export const handlePlayerReady = (gameStateManager, countdownManager, gameId) => {
  if (gameStateManager.getPlayerCount(gameId) >= 2) {
    countdownManager.startCountdown(gameId);
  }
};