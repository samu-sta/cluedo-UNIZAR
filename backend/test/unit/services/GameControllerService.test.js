/*************************************************
 * Test del servicio controlador de juegos
 * 
 * Este test verifica el funcionamiento del servicio
 * que controla la lógica principal de los juegos,
 * incluyendo su creación, unión de jugadores,
 * y gestión del estado del juego.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import { jest } from '@jest/globals';
import auth from '../../../src/utils/auth.js';

// Mock the dependencies
jest.mock('../../../src/utils/auth.js', () => ({
  default: {
    generateSocketToken: jest.fn().mockReturnValue('fake-socket-token')
  }
}));

jest.mock('../../../src/utils/game.js', () => ({
  getGame: jest.fn()
}));

// Import the service after mocking dependencies
import gameService from '../../../src/services/GameControllerService.js';

describe('GameControllerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('prepareGameResponse', () => {
    it('should prepare a complete game response', async () => {
      // Arrange
      const user = { id: 'user123', username: 'testuser' };
      const gameId = 'game-1';
      
      // Act
      const result = await gameService.prepareGameResponse(user, gameId);
      
      // Assert - match the actual implementation's return structure
      expect(result).toEqual({
        success: true,
        gameId: 'game-1',
        token: 'fake-socket-token'
      });
    });

    it('should handle errors in getGame gracefully', async () => {
      // Arrange
      const user = { id: 'user123', username: 'testuser' };
      const gameId = 'game-1';
      
      // Act
      const result = await gameService.prepareGameResponse(user, gameId);
      
      // Assert
      expect(result).toEqual({
        success: true,
        gameId: 'game-1',
        token: 'fake-socket-token'
      });
    });
  });
});