/**
 * Este archivo centraliza todos los mocks necesarios para las pruebas
 * Evita problemas con las variables fuera de ámbito en jest.mock
 */

// Mock para Game Service
export const gameServiceMock = {
  hasGame: jest.fn().mockReturnValue(true),
  getGame: jest.fn().mockReturnValue({}),
  prepareGameResponse: jest.fn().mockResolvedValue({}),
  getGames: jest.fn().mockReturnValue([]),
  deleteGame: jest.fn().mockReturnValue(true),
  getAvailableGames: jest.fn().mockReturnValue([]),
  getRandomGame: jest.fn().mockReturnValue({ id: 'random-game-id' }),
  getActiveGamesCount: jest.fn().mockReturnValue(1),
  initGame: jest.fn(),
  setGameState: jest.fn(),
  getGameState: jest.fn().mockReturnValue('waiting'),
  removeGame: jest.fn(),
  getAllGames: jest.fn().mockReturnValue(new Map())
};

// Mock para Card Service
export const cardServiceMock = {
  initializeDeck: jest.fn().mockReturnValue({ 
    cards: [
      { type: 'character', value: 'Mrs. White' },
      { type: 'weapon', value: 'Rope' },
      { type: 'room', value: 'Kitchen' }
    ] 
  }),
  dealCards: jest.fn().mockReturnValue(true),
  getPlayerCards: jest.fn().mockReturnValue([]),
  checkCard: jest.fn().mockReturnValue(null),
  getSolution: jest.fn().mockReturnValue({
    suspect: 'Colonel Mustard',
    weapon: 'Knife',
    room: 'Kitchen'
  }),
  getAllCards: jest.fn().mockResolvedValue({
    characters: [{ name: 'Colonel Mustard' }],
    weapons: [{ name: 'Knife' }],
    rooms: [{ name: 'Kitchen' }],
    allCards: [
      { name: 'Colonel Mustard', type: 'character' },
      { name: 'Knife', type: 'weapon' },
      { name: 'Kitchen', type: 'room' }
    ]
  }),
  distributeCardsToPlayers: jest.fn().mockReturnValue({
    playerCards: { player1: [], player2: [] },
    leftoverCards: []
  }),
  selectGameSolution: jest.fn().mockReturnValue({
    character: { name: 'Colonel Mustard' },
    weapon: { name: 'Knife' },
    room: { name: 'Kitchen' },
    remainingCards: []
  }),
  assignCharactersToPlayers: jest.fn().mockResolvedValue(true),
  distributeCharacters: jest.fn(),
  getLeftoverCards: jest.fn().mockReturnValue([]),
  redistributePlayerCards: jest.fn(),
  selectSolution: jest.fn(),
  getPlayerCardForType: jest.fn(),
};

// Mock para Turn Service
export const turnServiceMock = {
  setupPlayerTurns: jest.fn(),
  getCurrentTurnPlayer: jest.fn().mockReturnValue('user123'),
  getCurrentTurnPlayerName: jest.fn().mockReturnValue('Player 1'),
  isPlayerTurn: jest.fn().mockReturnValue(true),
  nextTurn: jest.fn().mockReturnValue({ success: true, playerId: 'player-2' }),
  removePlayerFromTurnOrder: jest.fn(),
  updatePlayerTurnOrder: jest.fn()
};

// Mock para Player Service
export const playerServiceMock = {
  addPlayer: jest.fn().mockReturnValue(true),
  removePlayer: jest.fn().mockReturnValue(true),
  getPlayers: jest.fn().mockReturnValue([
    { id: 'player-1', username: 'Player 1' },
    { id: 'player-2', username: 'Player 2' }
  ]),
  getPlayerCount: jest.fn().mockReturnValue(2),
  setupPlayerPositions: jest.fn().mockReturnValue(true),
  canPlayerMoveToPosition: jest.fn().mockReturnValue(true),
  movePlayer: jest.fn().mockReturnValue(true),
  getRoomForPosition: jest.fn(),
  isPositionInRoom: jest.fn().mockReturnValue(true),
  getPlayerRoom: jest.fn(),
  isInRoom: jest.fn().mockReturnValue(true)
};

// Mock para Board Service
export const boardServiceMock = {
  rollDice: jest.fn().mockReturnValue({
    dice1: 3,
    dice2: 4,
    total: 7
  }),
  getCanRollDice: jest.fn().mockReturnValue(true),
  getValidMoves: jest.fn().mockReturnValue([]),
  movePlayer: jest.fn().mockReturnValue(true),
  getPlayerRoom: jest.fn().mockReturnValue(null)
};

// Mock para Suggestion Service
export const suggestionServiceMock = {
  validateSuggestion: jest.fn().mockReturnValue({ 
    valid: true,
    playerRoom: { name: 'Kitchen' }
  }),
  makeSuggestion: jest.fn().mockReturnValue({ 
    success: true
  }),
  makeAccusation: jest.fn().mockReturnValue({
    success: true,
    isCorrect: true
  }),
  showCard: jest.fn().mockReturnValue({
    success: true
  }),
  checkAccusation: jest.fn().mockReturnValue(true),
  setCurrentSuggestion: jest.fn()
};

// Mock para Game Controller Service
export const gameControllerServiceMock = {
  prepareGameResponse: jest.fn().mockResolvedValue({
    success: true,
    gameId: 'game-1',
    token: 'fake-socket-token'
  })
};

// Mock para Game State Manager
export const gameStateManagerMock = {
  registerGame: jest.fn().mockReturnValue(true),
  gameExists: jest.fn().mockReturnValue(true),
  hasGame: jest.fn().mockReturnValue(true),
  getGame: jest.fn().mockReturnValue({
    id: 'game-1',
    players: new Map([
      ['player-1', { id: 'player-1', username: 'Player 1', position: { row: 5, column: 5 }, cards: [] }],
      ['player-2', { id: 'player-2', username: 'Player 2', position: { row: 8, column: 8 }, cards: [] }]
    ]),
    state: 'waiting',
    host: 'player-1',
    currentTurnIndex: 0,
    currentTurnPlayer: 'player-1',
    turnOrder: ['player-1', 'player-2'],
    canRollDice: true,
    hasMoved: false,
    leftoverCards: [],
    solution: {
      character: { name: 'Colonel Mustard' },
      weapon: { name: 'Knife' },
      room: { name: 'Kitchen' }
    }
  }),
  addPlayer: jest.fn().mockResolvedValue(true),
  addPlayerToGame: jest.fn().mockReturnValue(true),
  removePlayer: jest.fn().mockReturnValue(true),
  removeGame: jest.fn().mockReturnValue(true),
  getPlayers: jest.fn().mockReturnValue([
    { id: 'player-1', username: 'Player 1', position: { row: 5, column: 5 }, cards: [] },
    { id: 'player-2', username: 'Player 2', position: { row: 8, column: 8 }, cards: [] }
  ]),
  getPlayerCount: jest.fn().mockReturnValue(2),
  setGameState: jest.fn(),
  getGameState: jest.fn().mockReturnValue('waiting'),
  setupGame: jest.fn().mockResolvedValue(true),
  getPlayerCards: jest.fn().mockReturnValue([]),
  getSolution: jest.fn().mockReturnValue({
    character: { name: 'Colonel Mustard' },
    weapon: { name: 'Knife' },
    room: { name: 'Kitchen' }
  }),
  getLeftoverCards: jest.fn().mockReturnValue([]),
  getCurrentTurnPlayer: jest.fn().mockReturnValue('player-1'),
  getCurrentTurnPlayerName: jest.fn().mockReturnValue('Player 1'),
  isPlayerTurn: jest.fn().mockReturnValue(true),
  nextTurn: jest.fn().mockReturnValue({ success: true, playerId: 'player-2' }),
  rollDice: jest.fn().mockReturnValue({ dice1: 3, dice2: 3, total: 6 }),
  getCanRollDice: jest.fn().mockReturnValue(true),
  getValidMoves: jest.fn().mockReturnValue([]),
  movePlayer: jest.fn().mockReturnValue(true),
  handlePlayerLeaveInGame: jest.fn().mockReturnValue({ success: true }),
  redistributePlayerCards: jest.fn(),
  removePlayerInGame: jest.fn().mockReturnValue({ success: true }),
  makeAccusation: jest.fn().mockReturnValue({ success: true, isCorrect: true }),
  getPlayerRoom: jest.fn().mockReturnValue(null),
  validateSuggestion: jest.fn().mockReturnValue({ valid: true, playerRoom: { name: 'Kitchen' } }),
  setCurrentSuggestion: jest.fn(),
  showCard: jest.fn().mockReturnValue({ success: true }),
  getAvailableGames: jest.fn().mockReturnValue(['game-1', 'game-2']),
  deleteGame: jest.fn().mockReturnValue(true),
  initGame: jest.fn().mockResolvedValue(true)
};

// Mock para Countdown Manager
export const countdownManagerMock = {
  startCountdown: jest.fn(),
  stopCountdown: jest.fn(),
  cancelCountdown: jest.fn(),
  onCountdownFinished: jest.fn()
};

// Mocks para utilidades
export const boardUtilsMock = {
  isWall: jest.fn().mockReturnValue(false),
  createDoorPositionsMap: jest.fn().mockReturnValue(new Map()),
  findValidMoves: jest.fn().mockReturnValue([]),
};

export const gameUtilsMock = {
  shuffleArray: jest.fn(arr => arr),
  getRandomItem: jest.fn(arr => arr[0]),
  getCharacters: jest.fn().mockReturnValue([
    { name: 'Colonel Mustard', color: 'yellow' },
    { name: 'Mrs. White', color: 'white' }
  ]),
  getCards: jest.fn().mockResolvedValue([]),
  distributeCards: jest.fn().mockReturnValue({
    playerCards: {},
    leftoverCards: []
  }),
  selectSolution: jest.fn().mockReturnValue({
    character: { name: 'Colonel Mustard' },
    weapon: { name: 'Knife' },
    room: { name: 'Kitchen' },
    remainingCards: []
  }),
  checkAccusation: jest.fn().mockReturnValue(true),
  getRandomCard: jest.fn(arr => arr[0]),
  getGame: jest.fn().mockResolvedValue({})
};

export const arrayUtilsMock = {
  shuffleArray: jest.fn(arr => arr),
  getRandomItem: jest.fn(arr => arr[0]),
};

export const authUtilsMock = {
  createToken: jest.fn().mockReturnValue('fake-jwt-token'),
  verifyToken: jest.fn().mockReturnValue({ id: 'user-id' }),
  generateSocketToken: jest.fn().mockReturnValue('fake-socket-token'),
  default: {
    createToken: jest.fn().mockReturnValue('fake-jwt-token'),
    verifyToken: jest.fn().mockReturnValue({ id: 'user-id' }),
    generateSocketToken: jest.fn().mockReturnValue('fake-socket-token')
  }
};