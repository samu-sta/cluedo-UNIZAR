const COUNTDOWN_TIME = 10;
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

        this.io.to(gameId).emit('countdownUpdate', {
          seconds: game.countdown
        });

        if (game.countdown <= 0) {
          this.stopCountdown(gameId);
          await this.onCountdownFinished(gameId);
          this.gameStateManager.setGameState(gameId, 'playing');
          this.io.to(gameId).emit('gameStart');
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
    this.io.to(gameId).emit('countdownCancelled');
  }

  async onCountdownFinished(gameId) {
    if (this.gameStateManager.getGameState(gameId) !== 'waiting') return;

    await this.gameStateManager.setupGame(gameId);
    this.gameStateManager.setGameState(gameId, 'playing');

    this.io.to(gameId).emit('gameStart');
  }
}