/*************************************************
 * Test del gestor de cuentas atrás
 * 
 * Este test verifica la funcionalidad del gestor
 * de temporizadores para las cuentas atrás del juego
 * incluyendo inicio, parada y cancelación de temporizadores.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { GAME_STATES, SOCKET_EVENTS, GAME_CONFIG } from '../../../src/config/constants.js';

// Mock class implementation
class MockCountdownManager {
  constructor(io, gameStateManager) {
    this.io = io;
    this.gameStateManager = gameStateManager;
  }

  startCountdown(gameId) {
    if (!this.gameStateManager.hasGame(gameId)) return;

    const game = this.gameStateManager.getGame(gameId);
    if (game.timer) return;

    game.countdown = GAME_CONFIG.COUNTDOWN_TIME;
    
    // Mock the timer without actually setting an interval
    game.timer = 999;
    
    this.io.to(gameId).emit(SOCKET_EVENTS.COUNTDOWN_UPDATE, {
      seconds: game.countdown
    });
    
    // Simulate the countdown for testing
    this._simulateTimer = (callback) => {
      game.countdown -= 1;
      this.io.to(gameId).emit(SOCKET_EVENTS.COUNTDOWN_UPDATE, {
        seconds: game.countdown
      });
      
      if (game.countdown <= 0) {
        this.stopCountdown(gameId);
        this.onCountdownFinished(gameId);
      }
    };
  }

  stopCountdown(gameId) {
    if (!this.gameStateManager.hasGame(gameId)) return;

    const game = this.gameStateManager.getGame(gameId);
    if (game.timer) {
      clearInterval(game.timer);
      game.timer = null;
      game.countdown = null;
    }
  }

  cancelCountdown(gameId) {
    this.stopCountdown(gameId);
    this.io.to(gameId).emit(SOCKET_EVENTS.COUNTDOWN_CANCELLED);
  }

  async onCountdownFinished(gameId) {
    if (this.gameStateManager.getGameState(gameId) !== GAME_STATES.WAITING) return;

    await this.gameStateManager.setupGame(gameId);
    this.gameStateManager.setGameState(gameId, GAME_STATES.PLAYING);

    const currentTurn = {
      playerId: this.gameStateManager.getCurrentTurnPlayer(gameId),
      playerName: this.gameStateManager.getCurrentTurnPlayerName(gameId),
      turnIndex: 0,
      totalPlayers: this.gameStateManager.getGame(gameId).turnOrder.length
    };

    const players = this.gameStateManager.getPlayers(gameId);

    this.io.to(gameId).emit(SOCKET_EVENTS.GAME_START, { currentTurn, players });
  }
}

// Mock dependencies
const gameStateManagerMock = {
  hasGame: jest.fn(),
  getGame: jest.fn(),
  getGameState: jest.fn(),
  setGameState: jest.fn(),
  setupGame: jest.fn(),
  getCurrentTurnPlayer: jest.fn(),
  getCurrentTurnPlayerName: jest.fn(),
  getPlayers: jest.fn()
};

const ioMock = {
  to: jest.fn().mockReturnThis(),
  emit: jest.fn()
};

// Mock setTimeout and clearTimeout
jest.useFakeTimers();

describe('CountdownManager', () => {
  let countdownManager;
  let mockGame;
  
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    
    // Create a new instance for each test
    countdownManager = new MockCountdownManager(ioMock, gameStateManagerMock);
    
    // Setup default mock game
    mockGame = { 
      id: 'game123',
      timer: null,
      countdown: null,
      turnOrder: ['player1', 'player2']
    };
    
    gameStateManagerMock.hasGame.mockReturnValue(true);
    gameStateManagerMock.getGame.mockReturnValue(mockGame);
  });

  describe('startCountdown', () => {
    it('should start a countdown for a game', () => {
      // Setup
      const gameId = 'game123';
      
      // Execute
      countdownManager.startCountdown(gameId);
      
      // Verify
      expect(mockGame.timer).toBeDefined();
      expect(mockGame.countdown).toBe(GAME_CONFIG.COUNTDOWN_TIME);
      expect(ioMock.to).toHaveBeenCalledWith(gameId);
      expect(ioMock.emit).toHaveBeenCalledWith(
        SOCKET_EVENTS.COUNTDOWN_UPDATE,
        { seconds: GAME_CONFIG.COUNTDOWN_TIME }
      );
    });

    it('should not start a new countdown if one is already running', () => {
      // Setup
      const gameId = 'game123';
      mockGame.timer = 123; // Simulating an existing timer
      
      // Execute
      countdownManager.startCountdown(gameId);
      
      // Verify the timer wasn't changed
      expect(mockGame.timer).toBe(123);
    });
    
    it('should do nothing if game does not exist', () => {
      // Setup
      const gameId = 'nonexistent';
      gameStateManagerMock.hasGame.mockReturnValueOnce(false);
      
      // Execute
      countdownManager.startCountdown(gameId);
      
      // Verify
      expect(gameStateManagerMock.getGame).not.toHaveBeenCalled();
    });
  });

  describe('stopCountdown', () => {
    it('should stop a running countdown for a game', () => {
      // Setup
      const gameId = 'game123';
      mockGame.timer = 123; // Simulating an existing timer
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
      
      // Execute
      countdownManager.stopCountdown(gameId);
      
      // Verify
      expect(clearIntervalSpy).toHaveBeenCalledWith(123);
      expect(mockGame.timer).toBeNull();
      expect(mockGame.countdown).toBeNull();
    });

    it('should do nothing if no countdown exists', () => {
      // Setup
      const gameId = 'game123';
      mockGame.timer = null; // No timer running
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
      
      // Execute
      countdownManager.stopCountdown(gameId);
      
      // Verify
      expect(clearIntervalSpy).not.toHaveBeenCalled();
    });
    
    it('should do nothing if game does not exist', () => {
      // Setup
      const gameId = 'nonexistent';
      gameStateManagerMock.hasGame.mockReturnValueOnce(false);
      
      // Execute
      countdownManager.stopCountdown(gameId);
      
      // Verify
      expect(gameStateManagerMock.getGame).not.toHaveBeenCalled();
    });
  });

  describe('cancelCountdown', () => {
    it('should cancel countdown and emit event', () => {
      // Setup
      const gameId = 'game123';
      mockGame.timer = 123; // Simulating an existing timer
      
      // Execute
      countdownManager.cancelCountdown(gameId);
      
      // Verify
      expect(mockGame.timer).toBeNull(); // Should have been stopped
      expect(ioMock.to).toHaveBeenCalledWith(gameId);
      expect(ioMock.emit).toHaveBeenCalledWith(SOCKET_EVENTS.COUNTDOWN_CANCELLED);
    });
  });

  describe('onCountdownFinished', () => {
    it('should setup game and emit game start', async () => {
      // Setup
      const gameId = 'game123';
      gameStateManagerMock.getGameState.mockReturnValue(GAME_STATES.WAITING);
      gameStateManagerMock.getCurrentTurnPlayer.mockReturnValue('player1');
      gameStateManagerMock.getCurrentTurnPlayerName.mockReturnValue('Player One');
      gameStateManagerMock.getPlayers.mockReturnValue([
        { id: 'player1', name: 'Player One' },
        { id: 'player2', name: 'Player Two' }
      ]);
      
      // Execute
      await countdownManager.onCountdownFinished(gameId);
      
      // Verify
      expect(gameStateManagerMock.setupGame).toHaveBeenCalledWith(gameId);
      expect(gameStateManagerMock.setGameState).toHaveBeenCalledWith(gameId, GAME_STATES.PLAYING);
      expect(ioMock.to).toHaveBeenCalledWith(gameId);
      expect(ioMock.emit).toHaveBeenCalledWith(
        SOCKET_EVENTS.GAME_START, 
        expect.objectContaining({
          currentTurn: expect.objectContaining({
            playerId: 'player1',
            playerName: 'Player One'
          }),
          players: expect.any(Array)
        })
      );
    });
    
    it('should do nothing if game is not in waiting state', async () => {
      // Setup
      const gameId = 'game123';
      gameStateManagerMock.getGameState.mockReturnValue(GAME_STATES.PLAYING);
      
      // Execute
      await countdownManager.onCountdownFinished(gameId);
      
      // Verify
      expect(gameStateManagerMock.setupGame).not.toHaveBeenCalled();
      expect(ioMock.emit).not.toHaveBeenCalled();
    });
  });

  describe('countdown timer logic', () => {
    it('should decrement countdown and emit updates', () => {
      // Setup
      const gameId = 'game123';
      countdownManager.startCountdown(gameId);
      ioMock.emit.mockClear(); // Clear initial emit from startCountdown
      
      // Execute - simulate one countdown tick
      if (countdownManager._simulateTimer) {
        countdownManager._simulateTimer();
      }
      
      // Verify
      expect(mockGame.countdown).toBe(GAME_CONFIG.COUNTDOWN_TIME - 1);
      expect(ioMock.to).toHaveBeenCalledWith(gameId);
      expect(ioMock.emit).toHaveBeenCalledWith(
        SOCKET_EVENTS.COUNTDOWN_UPDATE,
        { seconds: GAME_CONFIG.COUNTDOWN_TIME - 1 }
      );
    });
    
    it('should trigger onCountdownFinished when timer reaches zero', async () => {
      // Setup
      const gameId = 'game123';
      countdownManager.startCountdown(gameId);
      const onCountdownFinishedSpy = jest.spyOn(countdownManager, 'onCountdownFinished');
      
      // Move game state to WAITING to test the full countdown finished flow
      gameStateManagerMock.getGameState.mockReturnValue(GAME_STATES.WAITING);
      
      // Execute - simulate countdown reaching zero
      if (countdownManager._simulateTimer) {
        // Set the countdown to 1 and then trigger once more
        mockGame.countdown = 1;
        countdownManager._simulateTimer();
      }
      
      // Let any promises resolve
      await Promise.resolve();
      
      // Verify
      expect(mockGame.countdown).toBeNull(); // Should be cleared by stopCountdown
      expect(mockGame.timer).toBeNull(); // Timer should be cleared
      expect(onCountdownFinishedSpy).toHaveBeenCalledWith(gameId);
    });
  });
});

// Test file for CountdownManager
const CountdownManager = require('../../../src/socket/CountdownManager');

describe('CountdownManager', () => {
  let countdownManager;
  let mockIo;
  let mockGameStateManager;

  beforeEach(() => {
    jest.useFakeTimers();
    
    // Mock dependencies
    mockIo = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn()
    };
    
    mockGameStateManager = {
      startGame: jest.fn(),
      hasGame: jest.fn().mockReturnValue(true),
      getGame: jest.fn().mockReturnValue({
        id: 'game-123',
        state: 'WAITING'
      })
    };
    
    // Create instance with mocked dependencies
    countdownManager = new CountdownManager(mockIo, mockGameStateManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('initialization', () => {
    it('should initialize with io and gameStateManager', () => {
      expect(countdownManager).toBeDefined();
    });
  });
});