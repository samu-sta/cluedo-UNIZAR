import { GAME_STATES } from '../config/constants.js';
import { SOCKET_EVENTS } from '../config/constants.js';

const COUNTDOWN_TIME = 3;
const COUNT_INTERVAL = 1000;

export default class CountdownManager {
  constructor(io, gameStateManager) {
    this.io = io;
    this.gameStateManager = gameStateManager;
  }

  startCountdown(gameId) {
    if (!this.gameStateManager.hasGame(gameId)) return;

    const game = this.gameStateManager.getGame(gameId);

    if (game.timer) return;

    game.countdown = COUNTDOWN_TIME;

    game.timer = setInterval(async () => {
      try {
        game.countdown -= 1;

        this.io.to(gameId).emit(SOCKET_EVENTS.COUNTDOWN_UPDATE, {
          seconds: game.countdown
        });

        if (game.countdown <= 0) {
          this.stopCountdown(gameId);
          await this.onCountdownFinished(gameId);
          this.gameStateManager.setGameState(gameId, GAME_STATES.PLAYING);
          this.io.to(gameId).emit(SOCKET_EVENTS.GAME_START);
        }
      }
      catch (error) {
        console.log(error);
      }

    }, COUNT_INTERVAL);
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