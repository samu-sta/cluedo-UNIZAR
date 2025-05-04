/*************************************************
 * Test de integración para mock de GameControllerService
 * 
 * Este mock simula el servicio de control del juego,
 * permitiendo pruebas de la lógica de gestión de
 * estados y respuestas del juego.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import { jest } from '@jest/globals';

export const gameService = {
  prepareGameResponse: jest.fn().mockResolvedValue({
    success: true,
    gameId: 'test-game-id',
    token: 'test-socket-token'
  }),
  getAllGames: jest.fn(),
  getGame: jest.fn(),
  hasGame: jest.fn(),
  initGame: jest.fn(),
  setGameState: jest.fn(),
  getGameState: jest.fn(),
  removeGame: jest.fn(),
  getActiveGamesCount: jest.fn().mockReturnValue(1)
};

export default gameService;