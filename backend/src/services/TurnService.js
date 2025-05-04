/*************************************************
 * Servicio de gestión de turnos
 * 
 * Controla el flujo de turnos entre jugadores,
 * determinando quién tiene el turno actual y
 * gestionando el cambio de turnos.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import { gameService } from './GameService.js';
import { shuffleArray } from '../utils/arrayUtils.js';

/**
 * Servicio para gestionar los turnos de los jugadores
 */
class TurnService {
  /**
   * Configura el orden de los turnos para una partida
   * @param {string} gameId - ID de la partida
   */
  setupPlayerTurns(gameId) {
    const game = gameService.getGame(gameId);
    if (!game) return;

    const playerIds = [...game.players.keys()];
    const shuffledPlayerIds = shuffleArray(playerIds);

    game.turnOrder = shuffledPlayerIds;
    game.currentTurnIndex = 0;
    game.currentTurnPlayer = shuffledPlayerIds[0];
  }

  /**
   * Obtiene el ID del jugador que tiene el turno actual
   * @param {string} gameId - ID de la partida
   * @returns {string|null} ID del jugador con el turno actual
   */
  getCurrentTurnPlayer(gameId) {
    const game = gameService.getGame(gameId);
    if (!game || !game.turnOrder || game.turnOrder.length === 0) return null;
    return game.currentTurnPlayer;
  }

  /**
   * Obtiene el nombre del jugador que tiene el turno actual
   * @param {string} gameId - ID de la partida
   * @returns {string|null} Nombre del jugador con el turno actual
   */
  getCurrentTurnPlayerName(gameId) {
    const game = gameService.getGame(gameId);
    if (!game || !game.currentTurnPlayer) return null;

    const player = game.players.get(game.currentTurnPlayer);
    return player ? player.username : null;
  }

  /**
   * Verifica si es el turno de un jugador específico
   * @param {string} gameId - ID de la partida
   * @param {string} playerId - ID del jugador a verificar
   * @returns {boolean} True si es el turno del jugador
   */
  isPlayerTurn(gameId, playerId) {
    return this.getCurrentTurnPlayer(gameId) === playerId;
  }

  /**
   * Avanza al siguiente turno
   * @param {string} gameId - ID de la partida
   * @returns {Object|null} Información del nuevo turno
   */
  nextTurn(gameId) {
    const game = gameService.getGame(gameId);
    if (!game || !game.turnOrder || game.turnOrder.length === 0) return null;

    game.currentTurnIndex = (game.currentTurnIndex + 1) % game.turnOrder.length;
    game.currentTurnPlayer = game.turnOrder[game.currentTurnIndex];

    game.canRollDice = true;
    game.hasMoved = false;
    game.hasSuggested = false;

    return {
      playerId: game.currentTurnPlayer,
      playerName: this.getCurrentTurnPlayerName(gameId),
      turnIndex: game.currentTurnIndex,
      totalPlayers: game.turnOrder.length
    };
  }

  /**
   * Actualiza el orden de turnos cuando un jugador abandona la partida
   * @param {string} gameId - ID de la partida
   * @param {string} userId - ID del jugador que abandona
   * @returns {boolean} True si se actualizó correctamente
   */
  updatePlayerTurnOrder(gameId, userId) {
    const game = gameService.getGame(gameId);
    if (!game || !game.turnOrder || game.turnOrder.length === 0) return false;

    const playerIndex = game.turnOrder.indexOf(userId);
    if (playerIndex === -1) return false;

    game.turnOrder.splice(playerIndex, 1);

    if (game.turnOrder.length === 0) {
      game.currentTurnIndex = -1;
      game.currentTurnPlayer = null;
      return true;
    }

    if (playerIndex <= game.currentTurnIndex) {
      game.currentTurnIndex = game.currentTurnIndex > 0 ? game.currentTurnIndex - 1 : 0;
    }

    if (game.currentTurnPlayer === userId) {
      game.currentTurnPlayer = game.turnOrder[game.currentTurnIndex];
    }

    return true;
  }
}

export const turnService = new TurnService();