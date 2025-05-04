/*************************************************
 * Manejadores de eventos de WebSocket
 * 
 * Define los controladores para los diferentes eventos
 * de WebSocket, gestionando la interacción en tiempo
 * real entre clientes y servidor.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import { handlePlayerConnection, handlePlayerLeave, handleRequestCards, handlePlayerReady } from './handlers/playerHandlers.js';
import { handlePassTurn, handleRollDice, handleMovePlayer } from './handlers/turnHandlers.js';
import { handleMakeAccusation, handleMakeSuggestion, handleShowCard } from './handlers/suggestionHandlers.js';

import { gameStateManager } from './GameStateManager.js';
import CountdownManager from './CountdownManager.js';
import { GAME_STATES, SOCKET_EVENTS, GAME_CONFIG } from '../config/constants.js';

/**
 * Configura los manejadores de eventos de socket para el juego
 * @param {Object} io - Instancia del servidor socket.io
 */
export const setupSocketHandlers = (io) => {
  const countdownManager = new CountdownManager(io, gameStateManager);

  io.on(SOCKET_EVENTS.CONNECT, async (socket) => {
    const { gameId, userId, username } = socket;

    if (gameStateManager.getGameState(gameId) === GAME_STATES.PLAYING) {
      socket.disconnect();
      return;
    }

    const isNewPlayer = await handlePlayerConnection(gameStateManager, socket, io, gameId, userId, username);

    if (gameStateManager.getPlayerCount(gameId) >= GAME_CONFIG.MIN_PLAYERS_TO_START) {
      countdownManager.startCountdown(gameId);
    }

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      handlePlayerLeave(gameStateManager, countdownManager, socket, io, gameId, userId, username);
    });

    socket.on(SOCKET_EVENTS.REQUEST_CARDS, () => {
      handleRequestCards(gameStateManager, socket, gameId, userId);
    });

    socket.on(SOCKET_EVENTS.PLAYER_READY, () => {
      if (gameStateManager.getGameState(gameId) !== GAME_STATES.WAITING) {
        return;
      }
      handlePlayerReady(gameStateManager, countdownManager, gameId);
    });

    socket.on(SOCKET_EVENTS.PASS_TURN, () => {
      handlePassTurn(gameStateManager, socket, io, gameId, userId);
    });

    socket.on(SOCKET_EVENTS.ROLL_DICE, () => {
      handleRollDice(gameStateManager, socket, io, gameId, userId);
    });

    socket.on(SOCKET_EVENTS.MOVE_PLAYER, (targetPosition) => {
      handleMovePlayer(gameStateManager, socket, io, gameId, userId, targetPosition);
    });

    socket.on(SOCKET_EVENTS.MAKE_ACCUSATION, (accusation) => {
      handleMakeAccusation(gameStateManager, socket, io, gameId, userId, username, accusation);
    });

    socket.on(SOCKET_EVENTS.MAKE_SUGGESTION, (suggestion) => {
      handleMakeSuggestion(gameStateManager, socket, io, gameId, userId, username, suggestion);
    });

    socket.on(SOCKET_EVENTS.SHOW_CARD, (card) => {
      handleShowCard(gameStateManager, socket, io, gameId, userId, username, card);
    });
  });
};