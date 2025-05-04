/**
 * @fileoverview Utilidades para los manejadores de Socket.IO
 * Este archivo proporciona funciones auxiliares para validar
 * acciones de juego y gestionar la finalización de partidas
 * utilizadas por los diversos manejadores de eventos.
 * @author SAMUEL FELIPE
 */

import { GAME_STATES, SOCKET_EVENTS } from '../../config/constants.js';
import MESSAGES from '../../messages/messages.js';

/**
 * Valida si una acción del juego puede ser realizada por un jugador
 * @param {Object} gameStateManager - Manager del estado del juego
 * @param {Object} socket - Socket del jugador
 * @param {string} gameId - ID del juego
 * @param {string} userId - ID del usuario
 * @returns {boolean} Indica si la acción es válida
 */
export const validateGameAction = (gameStateManager, socket, gameId, userId) => {
  if (gameStateManager.getGameState(gameId) !== GAME_STATES.PLAYING) {
    socket.emit(SOCKET_EVENTS.ERROR, MESSAGES.GAME_NOT_IN_PROGRESS);
    return false;
  }

  if (!gameStateManager.isPlayerTurn(gameId, userId)) {
    socket.emit(SOCKET_EVENTS.ERROR, MESSAGES.NOT_YOUR_TURN);
    return false;
  }

  return true;
};

/**
 * Finaliza un juego y notifica a todos los jugadores
 * @param {Object} gameStateManager - Manager del estado del juego
 * @param {Object} io - Instancia del servidor socket.io
 * @param {string} gameId - ID del juego
 * @param {string} reason - Razón por la que finalizó el juego
 * @param {string} winner - Nombre del ganador
 * @param {Object} solution - Solución del caso
 */
export const endGame = (gameStateManager, io, gameId, reason, winner, solution = null) => {
  gameStateManager.setGameState(gameId, GAME_STATES.ENDED);
  io.to(gameId).emit(SOCKET_EVENTS.GAME_END, { reason, winner, solution });
};