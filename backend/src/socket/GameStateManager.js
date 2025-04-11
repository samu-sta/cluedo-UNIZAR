import { getCards, getBoard, getCharacters, getGame } from "../utils/game.js";
import { createDoorPositionsMap, findValidMoves } from "../utils/board.js";
import jwt from 'jsonwebtoken';
import { GAME_STATES } from '../config/constants.js';
import MESSAGES from '../messages/messages.js';

class GameStateManager {
  constructor() {
    this.games = new Map();
  }

  /**
   * Registra una nueva partida HTTP y la inicializa
   * @param {string} gameId - ID de la partida
   * @param {Object} user - Datos del usuario creador
   */
  registerGame(gameId, user) {
    this.initGame(gameId);

    console.log('Juegos activos: ', this.games.size);

    this.addPlayer(gameId, user.id, {
      username: user.username
    });
  }

  /**
   * Verifica si una partida existe
   * @param {string} gameId - ID de la partida
   * @returns {boolean} - Verdadero si existe
   */
  gameExists(gameId) {
    return this.hasGame(gameId);
  }

  /**
   * Añade un jugador a una partida existente (para API HTTP)
   * @param {string} gameId - ID de la partida 
   * @param {Object} user - Datos del usuario
   * @returns {boolean} - True si el jugador fue añadido, false si ya estaba
   */
  addPlayerToGame(gameId, user) {
    return this.addPlayer(gameId, user.id, { username: user.username });
  }

  /**
   * Elimina una partida
   * @param {string} gameId - ID de la partida
   * @returns {boolean} - True si la partida fue eliminada
   */
  deleteGame(gameId) {
    return this.removeGame(gameId);
  }

  async initGame(gameId) {
    let board = null;
    try {
      board = await getBoard();
    }
    catch (error) {
      console.log(error);
    }

    if (!this.games.has(gameId)) {
      this.games.set(gameId, {
        players: new Map(),
        timer: null,
        countdown: null,
        state: GAME_STATES.WAITING,
        board,
        solution: null,
        playerCards: null,
        leftoverCards: null,
        diceResult: null
      });
    }
    return this.games.get(gameId);
  }

  getGame(gameId) {
    return this.games.get(gameId);
  }

  hasGame(gameId) {
    return this.games.has(gameId);
  }

  async addPlayer(gameId, userId, playerData) {
    const game = await this.initGame(gameId);
    if (!game.players.has(userId)) {
      game.players.set(userId, playerData);
      return true;
    }
    return false;
  }

  removePlayer(gameId, userId) {
    if (!this.hasGame(gameId)) return false;

    const game = this.getGame(gameId);
    const wasRemoved = game.players.delete(userId);

    if (game.players.size === 0) {
      this.removeGame(gameId);
    }

    return wasRemoved;
  }

  removeGame(gameId) {
    return this.games.delete(gameId);
  }

  getPlayers(gameId) {
    if (!this.hasGame(gameId)) return [];
    return Array.from(this.getGame(gameId).players.values());
  }

  getPlayerCount(gameId) {
    if (!this.hasGame(gameId)) return 0;
    return this.getGame(gameId).players.size;
  }

  setGameState(gameId, state) {
    if (!this.hasGame(gameId)) return;
    this.getGame(gameId).state = state;
  }

  getGameState(gameId) {
    if (!this.hasGame(gameId)) return GAME_STATES.WAITING;
    return this.getGame(gameId).state;
  }

  async setupGame(gameId) {
    if (!this.hasGame(gameId)) return false;

    const allCards = await this.getAllCards();
    const solution = this.selectSolution(allCards);
    const playerCards = this.distributeCards(solution.remainingCards, gameId);

    const game = this.getGame(gameId);
    game.solution = solution;
    game.playerCards = playerCards;
    game.canRollDice = true;
    game.hasMoved = false;
    game.hasSuggested = false;
    game.currentSuggestion = null;
    game.suggestionResponses = [];

    this.setupPlayerPositions(gameId);
    await this.setPlayerCharacters(gameId);
    this.setupPlayerTurns(gameId);
    return true;
  }

  async getAllCards() {
    const cards = await getCards();
    const characters = cards.filter(card => card.type === 'character');
    const weapons = cards.filter(card => card.type === 'weapon');
    const rooms = cards.filter(card => card.type === 'room');
    return { characters, weapons, rooms, allCards: [...characters, ...weapons, ...rooms] };
  }

  selectSolution(allCards) {
    const character = this.getRandomCard(allCards.characters);
    const weapon = this.getRandomCard(allCards.weapons);
    const room = this.getRandomCard(allCards.rooms);

    const remainingCards = allCards.allCards.filter(card =>
      card.name !== character.name &&
      card.name !== weapon.name &&
      card.name !== room.name
    );

    return {
      character,
      weapon,
      room,
      remainingCards
    };
  }

  getRandomCard(cards) {
    const randomIndex = Math.floor(Math.random() * cards.length);
    return cards[randomIndex];
  }

  distributeCards(cards, gameId) {
    const players = Array.from(this.getGame(gameId).players.keys());
    const playerCount = players.length;

    const shuffledCards = this.shuffleArray([...cards]);
    const playerCards = {};
    const leftoverCards = [];

    players.forEach(playerId => {
      playerCards[playerId] = [];
    });

    const cardsPerPlayer = Math.floor(shuffledCards.length / playerCount);

    shuffledCards.forEach((card, index) => {
      if (index < cardsPerPlayer * playerCount) {
        const playerIndex = Math.floor(index / cardsPerPlayer);
        const playerId = players[playerIndex];
        playerCards[playerId].push(card);
      } else {
        leftoverCards.push(card);
      }
    });

    const game = this.getGame(gameId);
    game.leftoverCards = leftoverCards;

    return playerCards;
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  getPlayerCards(gameId, userId) {
    if (!this.hasGame(gameId)) return [];

    const game = this.getGame(gameId);
    return game.playerCards?.[userId] || [];
  }

  getSolution(gameId) {
    if (!this.hasGame(gameId)) return null;

    const game = this.getGame(gameId);
    return game.solution ? {
      character: game.solution.character,
      weapon: game.solution.weapon,
      room: game.solution.room
    } : null;
  }

  getLeftoverCards(gameId) {
    if (!this.hasGame(gameId)) return [];

    const game = this.getGame(gameId);
    return game.leftoverCards || [];
  }

  setupPlayerTurns(gameId) {
    const game = this.getGame(gameId);

    const playerIds = [...game.players.keys()];
    this.shuffleArray(playerIds);

    game.turnOrder = playerIds;
    game.currentTurnIndex = 0;
    game.currentTurnPlayer = playerIds[0];
  }

  getCurrentTurnPlayer(gameId) {
    const game = this.getGame(gameId);
    if (!game || game.turnOrder.length === 0) return null;
    return game.currentTurnPlayer;
  }

  getCurrentTurnPlayerName(gameId) {
    const game = this.getGame(gameId);
    if (!game || !game.currentTurnPlayer) return null;

    const player = game.players.get(game.currentTurnPlayer);
    return player ? player.username : null;
  }

  isPlayerTurn(gameId, playerId) {
    return this.getCurrentTurnPlayer(gameId) === playerId;
  }

  nextTurn(gameId) {
    const game = this.getGame(gameId);
    if (!game || !game.turnOrder || game.turnOrder.length === 0) return null;

    game.currentTurnIndex = (game.currentTurnIndex + 1) % game.turnOrder.length;
    game.currentTurnPlayer = game.turnOrder[game.currentTurnIndex];

    game.canRollDice = true;
    game.hasMoved = false;
    game.hasSuggested = false;

    return {
      playerId: game.currentTurnPlayer,
      playerName: this.getCurrentTurnPlayerName(gameId),
      turnIndex: game.currentTurnIndex,
      totalPlayers: game.turnOrder.length
    };
  }

  setupPlayerPositions(gameId) {
    const game = this.getGame(gameId);

    const startingPositions = [
      { row: 1, column: 7 },
      { row: 1, column: 13 },
      { row: 10, column: 18 },
      { row: 13, column: 1 },
      { row: 18, column: 7 },
      { row: 18, column: 13 }
    ];

    let posIndex = 0;
    const playerIds = [...game.players.keys()];

    playerIds.forEach(playerId => {
      game.players.get(playerId).position = startingPositions[posIndex++];
    });
  }

  async setPlayerCharacters(gameId) {
    const game = this.getGame(gameId);
    if (!game) return;

    try {
      const characters = await getCharacters();
      this.assingCharactersToPlayers(game, characters);
    }
    catch (error) {
      console.log(error);
    }
  }

  assingCharactersToPlayers(game, characters) {
    const availableCharacters = [...characters];
    const playerIds = [...game.players.keys()];

    playerIds.forEach(playerId => {
      const randomIndex = Math.floor(Math.random() * availableCharacters.length);
      const character = availableCharacters[randomIndex];
      availableCharacters.splice(randomIndex, 1);

      game.players.get(playerId).character = character;
    });
  }

  rollDice(gameId) {
    if (!this.hasGame(gameId)) return null;

    const game = this.getGame(gameId);
    const diceResult1 = Math.floor(Math.random() * 6) + 1;
    const diceResult2 = Math.floor(Math.random() * 6) + 1;
    game.diceResult = diceResult1 + diceResult2;
    game.canRollDice = false;

    return {
      diceResult1,
      diceResult2
    }
  }

  getCanRollDice(gameId) {
    if (!this.hasGame(gameId)) return null;

    const game = this.getGame(gameId);
    return game.canRollDice;
  }

  getValidMoves(gameId, playerId) {
    if (!this.hasGame(gameId) || !this.isPlayerTurn(gameId, playerId)) {
      return [];
    }

    const game = this.getGame(gameId);
    const player = game.players.get(playerId);

    if (!player || !game.diceResult) {
      return [];
    }

    const { position } = player;
    const maxSteps = game.diceResult;
    const board = game.board;

    const doorPositions = createDoorPositionsMap(board);

    return findValidMoves(position, maxSteps, board, doorPositions);
  }

  movePlayer(gameId, playerId, targetPosition) {
    if (!this.hasGame(gameId) || !this.isPlayerTurn(gameId, playerId)) {
      return { success: false, message: MESSAGES.NOT_YOUR_TURN };
    }

    const game = this.getGame(gameId);
    const player = game.players.get(playerId);

    if (!player) {
      return { success: false, message: MESSAGES.PLAYER_NOT_FOUND };
    }

    // Verificar que el movimiento es válido
    const validMoves = this.getValidMoves(gameId, playerId);
    const isValidMove = validMoves.some(move =>
      move.row === targetPosition.row && move.column === targetPosition.column
    );

    if (!isValidMove) {
      return { success: false, message: MESSAGES.INVALID_MOVE };
    }

    // Encontrar el camino para animación
    const movePath = validMoves.find(move =>
      move.row === targetPosition.row && move.column === targetPosition.column
    ).path;

    // Actualizar posición del jugador
    player.position = targetPosition;
    game.hasMoved = true;

    // Movimiento exitoso
    return {
      success: true,
      path: movePath
    };
  }

  handlePlayerLeaveInGame(gameId, userId) {

    if (!this.hasGame(gameId) || this.getGameState(gameId) !== GAME_STATES.PLAYING) {
      return { success: false };
    }
    return this.removePlayerInGame(gameId, userId);
  }

  redistributePlayerCards(gameId, userId) {
    const game = this.getGame(gameId);
    const playerCards = this.getPlayerCards(gameId, userId);

    if (playerCards?.length) {
      game.leftoverCards = [...(game.leftoverCards || []), ...playerCards];
      delete game.playerCards?.[userId];
    }
  }

  removePlayerInGame(gameId, userId) {

    const game = this.getGame(gameId);

    const player = game.players.get(userId);
    const playerName = player?.username;
    const playerCards = this.getPlayerCards(gameId, userId);
    const isCurrentTurn = this.isPlayerTurn(gameId, userId);

    this.redistributePlayerCards(gameId, userId);
    this.removePlayer(gameId, userId);

    const nextTurnInfo = isCurrentTurn ? this.nextTurn(gameId) : null;

    const remainingPlayers = this.getPlayers(gameId);
    const shouldEndGame = remainingPlayers.length < 2;
    const winner = shouldEndGame && remainingPlayers.length === 1
      ? remainingPlayers[0].username
      : null;

    return {
      success: true,
      playerName,
      redistributedCards: playerCards || [],
      nextTurn: nextTurnInfo,
      shouldEndGame,
      winner,
      remainingPlayers,
      remainingPlayerCount: remainingPlayers.length,
      solution: shouldEndGame ? game.solution : null
    };
  }

  makeAccusation(gameId, playerId, accusation) {

    const validationResult = this.validateAccusationRequest(gameId, playerId);
    if (!validationResult) {
      return { success: false, message: validationResult.message };
    }

    const game = this.getGame(gameId);
    const solution = game.solution;

    const isCorrect = this.checkAccusation(accusation, solution);

    if (isCorrect) {
      return {
        success: true,
        isCorrect: true,
        winner: game.players.get(playerId).username,
        solution
      };
    }

    return this.handleIncorrectAccusation(gameId, playerId);
  }

  validateAccusationRequest(gameId, playerId) {
    return this.hasGame(gameId) && this.isPlayerTurn(gameId, playerId)
  }

  checkAccusation(accusation, solution) {
    return (
      accusation.character === solution.character.name &&
      accusation.weapon === solution.weapon.name &&
      accusation.room === solution.room.name
    );
  }

  handleIncorrectAccusation(gameId, playerId) {
    const result = this.removePlayerInGame(gameId, playerId, { revealSolution: true });

    if (!result.success) {
      return { success: false, message: MESSAGES.ACCUSATION_PROCESSING_ERROR };
    }

    return {
      success: true,
      isCorrect: false,
      eliminatedPlayer: result.playerName,
      shouldEndGame: result.shouldEndGame,
      winner: result.winner,
      remainingPlayers: result.remainingPlayerCount,
      solution: result.solution
    };
  }

  getPlayerRoom(gameId, playerId) {
    if (!this.hasGame(gameId)) return null;

    const game = this.getGame(gameId);
    const player = game.players.get(playerId);

    if (!player || !player.position) return null;

    const { row, column } = player.position;
    const board = game.board;

    for (const room of board.rooms) {
      const isInDoor = room.doors.some(door =>
        door.row === row && door.column === column
      );

      if (isInDoor) continue;

      if (this.isPositionInsideRoom(room, { row, column })) {
        return { roomName: room.name, room };
      }
    }

    return null;
  }

  isPositionInsideRoom(room, position) {

    let minRow = Infinity, maxRow = -Infinity;
    let minCol = Infinity, maxCol = -Infinity;

    room.walls.forEach(wall => {
      minRow = Math.min(minRow, wall.row);
      maxRow = Math.max(maxRow, wall.row);
      minCol = Math.min(minCol, wall.column);
      maxCol = Math.max(maxCol, wall.column);
    });

    room.doors.forEach(door => {
      minRow = Math.min(minRow, door.row);
      maxRow = Math.max(maxRow, door.row);
      minCol = Math.min(minCol, door.column);
      maxCol = Math.max(maxCol, door.column);
    });

    return (
      position.row > minRow &&
      position.row < maxRow &&
      position.column > minCol &&
      position.column < maxCol
    );
  }

  validateSuggestion(gameId, playerId, suggestion) {

    if (!this.hasGame(gameId)) {
      return this.createValidationError(MESSAGES.GAME_NOT_FOUND);
    }

    if (!this.isPlayerTurn(gameId, playerId)) {
      return this.createValidationError(MESSAGES.NOT_YOUR_TURN);
    }

    const game = this.getGame(gameId);

    if (game.canRollDice) {
      return this.createValidationError(MESSAGES.MUST_ROLL_DICE_FIRST);
    }

    if (!game.hasMoved) {
      return this.createValidationError(MESSAGES.MUST_MOVE_BEFORE_SUGGESTION);
    }

    if (game.hasSuggested) {
      return this.createValidationError(MESSAGES.ALREADY_MADE_SUGGESTION);
    }

    const playerRoom = this.getPlayerRoom(gameId, playerId);

    if (!playerRoom) {
      return this.createValidationError(MESSAGES.NOT_IN_ROOM);
    }

    if (playerRoom.roomName !== suggestion.room) {
      return this.createValidationError(
        `${MESSAGES.SUGGESTION_ROOM_MISMATCH} (${playerRoom.roomName})`
      );
    }

    return {
      valid: true,
      playerRoom
    };
  }

  createValidationError(message) {
    return { valid: false, message };
  }

  setCurrentSuggestion(gameId, suggestion) {
    const game = this.getGame(gameId);
    game.currentSuggestion = suggestion;
    game.suggestionResponses = [];
  }

  showCard(gameId, playerId, card) {
    const validationResult = this.validateShowCardRequest(gameId, playerId, card);
    if (!validationResult.valid) {
      return { success: false, message: validationResult.message };
    }

    const game = this.getGame(gameId);
    const player = game.players.get(playerId);

    this.registerCardResponse(game, player.username, card);

    return {
      success: true,
      suggestionMaker: game.currentSuggestion.username,
      cardShown: card
    };
  }

  validateShowCardRequest(gameId, playerId, card) {
    if (!this.hasGame(gameId)) {
      return { valid: false, message: MESSAGES.GAME_NOT_FOUND };
    }

    const game = this.getGame(gameId);

    if (!game.currentSuggestion) {
      return { valid: false, message: MESSAGES.NO_ACTIVE_SUGGESTION };
    }

    if (!card) {
      return { valid: true };
    }

    const playerCards = this.getPlayerCards(gameId, playerId);
    const hasCard = playerCards.some(c =>
      c.name === card.name && c.type === card.type
    );

    if (!hasCard) {
      return { valid: false, message: MESSAGES.CARD_NOT_FOUND };
    }

    return { valid: true };
  }

  registerCardResponse(game, username, card) {
    if (!game.suggestionResponses) {
      game.suggestionResponses = [];
    }

    game.suggestionResponses.push({
      username,
      card: card || null
    });
  }
}

export const gameStateManager = new GameStateManager();