/**
 * @fileoverview Servicio para gestión de turnos de juego
 * Este servicio maneja la lógica de turnos en el juego, controlando
 * qué jugador está activo, permitiendo pasar el turno al siguiente
 * jugador y estableciendo el orden de turnos.
 * @author SAMUEL FELIPE
 */

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
    if (!gameService.hasGame(gameId)) return false;
    
    const game = gameService.getGame(gameId);
    const playerIds = Array.from(game.players.keys());
    
    // Mezclar los IDs para orden aleatorio
    game.turnOrder = shuffleArray(playerIds);
    game.currentTurnIndex = 0;
    game.currentTurnPlayer = game.turnOrder[0];
    
    return true;
  }

  /**
   * Obtiene el ID del jugador que tiene el turno actual
   * @param {string} gameId - ID de la partida
   * @returns {string|null} ID del jugador con el turno actual
   */
  getCurrentTurnPlayer(gameId) {
    if (!gameService.hasGame(gameId)) return null;
    
    const game = gameService.getGame(gameId);
    return game.currentTurnPlayer;
  }

  /**
   * Obtiene el nombre del jugador que tiene el turno actual
   * @param {string} gameId - ID de la partida
   * @returns {string|null} Nombre del jugador con el turno actual
   */
  getCurrentTurnPlayerName(gameId) {
    if (!gameService.hasGame(gameId)) return null;
    
    const game = gameService.getGame(gameId);
    const currentPlayerId = game.currentTurnPlayer;
    
    if (!currentPlayerId || !game.players.has(currentPlayerId)) {
      return null;
    }
    
    return game.players.get(currentPlayerId).username;
  }

  /**
   * Verifica si es el turno de un jugador específico
   * @param {string} gameId - ID de la partida
   * @param {string} playerId - ID del jugador a verificar
   * @returns {boolean} True si es el turno del jugador
   */
  isPlayerTurn(gameId, playerId) {
    if (!gameService.hasGame(gameId)) return false;
    
    const game = gameService.getGame(gameId);
    return game.currentTurnPlayer === playerId;
  }

  /**
   * Avanza al siguiente turno
   * @param {string} gameId - ID de la partida
   * @returns {Object|null} Información del nuevo turno
   */
  nextTurn(gameId) {
    if (!gameService.hasGame(gameId)) {
      return { success: false };
    }
    
    const game = gameService.getGame(gameId);
    
    if (!game.turnOrder || game.turnOrder.length === 0) {
      return { success: false };
    }
    
    // Actualizar índice de turno
    game.currentTurnIndex = (game.currentTurnIndex + 1) % game.turnOrder.length;
    game.currentTurnPlayer = game.turnOrder[game.currentTurnIndex];
    
    // Reiniciar flags de turno
    game.canRollDice = true;
    game.hasMoved = false;
    game.hasSuggested = false;
    
    return {
      success: true,
      playerId: game.currentTurnPlayer,
      playerName: this.getCurrentTurnPlayerName(gameId),
      turnIndex: game.currentTurnIndex,
      totalPlayers: game.turnOrder.length
    };
  }

  /**
   * Obtiene información completa del turno actual
   * @param {string} gameId - ID de la partida
   * @returns {Object|null} Información del turno actual o null si no hay partida
   */
  getCurrentTurn(gameId) {
    const game = gameService.getGame(gameId);
    if (!game || !game.turnOrder || game.turnOrder.length === 0) return null;

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
    if (!gameService.hasGame(gameId)) return;
    
    const game = gameService.getGame(gameId);
    
    if (!game.turnOrder) return;
    
    // Encontrar y eliminar al jugador del orden de turnos
    const playerIndex = game.turnOrder.indexOf(userId);
    if (playerIndex !== -1) {
      game.turnOrder.splice(playerIndex, 1);
      
      // Si no quedan jugadores, terminar
      if (game.turnOrder.length === 0) {
        return;
      }
      
      // Actualizar el índice actual si es necesario
      if (playerIndex <= game.currentTurnIndex) {
        game.currentTurnIndex = Math.max(0, game.currentTurnIndex - 1);
      }
      
      // Si el índice actual es ahora mayor que el número de jugadores, ajustarlo
      if (game.currentTurnIndex >= game.turnOrder.length) {
        game.currentTurnIndex = 0;
      }
      
      // Actualizar el jugador del turno actual
      game.currentTurnPlayer = game.turnOrder[game.currentTurnIndex];
    }
  }

  /**
   * Elimina un jugador del orden de turnos
   * @param {string} gameId - ID de la partida
   * @param {string} playerId - ID del jugador a eliminar
   * @returns {boolean} True si se eliminó correctamente
   */
  removePlayerFromTurnOrder(gameId, playerId) {
    return this.updatePlayerTurnOrder(gameId, playerId);
  }
}

export const turnService = new TurnService();
export default turnService;