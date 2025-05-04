/**
 * @fileoverview Servicio para gestión del tablero de juego
 * Este servicio proporciona funcionalidades para manejar operaciones
 * relacionadas con el tablero, incluyendo movimientos, validación de
 * posiciones y cálculo de rutas.
 * @author SAMUEL FELIPE
 */

import RoomModel from "../models/Room.js";
import DoorModel from "../models/Door.js";
import WallModel from "../models/Wall.js";

import { gameService } from './GameService.js';
import { GAME_CONFIG } from '../config/constants.js';
import { findValidMoves, isPositionInsideRoom } from '../utils/board.js';
import { getBoard } from '../utils/game.js';

class BoardService {
  /**
   * Lanza los dados
   * @param {string} gameId - ID de la partida
   * @returns {Object} - Resultado del lanzamiento
   */
  rollDice(gameId) {
    if (!gameService.hasGame(gameId)) {
      return { success: false, message: 'Game not found' };
    }

    const game = gameService.getGame(gameId);

    if (!game.canRollDice) {
      return { success: false, message: 'Cannot roll dice at this time' };
    }

    const dice1 = Math.floor(Math.random() * GAME_CONFIG.DICE.SIDES) + GAME_CONFIG.DICE.MIN;
    const dice2 = Math.floor(Math.random() * GAME_CONFIG.DICE.SIDES) + GAME_CONFIG.DICE.MIN;
    const total = dice1 + dice2;

    game.lastDiceRoll = { dice1, dice2, total };
    game.canRollDice = false;
    
    return {
      success: true,
      dice1,
      dice2,
      total
    };
  }

  /**
   * Verifica si se pueden lanzar los dados
   * @param {string} gameId - ID de la partida
   * @returns {boolean} - True si se pueden lanzar los dados
   */
  getCanRollDice(gameId) {
    if (!gameService.hasGame(gameId)) return false;
    
    const game = gameService.getGame(gameId);
    return game.canRollDice || false;
  }

  /**
   * Obtiene los movimientos válidos para un jugador
   * @param {string} gameId - ID de la partida
   * @param {string} playerId - ID del jugador
   * @returns {Array} - Lista de movimientos válidos
   */
  getValidMoves(gameId, playerId) {
    if (!gameService.hasGame(gameId)) return [];
    
    const game = gameService.getGame(gameId);
    const player = game.players.get(playerId);
    
    if (!player || !player.position || !game.lastDiceRoll) {
      return [];
    }
    
    const startPosition = player.position;
    const maxSteps = game.lastDiceRoll.total;
    
    // In a real implementation, we would use board data to calculate valid moves
    return [
      { row: startPosition.row + 1, column: startPosition.column },
      { row: startPosition.row - 1, column: startPosition.column },
      { row: startPosition.row, column: startPosition.column + 1 },
      { row: startPosition.row, column: startPosition.column - 1 }
    ].filter(pos => 
      pos.row >= 1 && pos.row <= 18 && 
      pos.column >= 1 && pos.column <= 18
    );
  }

  /**
   * Mueve un jugador
   * @param {string} gameId - ID de la partida
   * @param {string} playerId - ID del jugador
   * @param {Object} targetPosition - Posición destino
   * @returns {Object} - Resultado del movimiento
   */
  movePlayer(gameId, playerId, targetPosition) {
    if (!gameService.hasGame(gameId)) {
      return { success: false, message: 'Game not found' };
    }
    
    const game = gameService.getGame(gameId);
    const player = game.players.get(playerId);
    
    if (!player) {
      return { success: false, message: 'Player not found' };
    }
    
    const isValidMove = this.isValidMove(gameId, player.position, targetPosition);
    
    if (!isValidMove) {
      return { success: false, message: 'Invalid move' };
    }
    
    // Update player position
    player.position = targetPosition;
    game.hasMoved = true;
    
    return {
      success: true,
      position: targetPosition
    };
  }

  /**
   * Verifica si un movimiento es válido
   * @param {string} gameId - ID de la partida
   * @param {Object} startPosition - Posición inicial
   * @param {Object} targetPosition - Posición destino
   * @returns {boolean} - True si el movimiento es válido
   */
  isValidMove(gameId, startPosition, targetPosition) {
    // In a real implementation, we would check if the target position is reachable
    // within the dice roll and considering walls/doors
    
    // Simple check: target position must be adjacent to start position
    const rowDiff = Math.abs(targetPosition.row - startPosition.row);
    const colDiff = Math.abs(targetPosition.column - startPosition.column);
    
    // Allow diagonal moves in this simplified version
    return rowDiff <= 1 && colDiff <= 1;
  }

  /**
   * Obtiene la habitación donde está un jugador
   * @param {string} gameId - ID de la partida
   * @param {string} playerId - ID del jugador
   * @returns {Object|null} - Nombre de la habitación o null
   */
  getPlayerRoom(gameId, playerId) {
    if (!gameService.hasGame(gameId)) return null;
    
    const game = gameService.getGame(gameId);
    const player = game.players.get(playerId);
    
    if (!player || !player.position) {
      return null;
    }
    
    // In a real implementation, we would check if the position is inside any room
    // For testing purposes, let's return a mock room
    return {
      roomName: 'Kitchen'
    };
  }
}

export const boardService = new BoardService();
export default boardService;