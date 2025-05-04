/*************************************************
 * Socket Handlers para el juego de Cluedo
 * 
 * Este módulo maneja las acciones de los jugadores
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/
import { GAME_STATES, SOCKET_EVENTS } from '../../config/constants.js';
import MESSAGES from '../../messages/messages.js';
import { validateGameAction, endGame } from './utils.js';

/**
 * Maneja cuando un jugador hace una acusación
 */
export const handleMakeAccusation = (gameStateManager, socket, io, gameId, userId, username, accusation) => {
  if (!validateGameAction(gameStateManager, socket, gameId, userId)) {
    return;
  }

  const result = gameStateManager.makeAccusation(gameId, userId, accusation);

  if (!result.success) {
    socket.emit(SOCKET_EVENTS.ERROR, result.message);
    return;
  }

  if (result.isCorrect) {
    handleCorrectAccusation(gameStateManager, io, gameId, username, result);
  } else {
    handleIncorrectAccusation(gameStateManager, socket, io, gameId, username, result);
  }
};

/**
 * Maneja una acusación correcta
 */
const handleCorrectAccusation = (gameStateManager, io, gameId, username, result) => {
  endGame(
    gameStateManager,
    io,
    gameId,
    `${username} ${MESSAGES.SOLVED_CASE_CORRECTLY}`,
    username,
    result.solution
  );
};

/**
 * Maneja una acusación incorrecta
 */
const handleIncorrectAccusation = (gameStateManager, socket, io, gameId, username, result) => {
  socket.emit(SOCKET_EVENTS.INCORRECT_ACCUSATION, {
    message: MESSAGES.INCORRECT_ACCUSATION
  });

  if (result.shouldEndGame) {
    gameStateManager.setGameState(gameId, GAME_STATES.ENDED);

    socket.to(gameId).emit(SOCKET_EVENTS.GAME_END, {
      reason: `${username} ${MESSAGES.LAST_PLAYER_ELIMINATED}`,
      winner: result.winner,
      solution: result.solution
    });
    return;
  }

  const nextTurn = gameStateManager.nextTurn(gameId);
  nextTurn && io.to(gameId).emit(SOCKET_EVENTS.TURN_UPDATE, { currentTurn: nextTurn });
};

/**
 * Maneja cuando un jugador hace una sugerencia
 */
export const handleMakeSuggestion = (gameStateManager, socket, io, gameId, userId, username, suggestion) => {
  if (gameStateManager.getGameState(gameId) !== GAME_STATES.PLAYING) {
    socket.emit(SOCKET_EVENTS.ERROR, MESSAGES.GAME_NOT_IN_PROGRESS);
    return;
  }

  const validationResult = gameStateManager.validateSuggestion(gameId, userId, suggestion);

  if (!validationResult.valid) {
    socket.emit(SOCKET_EVENTS.ERROR, validationResult.message);
    return;
  }

  suggestion.username = username;

  gameStateManager.setCurrentSuggestion(gameId, suggestion);

  const game = gameStateManager.getGame(gameId);
  game.hasSuggested = true;

  socket.emit(SOCKET_EVENTS.SUGGESTION_MADE);

  socket.to(gameId).emit(SOCKET_EVENTS.CURRENT_SUGGESTION, {
    suggestion
  });
};

/**
 * Maneja cuando un jugador muestra una carta
 */
export const handleShowCard = (gameStateManager, socket, io, gameId, userId, username, card) => {
  if (gameStateManager.getGameState(gameId) !== GAME_STATES.PLAYING) {
    socket.emit(SOCKET_EVENTS.ERROR, MESSAGES.GAME_NOT_IN_PROGRESS);
    return;
  }

  const result = gameStateManager.showCard(gameId, userId, card);

  if (!result.success) {
    socket.emit(SOCKET_EVENTS.ERROR, result.message);
    return;
  }

  const suggestionMakerUsername = result.suggestionMaker;

  const sockets = Array.from(io.sockets.sockets).map(s => s[1]);
  const suggestionMakerSocket = sockets.find(
    s => s.username === suggestionMakerUsername
  );

  if (!suggestionMakerSocket) {
    socket.emit(SOCKET_EVENTS.ERROR, MESSAGES.SUGGESTION_PLAYER_NOT_FOUND);
    return;
  }

  io.to(suggestionMakerSocket.id).emit(SOCKET_EVENTS.CARD_SHOWN, {
    username,
    card: result.cardShown
  });
};