/*************************************************
 * Manejadores de eventos de turnos
 * 
 * Contiene los controladores específicos para eventos
 * relacionados con turnos de juego, incluyendo movimiento
 * de jugadores, lanzamiento de dados y cambio de turnos.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import { SOCKET_EVENTS, GAME_STATES } from '../../config/constants.js';
import MESSAGES from '../../messages/messages.js';
import { validateGameAction } from './utils.js';

/**
 * Maneja cuando un jugador pasa su turno
 */
export const handlePassTurn = (gameStateManager, socket, io, gameId, userId) => {
  if (!validateGameAction(gameStateManager, socket, gameId, userId)) {
    return;
  }

  const currentTurn = gameStateManager.nextTurn(gameId);

  if (currentTurn) {
    io.to(gameId).emit(SOCKET_EVENTS.TURN_UPDATE, { currentTurn });
  }
};

/**
 * Maneja cuando un jugador tira los dados
 */
export const handleRollDice = (gameStateManager, socket, io, gameId, userId) => {
  if (!validateGameAction(gameStateManager, socket, gameId, userId)) {
    return;
  }

  if (!gameStateManager.getCanRollDice(gameId)) {
    socket.emit(SOCKET_EVENTS.ERROR, MESSAGES.DICE_ALREADY_ROLLED);
    return;
  }

  const { diceResult1, diceResult2 } = gameStateManager.rollDice(gameId);
  const validMoves = gameStateManager.getValidMoves(gameId, userId);

  io.to(gameId).emit(SOCKET_EVENTS.DICE_ROLLED, {
    diceResult: [diceResult1, diceResult2],
    validMoves
  });
};

/**
 * Maneja cuando un jugador se mueve en el tablero
 */
export const handleMovePlayer = (gameStateManager, socket, io, gameId, userId, targetPosition) => {
  if (!validateGameAction(gameStateManager, socket, gameId, userId)) {
    return;
  }

  const result = gameStateManager.movePlayer(gameId, userId, targetPosition);

  if (!result.success) {
    socket.emit(SOCKET_EVENTS.ERROR, result.message);
    return;
  }

  const players = gameStateManager.getPlayers(gameId);
  io.to(gameId).emit(SOCKET_EVENTS.PLAYERS_MOVED, {
    players,
    movedPlayer: userId,
    path: result.path
  });

  socket.emit(SOCKET_EVENTS.MOVE_SUCCESS);
};