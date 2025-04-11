import { gameService } from './GameService.js';
import { turnService } from './TurnService.js';
import { createDoorPositionsMap, findValidMoves } from '../utils/board.js';
import { isPositionInsideRoom } from '../utils/game.js';
import MESSAGES from '../messages/messages.js';

/**
 * Servicio para gestionar los movimientos en el tablero
 */
class BoardService {
  /**
   * Lanza los dados para el jugador actual
   * @param {string} gameId - ID de la partida
   * @returns {Object|null} Resultado de los dados
   */
  rollDice(gameId) {
    if (!gameService.hasGame(gameId)) return null;

    const game = gameService.getGame(gameId);
    const diceResult1 = Math.floor(Math.random() * 6) + 1;
    const diceResult2 = Math.floor(Math.random() * 6) + 1;
    game.diceResult = diceResult1 + diceResult2;
    game.canRollDice = false;

    return {
      diceResult1,
      diceResult2
    };
  }

  /**
   * Verifica si el jugador puede lanzar los dados
   * @param {string} gameId - ID de la partida
   * @returns {boolean} True si puede lanzar los dados
   */
  getCanRollDice(gameId) {
    if (!gameService.hasGame(gameId)) return null;

    const game = gameService.getGame(gameId);
    return game.canRollDice;
  }

  /**
   * Obtiene los movimientos válidos para un jugador
   * @param {string} gameId - ID de la partida
   * @param {string} playerId - ID del jugador
   * @returns {Array} Lista de posiciones válidas
   */
  getValidMoves(gameId, playerId) {
    if (!gameService.hasGame(gameId) || !turnService.isPlayerTurn(gameId, playerId)) {
      return [];
    }

    const game = gameService.getGame(gameId);
    const player = game.players.get(playerId);

    if (!player || !game.diceResult) {
      return [];
    }

    const { position } = player;
    const maxSteps = game.diceResult;
    const board = game.board;

    const doorPositions = createDoorPositionsMap(board);

    return findValidMoves(position, maxSteps, board, doorPositions);
  }

  /**
   * Mueve un jugador a una nueva posición
   * @param {string} gameId - ID de la partida
   * @param {string} playerId - ID del jugador
   * @param {Object} targetPosition - Nueva posición
   * @returns {Object} Resultado del movimiento
   */
  movePlayer(gameId, playerId, targetPosition) {
    if (!gameService.hasGame(gameId) || !turnService.isPlayerTurn(gameId, playerId)) {
      return { success: false, message: MESSAGES.NOT_YOUR_TURN };
    }

    const game = gameService.getGame(gameId);
    const player = game.players.get(playerId);

    if (!player) {
      return { success: false, message: MESSAGES.PLAYER_NOT_FOUND };
    }

    // Verificar que el movimiento es válido
    const validMoves = this.getValidMoves(gameId, playerId);
    const isValidMove = validMoves.some(move =>
      move.row === targetPosition.row && move.column === targetPosition.column
    );

    if (!isValidMove) {
      return { success: false, message: MESSAGES.INVALID_MOVE };
    }

    // Encontrar el camino para animación
    const movePath = validMoves.find(move =>
      move.row === targetPosition.row && move.column === targetPosition.column
    ).path;

    // Actualizar posición del jugador
    player.position = targetPosition;
    game.hasMoved = true;

    // Movimiento exitoso
    return {
      success: true,
      path: movePath
    };
  }

  /**
   * Obtiene la habitación en la que se encuentra un jugador
   * @param {string} gameId - ID de la partida
   * @param {string} playerId - ID del jugador
   * @returns {Object|null} Información de la habitación
   */
  getPlayerRoom(gameId, playerId) {
    if (!gameService.hasGame(gameId)) return null;

    const game = gameService.getGame(gameId);
    const player = game.players.get(playerId);

    if (!player || !player.position) return null;

    const { row, column } = player.position;
    const board = game.board;

    for (const room of board.rooms) {
      const isInDoor = room.doors.some(door =>
        door.row === row && door.column === column
      );

      if (isInDoor) continue;

      if (isPositionInsideRoom(room, { row, column })) {
        return { roomName: room.name, room };
      }
    }

    return null;
  }
}

export const boardService = new BoardService();