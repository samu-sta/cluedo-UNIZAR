import { gameService } from './GameService.js';
import { turnService } from './TurnService.js';
import { boardService } from './BoardService.js';
import { playerService } from './PlayerService.js';
import { cardService } from './CardService.js';
import { checkAccusation } from '../utils/game.js';
import MESSAGES from '../messages/messages.js';
import { GAME_STATES, GAME_CONFIG } from '../config/constants.js';

/**
 * Servicio para gestionar sugerencias y acusaciones
 */
class SuggestionService {
  /**
   * Valida una sugerencia de un jugador
   * @param {string} gameId - ID de la partida
   * @param {string} playerId - ID del jugador
   * @param {Object} suggestion - Sugerencia (personaje, arma, habitación)
   * @returns {Object} Resultado de la validación
   */
  validateSuggestion(gameId, playerId, suggestion) {
    if (!gameService.hasGame(gameId)) {
      return this.createValidationError(MESSAGES.GAME_NOT_FOUND);
    }

    if (!turnService.isPlayerTurn(gameId, playerId)) {
      return this.createValidationError(MESSAGES.NOT_YOUR_TURN);
    }

    const game = gameService.getGame(gameId);

    if (game.canRollDice) {
      return this.createValidationError(MESSAGES.MUST_ROLL_DICE_FIRST);
    }

    if (!game.hasMoved) {
      return this.createValidationError(MESSAGES.MUST_MOVE_BEFORE_SUGGESTION);
    }

    if (game.hasSuggested) {
      return this.createValidationError(MESSAGES.ALREADY_MADE_SUGGESTION);
    }

    const playerRoom = boardService.getPlayerRoom(gameId, playerId);

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

  /**
   * Establece la sugerencia actual en la partida
   * @param {string} gameId - ID de la partida
   * @param {Object} suggestion - Sugerencia realizada
   */
  setCurrentSuggestion(gameId, suggestion) {
    const game = gameService.getGame(gameId);
    game.currentSuggestion = suggestion;
    game.suggestionResponses = [];
  }

  /**
   * Procesa la acción de un jugador mostrando una carta
   * @param {string} gameId - ID de la partida
   * @param {string} playerId - ID del jugador que muestra la carta
   * @param {Object} card - Carta que se muestra
   * @returns {Object} Resultado de la acción
   */
  showCard(gameId, playerId, card) {
    const validationResult = this.validateShowCardRequest(gameId, playerId, card);
    if (!validationResult.valid) {
      return { success: false, message: validationResult.message };
    }

    const game = gameService.getGame(gameId);
    const player = game.players.get(playerId);

    this.registerCardResponse(game, player.username, card);

    return {
      success: true,
      suggestionMaker: game.currentSuggestion.username,
      cardShown: card
    };
  }

  /**
   * Valida la solicitud de mostrar una carta
   * @param {string} gameId - ID de la partida
   * @param {string} playerId - ID del jugador
   * @param {Object} card - Carta a mostrar
   * @returns {Object} Resultado de la validación
   */
  validateShowCardRequest(gameId, playerId, card) {
    if (!gameService.hasGame(gameId)) {
      return { valid: false, message: MESSAGES.GAME_NOT_FOUND };
    }

    const game = gameService.getGame(gameId);

    if (!game.currentSuggestion) {
      return { valid: false, message: MESSAGES.NO_ACTIVE_SUGGESTION };
    }

    if (!card) {
      return { valid: true };
    }

    const playerCards = cardService.getPlayerCards(gameId, playerId);
    const hasCard = playerCards.some(c =>
      c.name === card.name && c.type === card.type
    );

    if (!hasCard) {
      return { valid: false, message: MESSAGES.CARD_NOT_FOUND };
    }

    return { valid: true };
  }

  /**
   * Registra la respuesta de un jugador a una sugerencia
   * @param {Object} game - Datos de la partida
   * @param {string} username - Nombre del jugador
   * @param {Object} card - Carta mostrada (o null)
   */
  registerCardResponse(game, username, card) {
    if (!game.suggestionResponses) {
      game.suggestionResponses = [];
    }

    game.suggestionResponses.push({
      username,
      card: card || null
    });
  }

  /**
   * Crea un objeto de error de validación
   * @param {string} message - Mensaje de error
   * @returns {Object} Objeto de error
   */
  createValidationError(message) {
    return { valid: false, message };
  }

  /**
   * Procesa una acusación de un jugador
   * @param {string} gameId - ID de la partida
   * @param {string} playerId - ID del jugador
   * @param {Object} accusation - Acusación (personaje, arma, habitación)
   * @returns {Object} Resultado de la acusación
   */
  makeAccusation(gameId, playerId, accusation) {
    const validationResult = this.validateAccusationRequest(gameId, playerId);
    if (!validationResult) {
      return { success: false, message: validationResult.message };
    }

    const game = gameService.getGame(gameId);
    const solution = game.solution;

    const isCorrect = checkAccusation(accusation, solution);

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

  /**
   * Valida una solicitud de acusación
   * @param {string} gameId - ID de la partida
   * @param {string} playerId - ID del jugador
   * @returns {boolean} True si la solicitud es válida
   */
  validateAccusationRequest(gameId, playerId) {
    return gameService.hasGame(gameId) && turnService.isPlayerTurn(gameId, playerId);
  }

  /**
   * Maneja una acusación incorrecta
   * @param {string} gameId - ID de la partida
   * @param {string} playerId - ID del jugador
   * @returns {Object} Resultado del proceso
   */
  handleIncorrectAccusation(gameId, playerId) {
    const result = this.removePlayerAfterIncorrectAccusation(gameId, playerId);

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

  /**
   * Elimina a un jugador después de una acusación incorrecta
   * @param {string} gameId - ID de la partida
   * @param {string} userId - ID del jugador
   * @returns {Object} Resultado del proceso
   */
  removePlayerAfterIncorrectAccusation(gameId, userId) {
    if (!gameService.hasGame(gameId) ||
      gameService.getGameState(gameId) !== GAME_STATES.PLAYING) {
      return { success: false };
    }

    const game = gameService.getGame(gameId);

    const player = game.players.get(userId);
    const playerName = player?.username;
    const playerCards = cardService.getPlayerCards(gameId, userId);
    const isCurrentTurn = turnService.isPlayerTurn(gameId, userId);

    cardService.redistributePlayerCards(gameId, userId);
    playerService.removePlayer(gameId, userId);

    const nextTurnInfo = isCurrentTurn ? turnService.nextTurn(gameId) : null;

    const remainingPlayers = playerService.getPlayers(gameId);
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
   * Obtiene la lista de jugadores que pueden refutar una sugerencia
   * @param {string} gameId - ID de la partida
   * @param {string} suggestingPlayerId - ID del jugador que hizo la sugerencia
   * @param {Object} suggestion - Sugerencia realizada
   * @returns {Array} - Lista de jugadores que pueden refutar
   */
  getPlayersWhoCanDisprove(gameId, suggestingPlayerId, suggestion) {
    if (!gameService.hasGame(gameId)) return [];

    const game = gameService.getGame(gameId);
    const playerIds = Array.from(game.players.keys()).filter(id => id !== suggestingPlayerId);
    
    return playerIds.filter(playerId => {
      const card = cardService.checkCard(gameId, playerId, suggestion);
      return card !== null;
    });
  }

  /**
   * Obtiene el siguiente jugador que puede refutar una sugerencia
   * @param {string} gameId - ID de la partida
   * @param {Object} suggestion - Sugerencia realizada
   * @param {string} currentPlayerId - ID del jugador actual
   * @returns {string|null} - ID del siguiente jugador o null
   */
  getNextPlayerToDisprove(gameId, suggestion, currentPlayerId) {
    if (!gameService.hasGame(gameId)) return null;

    const game = gameService.getGame(gameId);
    const turnOrder = game.turnOrder || [];
    
    if (turnOrder.length <= 1) return null;
    
    let currentIndex = turnOrder.indexOf(currentPlayerId);
    
    for (let i = 1; i < turnOrder.length; i++) {
      const nextIndex = (currentIndex + i) % turnOrder.length;
      const nextPlayerId = turnOrder[nextIndex];
      
      if (cardService.checkCard(gameId, nextPlayerId, suggestion)) {
        return nextPlayerId;
      }
    }
    
    return null;
  }
}

export const suggestionService = new SuggestionService();
export default suggestionService;