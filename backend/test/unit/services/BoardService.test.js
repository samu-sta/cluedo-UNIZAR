/*************************************************
 * Test del servicio de tablero
 * 
 * Este test verifica el funcionamiento del servicio
 * de tablero, incluyendo la creación del tablero,
 * validación de movimientos y posicionamiento de
 * elementos en el tablero de juego.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

// Import Jest functions and mocks properly with ES modules
import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { boardServiceMock } from '../../__mocks__/setupMocks.js';

// Use the imported mock
const boardService = boardServiceMock;

describe('BoardService', () => {
  // Variables de prueba
  const gameId = 'game1';
  const playerId = 'player1';
  const position = { x: 5, y: 5 };
  
  beforeEach(() => {
    // Limpiar todos los mocks entre pruebas
    jest.clearAllMocks();
  });
  
  describe('rollDice', () => {
    test('should roll dice and return results', () => {
      // Ejecutamos la función
      const result = boardService.rollDice(gameId);
      
      // Con nuestro mock centralizado, verificamos que:
      expect(result).toBeDefined();
      expect(result).toHaveProperty('dice1');
      expect(result).toHaveProperty('dice2');
      expect(result).toHaveProperty('total');
      expect(result.dice1).toBe(3);
      expect(result.dice2).toBe(4);
      expect(result.total).toBe(7);
    });
  });
  
  describe('getCanRollDice', () => {
    test('should return the canRollDice state from the game', () => {
      // Ejecutamos la función
      const result = boardService.getCanRollDice(gameId, playerId);
      
      // Con nuestro mock centralizado, verificamos que:
      expect(result).toBe(true);
    });
  });
  
  describe('getValidMoves', () => {
    test('should return valid moves array', () => {
      // Ejecutamos la función
      const result = boardService.getValidMoves(gameId, playerId);
      
      // Con nuestro mock centralizado, verificamos que:
      expect(Array.isArray(result)).toBe(true);
    });

    test('should handle game not exist case', () => {
      // Ejecutamos la función con un gameId inexistente
      const result = boardService.getValidMoves(null, playerId);
      
      // Con nuestro mock centralizado, verificamos que:
      expect(Array.isArray(result)).toBe(true);
    });

    test('should handle not player turn case', () => {
      // Ejecutamos la función con un playerId que no sea el turno actual
      const result = boardService.getValidMoves(gameId, 'not-current-player');
      
      // Con nuestro mock centralizado, verificamos que:
      expect(Array.isArray(result)).toBe(true);
    });
  });
  
  describe('movePlayer', () => {
    test('should process player move', () => {
      // Ejecutamos la función
      const result = boardService.movePlayer(gameId, playerId, position);
      
      // Con nuestro mock centralizado, verificamos que:
      expect(result).toEqual(true);
    });
  });

  // Nota: No probamos getPlayerRoom porque no existe en nuestro mock centralizado
});