export const GAME_STATES = {
  WAITING: 'waiting',
  PLAYING: 'playing',
  COUNTDOWN: 'countdown',
  FINISHED: 'finished',
  ENDED: 'ended'
};

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  MESSAGE: 'message',
  PLAYER_JOINED: 'playerJoined',
  PLAYER_LEFT: 'playerLeft',
  PLAYER_LIST: 'playerList',
  PLAYER_READY: 'playerReady',
  GAME_START: 'gameStart',
  GAME_END: 'gameEnd',
  COUNTDOWN_UPDATE: 'countdownUpdate',
  COUNTDOWN_CANCELLED: 'countdownCancelled',
  TURN_UPDATE: 'turnUpdate',
  PASS_TURN: 'passTurn',
  DICE_ROLLED: 'diceRolled',
  ROLL_DICE: 'rollDice',
  MOVE_PLAYER: 'movePlayer',
  PLAYERS_MOVED: 'playersMoved',
  MOVE_SUCCESS: 'moveSuccess',
  REQUEST_CARDS: 'requestCards',
  PLAYER_CARDS: 'playerCards',
  MAKE_SUGGESTION: 'makeSuggestion',
  SUGGESTION_MADE: 'suggestionMade',
  CURRENT_SUGGESTION: 'currentSuggestion',
  SHOW_CARD: 'showCard',
  CARD_SHOWN: 'cardShown',
  MAKE_ACCUSATION: 'makeAccusation',
  INCORRECT_ACCUSATION: 'incorrectAccusation',
  ERROR: 'error'
};