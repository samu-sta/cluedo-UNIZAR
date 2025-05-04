/*************************************************
 * Test de los manejadores de jugadores
 * 
 * Este test verifica los manejadores de eventos
 * socket.io para la gestión de jugadores,
 * incluyendo conexión, desconexión y estados de preparación.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import { jest } from '@jest/globals';
import { GAME_STATES, SOCKET_EVENTS } from '../../../../src/config/constants.js';
import MESSAGES from '../../../../src/messages/messages.js';

describe('playerHandlers', () => {
  const mockIo = {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn()
  };

  const mockSocket = {
    join: jest.fn(),
    emit: jest.fn(),
    to: jest.fn().mockReturnThis()
  };

  const mockGameStateManager = {
    addPlayer: jest.fn(),
    removePlayer: jest.fn(),
    handlePlayerLeaveInGame: jest.fn(),
    getGameState: jest.fn(),
    getPlayers: jest.fn(),
    getPlayerCount: jest.fn(),
    deleteGame: jest.fn(),
    setGameState: jest.fn(),
    getPlayerCards: jest.fn(),
    getLeftoverCards: jest.fn()
  };

  const mockCountdownManager = {
    startCountdown: jest.fn(),
    cancelCountdown: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  let playerHandlers;

  beforeEach(async () => {
    jest.resetModules();
    playerHandlers = await import('../../../../src/socket/handlers/playerHandlers.js');
  });

  describe('handlePlayerConnection', () => {
    test('should handle player connection successfully', async () => {
      const gameId = 'game-123';
      const userId = 'user-123';
      const username = 'testPlayer';
      const mockPlayers = [{ id: 'user-123', username: 'testPlayer' }];

      mockGameStateManager.addPlayer.mockResolvedValue(true);
      mockGameStateManager.getPlayers.mockReturnValue(mockPlayers);

      const result = await playerHandlers.handlePlayerConnection(
        mockGameStateManager,
        mockSocket,
        mockIo,
        gameId,
        userId,
        username
      );

      expect(mockSocket.join).toHaveBeenCalledWith(gameId);
      expect(mockGameStateManager.addPlayer).toHaveBeenCalledWith(gameId, userId, { username });
      expect(mockSocket.emit).toHaveBeenCalledWith(SOCKET_EVENTS.PLAYER_LIST, { players: mockPlayers });
      expect(mockSocket.to).toHaveBeenCalledWith(gameId);
      expect(result).toBe(true);
    });

    test('should not emit player joined event if player is not new', async () => {
      mockGameStateManager.addPlayer.mockResolvedValue(false);

      await playerHandlers.handlePlayerConnection(
        mockGameStateManager,
        mockSocket,
        mockIo,
        'game-123',
        'user-123',
        'testPlayer'
      );

      expect(mockSocket.to).not.toHaveBeenCalled();
    });
  });

  describe('handlePlayerLeave', () => {
    test('should handle player leaving during game', () => {
      const gameId = 'game-123';
      const userId = 'user-123';
      const username = 'testPlayer';
      
      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      mockGameStateManager.handlePlayerLeaveInGame.mockReturnValue({
        success: true,
        nextTurn: {
          playerId: 'user-456',
          playerName: 'Player2'
        },
        shouldEndGame: false
      });

      playerHandlers.handlePlayerLeave(
        mockGameStateManager,
        mockCountdownManager,
        mockSocket,
        mockIo,
        gameId,
        userId,
        username
      );

      expect(mockGameStateManager.getGameState).toHaveBeenCalledWith(gameId);
      expect(mockGameStateManager.handlePlayerLeaveInGame).toHaveBeenCalledWith(gameId, userId);
      expect(mockIo.to).toHaveBeenCalledWith(gameId);
      expect(mockIo.emit).toHaveBeenCalledWith(SOCKET_EVENTS.TURN_UPDATE, {
        currentTurn: {
          playerId: 'user-456',
          playerName: 'Player2'
        }
      });
      expect(mockIo.emit).toHaveBeenCalledWith(SOCKET_EVENTS.PLAYER_LEFT, { username });
    });

    test('should end game when last player leaves', () => {
      const gameId = 'game-123';
      const userId = 'user-123';
      const username = 'testPlayer';
      
      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      mockGameStateManager.handlePlayerLeaveInGame.mockReturnValue({
        success: true,
        shouldEndGame: true,
        remainingPlayers: [],
        winner: null
      });

      playerHandlers.handlePlayerLeave(
        mockGameStateManager,
        mockCountdownManager,
        mockSocket,
        mockIo,
        gameId,
        userId,
        username
      );

      expect(mockGameStateManager.setGameState).toHaveBeenCalledWith(gameId, GAME_STATES.ENDED);
      expect(mockIo.to).toHaveBeenCalledWith(gameId);
      expect(mockIo.emit).toHaveBeenCalledWith(SOCKET_EVENTS.GAME_END, {
        reason: MESSAGES.ALL_PLAYERS_LEFT,
        winner: null
      });
    });

    test('should end game with winner when only one player remains', () => {
      const gameId = 'game-123';
      const userId = 'user-123';
      const username = 'testPlayer';
      
      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      mockGameStateManager.handlePlayerLeaveInGame.mockReturnValue({
        success: true,
        shouldEndGame: true,
        remainingPlayers: [{ id: 'user-456', username: 'Player2' }],
        winner: 'Player2'
      });

      playerHandlers.handlePlayerLeave(
        mockGameStateManager,
        mockCountdownManager,
        mockSocket,
        mockIo,
        gameId,
        userId,
        username
      );

      expect(mockGameStateManager.setGameState).toHaveBeenCalledWith(gameId, GAME_STATES.ENDED);
      expect(mockIo.to).toHaveBeenCalledWith(gameId);
      expect(mockIo.emit).toHaveBeenCalledWith(SOCKET_EVENTS.GAME_END, {
        reason: `${username} ${MESSAGES.PLAYER_LEFT_ONE_REMAINING}`,
        winner: 'Player2'
      });
    });

    test('should do nothing when handlePlayerLeaveInGame fails', () => {
      const gameId = 'game-123';
      const userId = 'user-123';
      const username = 'testPlayer';
      
      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      mockGameStateManager.handlePlayerLeaveInGame.mockReturnValue({
        success: false
      });

      playerHandlers.handlePlayerLeave(
        mockGameStateManager,
        mockCountdownManager,
        mockSocket,
        mockIo,
        gameId,
        userId,
        username
      );

      expect(mockIo.to).not.toHaveBeenCalled();
      expect(mockIo.emit).not.toHaveBeenCalled();
    });

    test('should handle player leaving before game starts', () => {
      const gameId = 'game-123';
      const userId = 'user-123';
      const username = 'testPlayer';
      
      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.WAITING);
      mockGameStateManager.removePlayer.mockReturnValue(true);
      mockGameStateManager.getPlayerCount.mockReturnValue(1);

      playerHandlers.handlePlayerLeave(
        mockGameStateManager,
        mockCountdownManager,
        mockSocket,
        mockIo,
        gameId,
        userId,
        username
      );

      expect(mockGameStateManager.removePlayer).toHaveBeenCalledWith(gameId, userId);
      expect(mockIo.to).toHaveBeenCalledWith(gameId);
      expect(mockIo.emit).toHaveBeenCalledWith(SOCKET_EVENTS.PLAYER_LEFT, { username });
      expect(mockCountdownManager.cancelCountdown).toHaveBeenCalledWith(gameId);
    });

    test('should delete game when no players remain', () => {
      const gameId = 'game-123';
      const userId = 'user-123';
      const username = 'testPlayer';
      
      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.WAITING);
      mockGameStateManager.removePlayer.mockReturnValue(true);
      mockGameStateManager.getPlayerCount.mockReturnValue(0);

      playerHandlers.handlePlayerLeave(
        mockGameStateManager,
        mockCountdownManager,
        mockSocket,
        mockIo,
        gameId,
        userId,
        username
      );

      expect(mockGameStateManager.deleteGame).toHaveBeenCalledWith(gameId);
    });

    test('should do nothing when removePlayer fails', () => {
      const gameId = 'game-123';
      const userId = 'user-123';
      const username = 'testPlayer';
      
      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.WAITING);
      mockGameStateManager.removePlayer.mockReturnValue(false);

      playerHandlers.handlePlayerLeave(
        mockGameStateManager,
        mockCountdownManager,
        mockSocket,
        mockIo,
        gameId,
        userId,
        username
      );

      expect(mockIo.to).not.toHaveBeenCalled();
      expect(mockGameStateManager.getPlayerCount).not.toHaveBeenCalled();
    });
  });

  describe('handleRequestCards', () => {
    test('should send player cards when game is playing', () => {
      const gameId = 'game-123';
      const userId = 'user-123';
      const mockCards = [{ name: 'Miss Scarlet', type: 'character' }];
      const mockLeftoverCards = [{ name: 'Kitchen', type: 'room' }];
      
      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      mockGameStateManager.getPlayerCards.mockReturnValue(mockCards);
      mockGameStateManager.getLeftoverCards.mockReturnValue(mockLeftoverCards);

      playerHandlers.handleRequestCards(
        mockGameStateManager,
        mockSocket,
        gameId,
        userId
      );

      expect(mockGameStateManager.getGameState).toHaveBeenCalledWith(gameId);
      expect(mockGameStateManager.getPlayerCards).toHaveBeenCalledWith(gameId, userId);
      expect(mockGameStateManager.getLeftoverCards).toHaveBeenCalledWith(gameId);
      expect(mockSocket.emit).toHaveBeenCalledWith(SOCKET_EVENTS.PLAYER_CARDS, {
        cards: mockCards,
        leftoverCards: mockLeftoverCards
      });
    });

    test('should send error when game is not playing', () => {
      const gameId = 'game-123';
      const userId = 'user-123';
      
      mockGameStateManager.getGameState.mockReturnValue(GAME_STATES.WAITING);

      playerHandlers.handleRequestCards(
        mockGameStateManager,
        mockSocket,
        gameId,
        userId
      );

      expect(mockSocket.emit).toHaveBeenCalledWith(SOCKET_EVENTS.ERROR, MESSAGES.GAME_NOT_STARTED);
      expect(mockGameStateManager.getPlayerCards).not.toHaveBeenCalled();
    });
  });

  describe('handlePlayerReady', () => {
    test('should start countdown when enough players are ready', () => {
      const gameId = 'game-123';
      
      mockGameStateManager.getPlayerCount.mockReturnValue(3);

      playerHandlers.handlePlayerReady(
        mockGameStateManager,
        mockCountdownManager,
        gameId
      );

      expect(mockGameStateManager.getPlayerCount).toHaveBeenCalledWith(gameId);
      expect(mockCountdownManager.startCountdown).toHaveBeenCalledWith(gameId);
    });

    test('should not start countdown when not enough players', () => {
      const gameId = 'game-123';
      
      mockGameStateManager.getPlayerCount.mockReturnValue(1);

      playerHandlers.handlePlayerReady(
        mockGameStateManager,
        mockCountdownManager,
        gameId
      );

      expect(mockCountdownManager.startCountdown).not.toHaveBeenCalled();
    });
  });
});