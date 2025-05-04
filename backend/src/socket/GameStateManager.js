import { GAME_STATES, GAME_CONFIG } from '../config/constants.js';
import MESSAGES from '../messages/messages.js';
import { gameService } from '../services/GameService.js';
import { playerService } from '../services/PlayerService.js';
import { cardService } from '../services/CardService.js';
import { turnService } from '../services/TurnService.js';
import { boardService } from '../services/BoardService.js';
import { suggestionService } from '../services/SuggestionService.js';

/**
 * Administrador central del estado del juego que coordina los diferentes servicios
 */
export class GameStateManager {
  /**
   * Registra una nueva partida HTTP y la inicializa
   * @param {string} gameId - ID de la partida
   * @param {Object} user - Datos del usuario creador
   */
  registerGame(gameId, user) {
    gameService.initGame(gameId);

    console.log('Juegos activos: ', gameService.getActiveGamesCount());

    playerService.addPlayer(gameId, user.id, {
      username: user.username
    });
  }

  /**
   * Verifica si una partida existe
   * @param {string} gameId - ID de la partida
   * @returns {boolean} - Verdadero si existe
   */
  gameExists(gameId) {
    return gameService.hasGame(gameId);
  }

  /**
   * Añade un jugador a una partida existente (para API HTTP)
   * @param {string} gameId - ID de la partida 
   * @param {Object} user - Datos del usuario
   * @returns {boolean} - True si el jugador fue añadido, false si ya estaba
   */
  addPlayerToGame(gameId, user) {
    return playerService.addPlayer(gameId, user.id, { username: user.username });
  }

  /**
   * Elimina una partida
   * @param {string} gameId - ID de la partida
   * @returns {boolean} - True si la partida fue eliminada
   */
  deleteGame(gameId) {
    return gameService.removeGame(gameId);
  }

  /**
   * Inicializa una partida
   * @param {string} gameId - ID de la partida
   * @returns {Object} - Datos de la partida
   */
  async initGame(gameId) {
    return gameService.initGame(gameId);
  }

  /**
   * Obtiene los datos de una partida
   * @param {string} gameId - ID de la partida
   * @returns {Object} - Datos de la partida
   */
  getGame(gameId) {
    return gameService.getGame(gameId);
  }

  /**
   * Verifica si existe una partida
   * @param {string} gameId - ID de la partida
   * @returns {boolean} - True si existe
   */
  hasGame(gameId) {
    return gameService.hasGame(gameId);
  }

  /**
   * Añade un jugador a una partida
   * @param {string} gameId - ID de la partida
   * @param {string} userId - ID del jugador
   * @param {Object} playerData - Datos del jugador
   * @returns {boolean} - True si se añadió correctamente
   */
  async addPlayer(gameId, userId, playerData) {
    return await playerService.addPlayer(gameId, userId, playerData);
  }

  /**
   * Elimina un jugador de una partida
   * @param {string} gameId - ID de la partida
   * @param {string} userId - ID del jugador
   * @returns {boolean} - True si se eliminó correctamente
   */
  removePlayer(gameId, userId) {
    return playerService.removePlayer(gameId, userId);
  }

  /**
   * Elimina una partida
   * @param {string} gameId - ID de la partida
   * @returns {boolean} - True si se eliminó correctamente
   */
  removeGame(gameId) {
    return gameService.removeGame(gameId);
  }

  /**
   * Obtiene los jugadores de una partida
   * @param {string} gameId - ID de la partida
   * @returns {Array} - Lista de jugadores
   */
  getPlayers(gameId) {
    return playerService.getPlayers(gameId);
  }

  /**
   * Obtiene el número de jugadores de una partida
   * @param {string} gameId - ID de la partida
   * @returns {number} - Número de jugadores
   */
  getPlayerCount(gameId) {
    return playerService.getPlayerCount(gameId);
  }

  /**
   * Establece el estado de una partida
   * @param {string} gameId - ID de la partida
   * @param {string} state - Estado a establecer
   */
  setGameState(gameId, state) {
    gameService.setGameState(gameId, state);
  }

  /**
   * Obtiene el estado de una partida
   * @param {string} gameId - ID de la partida
   * @returns {string} - Estado de la partida
   */
  getGameState(gameId) {
    return gameService.getGameState(gameId);
  }

  /**
   * Configura una partida para iniciarla
   * @param {string} gameId - ID de la partida
   * @returns {boolean} - True si se configuró correctamente
   */
  async setupGame(gameId) {
    if (!this.hasGame(gameId)) return false;

    const allCards = await cardService.getAllCards();
    const solution = cardService.selectGameSolution(allCards);
    const playerIds = Array.from(this.getGame(gameId).players.keys());
    const { playerCards, leftoverCards } = cardService.distributeCardsToPlayers(solution.remainingCards, playerIds);

    const game = this.getGame(gameId);
    game.solution = solution;
    game.playerCards = playerCards;
    game.leftoverCards = leftoverCards;
    game.canRollDice = true;
    game.hasMoved = false;
    game.hasSuggested = false;
    game.currentSuggestion = null;
    game.suggestionResponses = [];

    playerService.setupPlayerPositions(gameId);
    await cardService.assignCharactersToPlayers(gameId);
    turnService.setupPlayerTurns(gameId);
    return true;
  }

  /**
   * Obtiene las cartas de un jugador
   * @param {string} gameId - ID de la partida
   * @param {string} userId - ID del jugador
   * @returns {Array} - Lista de cartas
   */
  getPlayerCards(gameId, userId) {
    return cardService.getPlayerCards(gameId, userId);
  }

  /**
   * Obtiene la solución de una partida
   * @param {string} gameId - ID de la partida
   * @returns {Object} - Solución
   */
  getSolution(gameId) {
    return cardService.getSolution(gameId);
  }

  /**
   * Obtiene las cartas sobrantes
   * @param {string} gameId - ID de la partida
   * @returns {Array} - Lista de cartas sobrantes
   */
  getLeftoverCards(gameId) {
    return cardService.getLeftoverCards(gameId);
  }

  /**
   * Obtiene el jugador actual
   * @param {string} gameId - ID de la partida
   * @returns {string} - ID del jugador actual
   */
  getCurrentTurnPlayer(gameId) {
    return turnService.getCurrentTurnPlayer(gameId);
  }

  /**
   * Obtiene el nombre del jugador actual
   * @param {string} gameId - ID de la partida
   * @returns {string} - Nombre del jugador actual
   */
  getCurrentTurnPlayerName(gameId) {
    return turnService.getCurrentTurnPlayerName(gameId);
  }

  /**
   * Verifica si es el turno de un jugador
   * @param {string} gameId - ID de la partida
   * @param {string} playerId - ID del jugador
   * @returns {boolean} - True si es su turno
   */
  isPlayerTurn(gameId, playerId) {
    return turnService.isPlayerTurn(gameId, playerId);
  }

  /**
   * Verifica si un jugador está en una partida
   * @param {string} gameId - ID de la partida
   * @param {string} userId - ID del jugador
   * @returns {boolean} - True si está en la partida
   */
  isPlayerInGame(gameId, userId) {
    return playerService.isPlayerInGame(gameId, userId);
  }

  /**
   * Pasa al siguiente turno
   * @param {string} gameId - ID de la partida
   * @returns {Object} - Información del turno
   */
  nextTurn(gameId) {
    return turnService.nextTurn(gameId);
  }

  /**
   * Lanza los dados
   * @param {string} gameId - ID de la partida
   * @returns {Object} - Resultado de los dados
   */
  rollDice(gameId) {
    return boardService.rollDice(gameId);
  }

  /**
   * Verifica si se pueden lanzar los dados
   * @param {string} gameId - ID de la partida
   * @returns {boolean} - True si se pueden lanzar
   */
  getCanRollDice(gameId) {
    return boardService.getCanRollDice(gameId);
  }

  /**
   * Obtiene los movimientos válidos
   * @param {string} gameId - ID de la partida
   * @param {string} playerId - ID del jugador
   * @returns {Array} - Lista de movimientos
   */
  getValidMoves(gameId, playerId) {
    return boardService.getValidMoves(gameId, playerId);
  }

  /**
   * Mueve un jugador
   * @param {string} gameId - ID de la partida
   * @param {string} playerId - ID del jugador
   * @param {Object} targetPosition - Posición destino
   * @returns {Object} - Resultado del movimiento
   */
  movePlayer(gameId, playerId, targetPosition) {
    return boardService.movePlayer(gameId, playerId, targetPosition);
  }

  /**
   * Maneja la salida de un jugador durante una partida
   * @param {string} gameId - ID de la partida
   * @param {string} userId - ID del jugador
   * @returns {Object} - Resultado de la operación
   */
  handlePlayerLeaveInGame(gameId, userId) {
    if (!this.hasGame(gameId) || this.getGameState(gameId) !== GAME_STATES.PLAYING) {
      return { success: false };
    }
    return this.removePlayerInGame(gameId, userId);
  }

  /**
   * Redistribuye las cartas de un jugador
   * @param {string} gameId - ID de la partida
   * @param {string} userId - ID del jugador
   */
  redistributePlayerCards(gameId, userId) {
    cardService.redistributePlayerCards(gameId, userId);
  }

  /**
   * Elimina un jugador durante una partida
   * @param {string} gameId - ID de la partida
   * @param {string} userId - ID del jugador
   * @returns {Object} - Resultado de la operación
   */
  removePlayerInGame(gameId, userId) {
    const game = this.getGame(gameId);

    const player = game.players.get(userId);
    const playerName = player?.username;
    const playerCards = this.getPlayerCards(gameId, userId);
    const isCurrentTurn = this.isPlayerTurn(gameId, userId);

    this.redistributePlayerCards(gameId, userId);

    // Actualizar el orden de turnos antes de eliminar al jugador
    turnService.updatePlayerTurnOrder(gameId, userId);

    this.removePlayer(gameId, userId);

    // Si era el turno del jugador que salió, ya no necesitamos llamar a nextTurn
    // porque updatePlayerTurnOrder ya ajustó el currentTurnPlayer
    const nextTurnInfo = isCurrentTurn ? {
      playerId: game.currentTurnPlayer,
      playerName: turnService.getCurrentTurnPlayerName(gameId),
      turnIndex: game.currentTurnIndex,
      totalPlayers: game.turnOrder ? game.turnOrder.length : 0
    } : null;

    const remainingPlayers = this.getPlayers(gameId);
    const shouldEndGame = remainingPlayers.length < GAME_CONFIG.MIN_PLAYERS_FOR_GAME;
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

  /**
   * Realiza una acusación
   * @param {string} gameId - ID de la partida
   * @param {string} playerId - ID del jugador
   * @param {Object} accusation - Detalles de la acusación
   * @returns {Object} - Resultado de la acusación
   */
  makeAccusation(gameId, playerId, accusation) {
    return suggestionService.makeAccusation(gameId, playerId, accusation);
  }

  /**
   * Obtiene la habitación de un jugador
   * @param {string} gameId - ID de la partida
   * @param {string} playerId - ID del jugador
   * @returns {Object} - Información de la habitación
   */
  getPlayerRoom(gameId, playerId) {
    return boardService.getPlayerRoom(gameId, playerId);
  }

  /**
   * Valida una sugerencia
   * @param {string} gameId - ID de la partida
   * @param {string} playerId - ID del jugador
   * @param {Object} suggestion - Detalles de la sugerencia
   * @returns {Object} - Resultado de la validación
   */
  validateSuggestion(gameId, playerId, suggestion) {
    return suggestionService.validateSuggestion(gameId, playerId, suggestion);
  }

  /**
   * Establece una sugerencia activa
   * @param {string} gameId - ID de la partida
   * @param {Object} suggestion - Detalles de la sugerencia
   */
  setCurrentSuggestion(gameId, suggestion) {
    suggestionService.setCurrentSuggestion(gameId, suggestion);
  }

  /**
   * Muestra una carta como respuesta a una sugerencia
   * @param {string} gameId - ID de la partida
   * @param {string} playerId - ID del jugador
   * @param {Object} card - Carta a mostrar
   * @returns {Object} - Resultado de la operación
   */
  showCard(gameId, playerId, card) {
    return suggestionService.showCard(gameId, playerId, card);
  }

  /**
   * Obtiene las IDs de todas las partidas disponibles para unirse
   * @returns {Array} - Lista de IDs de partidas disponibles
   */
  getAvailableGames() {
    const availableGames = [];
    console.log('Juegos activos: ', gameService.getActiveGamesCount());

    // Obtener todas las partidas y filtrar las que están en estado de espera
    for (const [gameId, game] of gameService.getAllGames()) {
      if (game.state === GAME_STATES.WAITING &&
        playerService.getPlayerCount(gameId) < GAME_CONFIG.MAX_PLAYERS) {
        availableGames.push(gameId);
      }
    }

    return availableGames;
  }
}

export const gameStateManager = new GameStateManager();
