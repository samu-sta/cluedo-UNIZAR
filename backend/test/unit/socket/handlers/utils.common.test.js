/*************************************************
 * Test de utilidades comunes para manejadores
 * 
 * Este test verifica las funciones de utilidad comunes
 * que son compartidas entre los diferentes manejadores
 * de socket.io para el juego Cluedo.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { GAME_STATES, SOCKET_EVENTS } from '../../../../src/config/constants.js';
import MESSAGES from '../../../../src/messages/messages.js';
import { validateGameAction, endGame } from '../../../../src/socket/handlers/utils.js';

describe('Socket Handler Utils', () => {
  describe('validateGameAction', () => {
    let gameStateManager;
    let socket;
    const gameId = 'game123';
    const userId = 'user123';

    beforeEach(() => {
      socket = {
        emit: jest.fn()
      };
      gameStateManager = {
        getGameState: jest.fn(),
        isPlayerTurn: jest.fn()
      };
    });

    test('should return true when game is in progress and it is players turn', () => {
      gameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      gameStateManager.isPlayerTurn.mockReturnValue(true);
      
      const result = validateGameAction(gameStateManager, socket, gameId, userId);
      
      expect(result).toBe(true);
      expect(gameStateManager.getGameState).toHaveBeenCalledWith(gameId);
      expect(gameStateManager.isPlayerTurn).toHaveBeenCalledWith(gameId, userId);
      expect(socket.emit).not.toHaveBeenCalled();
    });

    test('should return false when game is not in progress', () => {
      gameStateManager.getGameState.mockReturnValue(GAME_STATES.WAITING);
      
      const result = validateGameAction(gameStateManager, socket, gameId, userId);
      
      expect(result).toBe(false);
      expect(gameStateManager.getGameState).toHaveBeenCalledWith(gameId);
      expect(socket.emit).toHaveBeenCalledWith(SOCKET_EVENTS.ERROR, MESSAGES.GAME_NOT_IN_PROGRESS);
      expect(gameStateManager.isPlayerTurn).not.toHaveBeenCalled();
    });

    test('should return false when it is not players turn', () => {
      gameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      gameStateManager.isPlayerTurn.mockReturnValue(false);
      
      const result = validateGameAction(gameStateManager, socket, gameId, userId);
      
      expect(result).toBe(false);
      expect(gameStateManager.getGameState).toHaveBeenCalledWith(gameId);
      expect(gameStateManager.isPlayerTurn).toHaveBeenCalledWith(gameId, userId);
      expect(socket.emit).toHaveBeenCalledWith(SOCKET_EVENTS.ERROR, MESSAGES.NOT_YOUR_TURN);
    });
  });

  describe('endGame', () => {
    let gameStateManager;
    let io;
    const gameId = 'game123';
    const reason = 'Game Over';
    const winner = 'Player 1';
    const solution = { suspect: 'Colonel Mustard', weapon: 'Candlestick', room: 'Kitchen' };

    beforeEach(() => {
      io = {
        to: jest.fn().mockReturnThis(),
        emit: jest.fn()
      };
      gameStateManager = {
        setGameState: jest.fn()
      };
    });

    test('should end game with solution', () => {
      endGame(gameStateManager, io, gameId, reason, winner, solution);
      
      expect(gameStateManager.setGameState).toHaveBeenCalledWith(gameId, GAME_STATES.ENDED);
      expect(io.to).toHaveBeenCalledWith(gameId);
      expect(io.emit).toHaveBeenCalledWith(SOCKET_EVENTS.GAME_END, { 
        reason, 
        winner,
        solution
      });
    });

    test('should end game without solution', () => {
      endGame(gameStateManager, io, gameId, reason, winner);
      
      expect(gameStateManager.setGameState).toHaveBeenCalledWith(gameId, GAME_STATES.ENDED);
      expect(io.to).toHaveBeenCalledWith(gameId);
      expect(io.emit).toHaveBeenCalledWith(SOCKET_EVENTS.GAME_END, { 
        reason, 
        winner,
        solution: null
      });
    });
  });
});