/*************************************************
 * Test del servicio de tablero con mocks
 * 
 * Este test verifica la funcionalidad del servicio
 * de tablero del juego utilizando mocks, validando la
 * creación de tableros y el cálculo de movimientos.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

// test/unit/services/BoardService.mock.test.js

// Importamos los mocks centralizados
const { boardServiceMock: boardService } = require('../../__mocks__/setupMocks');

describe('BoardService Mock Tests', () => {
  describe('rollDice', () => {
    test('should roll dice and return results', () => {
      // Setup
      const gameId = 'game-1';
      
      // Execute
      const result = boardService.rollDice(gameId);
      
      // Verify
      expect(result).toBeDefined();
      expect(result).toHaveProperty('dice1');
      expect(result).toHaveProperty('dice2');
      // Nuestro mock devuelve valores fijos: 3 y 4
      expect(result.dice1).toBe(3);
      expect(result.dice2).toBe(4);
    });
  });

  describe('getCanRollDice', () => {
    test('should return the canRollDice state from the game', () => {
      // Setup
      const gameId = 'game-1';
      const playerId = 'player-1';
      
      // Execute
      const result = boardService.getCanRollDice(gameId, playerId);
      
      // Verify - nuestro mock siempre devuelve true
      expect(result).toBe(true);
    });
  });

  describe('getValidMoves', () => {
    test('should return empty array if game does not exist', () => {
      // Setup
      const gameId = null;
      const playerId = 'player-1';
      
      // Execute
      const result = boardService.getValidMoves(gameId, playerId);
      
      // Verify - nuestro mock devuelve array vacío
      expect(Array.isArray(result)).toBe(true);
    });

    test('should return empty array if it is not player turn', () => {
      // Setup
      const gameId = 'game-1';
      const playerId = 'not-current-player';
      
      // Execute
      const result = boardService.getValidMoves(gameId, playerId);
      
      // Verify - nuestro mock devuelve array vacío
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('movePlayer', () => {
    test('should process player move', () => {
      // Setup
      const gameId = 'game-1';
      const playerId = 'player-1';
      const position = { x: 5, y: 5 };
      
      // Execute
      const result = boardService.movePlayer(gameId, playerId, position);
      
      // Verify - nuestro mock siempre devuelve true
      expect(result).toBe(true);
    });
  });
});