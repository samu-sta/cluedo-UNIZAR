/*************************************************
 * Test de los manejadores de sugerencias
 * 
 * Este test verifica los manejadores de eventos
 * socket.io para sugerencias y acusaciones en el
 * juego, incluyendo la validación y respuesta a 
 * sugerencias de los jugadores.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import { jest } from '@jest/globals';
import { GAME_STATES, SOCKET_EVENTS } from '../../../../src/config/constants.js';
import MESSAGES from '../../../../src/messages/messages.js';

describe('suggestionHandlers', () => {
  const mockIo = {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
    sockets: {
      sockets: new Map()
    }
  };

  const mockSocket = {
    emit: jest.fn(),
    to: jest.fn().mockReturnThis(),
    id: 'socket-id-123'
  };

  const mockGameStateManager = {
    getGameState: jest.fn(),
    makeAccusation: jest.fn(),
    setGameState: jest.fn(),
    nextTurn: jest.fn(),
    validateSuggestion: jest.fn(),
    setCurrentSuggestion: jest.fn(),
    getGame: jest.fn(),
    showCard: jest.fn(),
    getCurrentPlayerId: jest.fn(),
    isPlayerTurn: jest.fn().mockImplementation((gameId, playerId) => {
      // By default, return true if getCurrentPlayerId returns the same id
      const currentPlayerId = mockGameStateManager.getCurrentPlayerId(gameId);
      return currentPlayerId === playerId;
    }),
    getCurrentTurnPlayer: jest.fn()
  };
  
  let suggestionHandlers;
  
  beforeEach(async () => {
    jest.resetModules();
    jest.clearAllMocks();
    suggestionHandlers = await import('../../../../src/socket/handlers/suggestionHandlers.js');
    
    // Reset mockIo.sockets.sockets
    mockIo.sockets.sockets = new Map();
  });

  describe('handleMakeAccusation', () => {
    test('should handle a correct accusation', () => {
      const gameId = 'game-123';
      const userId = 'user-123';
      const username = 'testPlayer';
      const accusation = {
        character: 'Colonel Mustard',
        weapon: 'Candlestick',
        room: 'Hall'
      };

      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      mockGameStateManager.getCurrentPlayerId.mockReturnValue(userId);
      mockGameStateManager.makeAccusation.mockReturnValue({
        success: true,
        isCorrect: true,
        solution: accusation
      });

      suggestionHandlers.handleMakeAccusation(
        mockGameStateManager,
        mockSocket,
        mockIo,
        gameId,
        userId,
        username,
        accusation
      );

      expect(mockGameStateManager.getGameState).toHaveBeenCalledWith(gameId);
      expect(mockGameStateManager.getCurrentPlayerId).toHaveBeenCalledWith(gameId);
      expect(mockGameStateManager.makeAccusation).toHaveBeenCalledWith(gameId, userId, accusation);
      expect(mockGameStateManager.setGameState).toHaveBeenCalledWith(gameId, GAME_STATES.ENDED);
      expect(mockIo.to).toHaveBeenCalledWith(gameId);
      expect(mockIo.emit).toHaveBeenCalledWith(SOCKET_EVENTS.GAME_END, {
        reason: `${username} ${MESSAGES.SOLVED_CASE_CORRECTLY}`,
        winner: username,
        solution: accusation
      });
    });

    test('should handle an incorrect accusation', () => {
      const gameId = 'game-123';
      const userId = 'user-123';
      const username = 'testPlayer';
      const accusation = {
        character: 'Colonel Mustard',
        weapon: 'Candlestick',
        room: 'Hall'
      };

      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      mockGameStateManager.getCurrentPlayerId.mockReturnValue(userId);
      mockGameStateManager.makeAccusation.mockReturnValue({
        success: true,
        isCorrect: false,
        shouldEndGame: false
      });
      mockGameStateManager.nextTurn.mockReturnValue({
        playerId: 'user-456',
        playerName: 'Player2'
      });

      suggestionHandlers.handleMakeAccusation(
        mockGameStateManager,
        mockSocket,
        mockIo,
        gameId,
        userId,
        username,
        accusation
      );

      expect(mockSocket.emit).toHaveBeenCalledWith(SOCKET_EVENTS.INCORRECT_ACCUSATION, {
        message: MESSAGES.INCORRECT_ACCUSATION
      });
      expect(mockGameStateManager.nextTurn).toHaveBeenCalledWith(gameId);
      expect(mockIo.to).toHaveBeenCalledWith(gameId);
      expect(mockIo.emit).toHaveBeenCalledWith(SOCKET_EVENTS.TURN_UPDATE, {
        currentTurn: { playerId: 'user-456', playerName: 'Player2' }
      });
    });

    test('should handle an incorrect accusation that ends the game', () => {
      const gameId = 'game-123';
      const userId = 'user-123';
      const username = 'testPlayer';
      const accusation = {
        character: 'Colonel Mustard',
        weapon: 'Candlestick',
        room: 'Hall'
      };
      const solution = {
        character: 'Mrs. White',
        weapon: 'Rope',
        room: 'Kitchen'
      };

      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      mockGameStateManager.getCurrentPlayerId.mockReturnValue(userId);
      mockGameStateManager.makeAccusation.mockReturnValue({
        success: true,
        isCorrect: false,
        shouldEndGame: true,
        winner: 'Player2',
        solution
      });

      suggestionHandlers.handleMakeAccusation(
        mockGameStateManager,
        mockSocket,
        mockIo,
        gameId,
        userId,
        username,
        accusation
      );

      expect(mockSocket.emit).toHaveBeenCalledWith(SOCKET_EVENTS.INCORRECT_ACCUSATION, {
        message: MESSAGES.INCORRECT_ACCUSATION
      });
      expect(mockGameStateManager.setGameState).toHaveBeenCalledWith(gameId, GAME_STATES.ENDED);
      expect(mockSocket.to).toHaveBeenCalledWith(gameId);
      expect(mockSocket.emit).toHaveBeenCalledWith(SOCKET_EVENTS.GAME_END, {
        reason: `${username} ${MESSAGES.LAST_PLAYER_ELIMINATED}`,
        winner: 'Player2',
        solution
      });
    });

    test('should handle accusation validation failure', () => {
      const gameId = 'game-123';
      const userId = 'user-123';
      const username = 'testPlayer';
      const accusation = {
        character: 'Colonel Mustard',
        weapon: 'Candlestick',
        room: 'Hall'
      };

      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      mockGameStateManager.getCurrentPlayerId.mockReturnValue(userId);
      mockGameStateManager.makeAccusation.mockReturnValue({
        success: false,
        message: 'Invalid accusation'
      });

      suggestionHandlers.handleMakeAccusation(
        mockGameStateManager,
        mockSocket,
        mockIo,
        gameId,
        userId,
        username,
        accusation
      );

      expect(mockSocket.emit).toHaveBeenCalledWith(SOCKET_EVENTS.ERROR, 'Invalid accusation');
      expect(mockGameStateManager.setGameState).not.toHaveBeenCalled();
    });

    test('should validate game action and return if invalid', () => {
      const gameId = 'game-123';
      const userId = 'user-123';
      const username = 'testPlayer';
      const accusation = {
        character: 'Colonel Mustard',
        weapon: 'Candlestick',
        room: 'Hall'
      };

      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.WAITING);

      suggestionHandlers.handleMakeAccusation(
        mockGameStateManager,
        mockSocket,
        mockIo,
        gameId,
        userId,
        username,
        accusation
      );

      expect(mockSocket.emit).toHaveBeenCalledWith(SOCKET_EVENTS.ERROR, MESSAGES.GAME_NOT_IN_PROGRESS);
      expect(mockGameStateManager.makeAccusation).not.toHaveBeenCalled();
    });
  });

  describe('handleMakeSuggestion', () => {
    test('should handle a valid suggestion', () => {
      const gameId = 'game-123';
      const userId = 'user-123';
      const username = 'testPlayer';
      const suggestion = {
        character: 'Colonel Mustard',
        weapon: 'Candlestick',
        room: 'Hall'
      };
      const mockGame = { hasSuggested: false };

      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      mockGameStateManager.validateSuggestion.mockReturnValue({ valid: true });
      mockGameStateManager.getGame.mockReturnValue(mockGame);

      suggestionHandlers.handleMakeSuggestion(
        mockGameStateManager,
        mockSocket,
        mockIo,
        gameId,
        userId,
        username,
        suggestion
      );

      expect(mockGameStateManager.getGameState).toHaveBeenCalledWith(gameId);
      expect(mockGameStateManager.validateSuggestion).toHaveBeenCalledWith(gameId, userId, suggestion);
      
      // Check that the suggestion was set with the username
      const expectedSuggestion = { ...suggestion, username };
      expect(mockGameStateManager.setCurrentSuggestion).toHaveBeenCalledWith(gameId, expectedSuggestion);
      
      // Check that hasSuggested flag was set
      expect(mockGame.hasSuggested).toBe(true);
      
      // Check that proper events were emitted
      expect(mockSocket.emit).toHaveBeenCalledWith(SOCKET_EVENTS.SUGGESTION_MADE);
      expect(mockSocket.to).toHaveBeenCalledWith(gameId);
      expect(mockSocket.emit).toHaveBeenCalledWith(SOCKET_EVENTS.CURRENT_SUGGESTION, {
        suggestion: expectedSuggestion
      });
    });

    test('should handle an invalid suggestion', () => {
      const gameId = 'game-123';
      const userId = 'user-123';
      const username = 'testPlayer';
      const suggestion = {
        character: 'Colonel Mustard',
        weapon: 'Candlestick',
        room: 'Hall'
      };

      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      mockGameStateManager.validateSuggestion.mockReturnValue({
        valid: false,
        message: 'Invalid suggestion'
      });

      suggestionHandlers.handleMakeSuggestion(
        mockGameStateManager,
        mockSocket,
        mockIo,
        gameId,
        userId,
        username,
        suggestion
      );

      expect(mockSocket.emit).toHaveBeenCalledWith(SOCKET_EVENTS.ERROR, 'Invalid suggestion');
      expect(mockGameStateManager.setCurrentSuggestion).not.toHaveBeenCalled();
    });

    test('should return error if game is not in playing state', () => {
      const gameId = 'game-123';
      const userId = 'user-123';
      const username = 'testPlayer';
      const suggestion = {
        character: 'Colonel Mustard',
        weapon: 'Candlestick',
        room: 'Hall'
      };

      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.WAITING);

      suggestionHandlers.handleMakeSuggestion(
        mockGameStateManager,
        mockSocket,
        mockIo,
        gameId,
        userId,
        username,
        suggestion
      );

      expect(mockSocket.emit).toHaveBeenCalledWith(SOCKET_EVENTS.ERROR, MESSAGES.GAME_NOT_IN_PROGRESS);
      expect(mockGameStateManager.validateSuggestion).not.toHaveBeenCalled();
    });
  });

  describe('handleShowCard', () => {
    test('should handle showing a card successfully', () => {
      const gameId = 'game-123';
      const userId = 'user-123';
      const username = 'testPlayer';
      const card = { name: 'Colonel Mustard', type: 'character' };
      const suggesterSocket = { id: 'suggester-socket-id' };
      suggesterSocket.username = 'suggestionMaker';

      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      mockGameStateManager.showCard.mockReturnValue({
        success: true,
        suggestionMaker: 'suggestionMaker',
        cardShown: card
      });

      // Add the suggester socket to the sockets map
      mockIo.sockets.sockets.set('suggester-socket-id', suggesterSocket);

      suggestionHandlers.handleShowCard(
        mockGameStateManager,
        mockSocket,
        mockIo,
        gameId,
        userId,
        username,
        card
      );

      expect(mockGameStateManager.getGameState).toHaveBeenCalledWith(gameId);
      expect(mockGameStateManager.showCard).toHaveBeenCalledWith(gameId, userId, card);
      expect(mockIo.to).toHaveBeenCalledWith('suggester-socket-id');
      expect(mockIo.emit).toHaveBeenCalledWith(SOCKET_EVENTS.CARD_SHOWN, {
        username,
        card
      });
    });

    test('should handle error when showing card fails', () => {
      const gameId = 'game-123';
      const userId = 'user-123';
      const username = 'testPlayer';
      const card = { name: 'Colonel Mustard', type: 'character' };

      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      mockGameStateManager.showCard.mockReturnValue({
        success: false,
        message: 'Cannot show this card'
      });

      suggestionHandlers.handleShowCard(
        mockGameStateManager,
        mockSocket,
        mockIo,
        gameId,
        userId,
        username,
        card
      );

      expect(mockSocket.emit).toHaveBeenCalledWith(SOCKET_EVENTS.ERROR, 'Cannot show this card');
      expect(mockIo.to).not.toHaveBeenCalled();
    });

    test('should handle suggestion player not found', () => {
      const gameId = 'game-123';
      const userId = 'user-123';
      const username = 'testPlayer';
      const card = { name: 'Colonel Mustard', type: 'character' };

      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      mockGameStateManager.showCard.mockReturnValue({
        success: true,
        suggestionMaker: 'nonexistentPlayer',
        cardShown: card
      });

      // Empty sockets map (player not found)
      mockIo.sockets.sockets = new Map();

      suggestionHandlers.handleShowCard(
        mockGameStateManager,
        mockSocket,
        mockIo,
        gameId,
        userId,
        username,
        card
      );

      expect(mockSocket.emit).toHaveBeenCalledWith(SOCKET_EVENTS.ERROR, MESSAGES.SUGGESTION_PLAYER_NOT_FOUND);
      expect(mockIo.to).not.toHaveBeenCalled();
    });

    test('should return error if game is not in playing state', () => {
      const gameId = 'game-123';
      const userId = 'user-123';
      const username = 'testPlayer';
      const card = { name: 'Colonel Mustard', type: 'character' };

      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.WAITING);

      suggestionHandlers.handleShowCard(
        mockGameStateManager,
        mockSocket,
        mockIo,
        gameId,
        userId,
        username,
        card
      );

      expect(mockSocket.emit).toHaveBeenCalledWith(SOCKET_EVENTS.ERROR, MESSAGES.GAME_NOT_IN_PROGRESS);
      expect(mockGameStateManager.showCard).not.toHaveBeenCalled();
    });
  });
});