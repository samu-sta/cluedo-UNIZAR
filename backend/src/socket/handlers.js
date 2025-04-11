import { gameStateManager } from './GameStateManager.js';
import CountdownManager from './CountdownManager.js';
import { GAME_STATES, SOCKET_EVENTS } from '../config/constants.js';
import MESSAGES from '../messages/messages.js';

export const setupSocketHandlers = (io) => {
  const countdownManager = new CountdownManager(io, gameStateManager);

  io.on(SOCKET_EVENTS.CONNECT, async (socket) => {
    const { gameId, userId, username } = socket;

    if (gameStateManager.getGameState(gameId) === GAME_STATES.PLAYING) {
      console.log(`Usuario intentó unirse a partida en progreso: ${username} (${userId})`);
      socket.disconnect();
      return;
    }

    console.log(`Usuario conectado: ${username} (${userId})`);

    socket.join(gameId);

    const isNewPlayer = await gameStateManager.addPlayer(gameId, userId, { username });

    // Siempre enviamos la lista de jugadores, incluso si el jugador ya existe
    // Esto soluciona el problema de la pantalla de carga infinita
    socket.emit(SOCKET_EVENTS.PLAYER_LIST, {
      players: gameStateManager.getPlayers(gameId)
    });

    // Solo notificamos a los demás si es un jugador nuevo
    if (isNewPlayer) {
      socket.to(gameId).emit(SOCKET_EVENTS.PLAYER_JOINED, { username });
    }

    // Verificamos si hay suficientes jugadores para iniciar la cuenta atrás
    if (gameStateManager.getPlayerCount(gameId) >= 2) {
      countdownManager.startCountdown(gameId);
    }

    const handlePlayerLeave = (reason = MESSAGES.DISCONNECTION) => {

      if (gameStateManager.getGameState(gameId) === GAME_STATES.PLAYING) {
        const result = gameStateManager.handlePlayerLeaveInGame(gameId, userId);

        if (!result.success) return;

        result.nextTurn && io.to(gameId).emit(SOCKET_EVENTS.TURN_UPDATE, { currentTurn: result.nextTurn });

        if (result.shouldEndGame) {
          gameStateManager.setGameState(gameId, GAME_STATES.ENDED);

          const endReason = result.remainingPlayers.length === 0
            ? MESSAGES.ALL_PLAYERS_LEFT
            : `${username} ${MESSAGES.PLAYER_LEFT_ONE_REMAINING}`;

          io.to(gameId).emit(SOCKET_EVENTS.GAME_END, { reason: endReason, winner: result.winner });
          return;
        }

        io.to(gameId).emit(SOCKET_EVENTS.PLAYER_LEFT, { username });
        return;
      }

      if (!gameStateManager.removePlayer(gameId, userId)) return;

      io.to(gameId).emit(SOCKET_EVENTS.PLAYER_LEFT, { username });

      const playerCount = gameStateManager.getPlayerCount(gameId);
      playerCount < 2 && countdownManager.cancelCountdown(gameId);
      playerCount === 0 && gameStateManager.deleteGame(gameId);
    };

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      handlePlayerLeave(MESSAGES.DISCONNECTION);
    });

    socket.on(SOCKET_EVENTS.REQUEST_CARDS, () => {
      if (gameStateManager.getGameState(gameId) !== GAME_STATES.PLAYING) {
        socket.emit(SOCKET_EVENTS.ERROR, MESSAGES.GAME_NOT_STARTED);
        return;
      }

      const cards = gameStateManager.getPlayerCards(gameId, userId);
      const leftoverCards = gameStateManager.getLeftoverCards(gameId);
      socket.emit(SOCKET_EVENTS.PLAYER_CARDS, { cards, leftoverCards });
    });

    socket.on(SOCKET_EVENTS.PLAYER_READY, () => {
      if (gameStateManager.getGameState(gameId) !== GAME_STATES.WAITING) {
        return;
      }


      if (gameStateManager.getPlayerCount(gameId) >= 2) {
        countdownManager.startCountdown(gameId);
      }
    });

    socket.on(SOCKET_EVENTS.PASS_TURN, () => {
      if (gameStateManager.getGameState(gameId) !== GAME_STATES.PLAYING) {
        socket.emit(SOCKET_EVENTS.ERROR, MESSAGES.GAME_NOT_IN_PROGRESS);
        return;
      }

      if (!gameStateManager.isPlayerTurn(gameId, userId)) {
        socket.emit(SOCKET_EVENTS.ERROR, MESSAGES.NOT_YOUR_TURN);
        return;
      }

      const currentTurn = gameStateManager.nextTurn(gameId);
      console.log('Siguiente turno:', currentTurn);
      if (currentTurn) {
        io.to(gameId).emit(SOCKET_EVENTS.TURN_UPDATE, { currentTurn });
      }
    });

    socket.on(SOCKET_EVENTS.ROLL_DICE, () => {
      if (gameStateManager.getGameState(gameId) !== GAME_STATES.PLAYING) {
        socket.emit(SOCKET_EVENTS.ERROR, MESSAGES.GAME_NOT_IN_PROGRESS);
        return;
      }

      if (!gameStateManager.isPlayerTurn(gameId, userId)) {
        socket.emit(SOCKET_EVENTS.ERROR, MESSAGES.NOT_YOUR_TURN);
        return;
      }

      if (!gameStateManager.getCanRollDice(gameId)) {
        socket.emit(SOCKET_EVENTS.ERROR, MESSAGES.DICE_ALREADY_ROLLED);
        return;
      }

      const { diceResult1, diceResult2 } = gameStateManager.rollDice(gameId);
      const validMoves = gameStateManager.getValidMoves(gameId, userId);
      console.log(validMoves);
      io.to(gameId).emit(SOCKET_EVENTS.DICE_ROLLED, { diceResult: [diceResult1, diceResult2], validMoves });
    });

    socket.on(SOCKET_EVENTS.MOVE_PLAYER, (targetPosition) => {
      if (gameStateManager.getGameState(gameId) !== GAME_STATES.PLAYING) {
        socket.emit(SOCKET_EVENTS.ERROR, MESSAGES.GAME_NOT_IN_PROGRESS);
        return;
      }

      if (!gameStateManager.isPlayerTurn(gameId, userId)) {
        socket.emit(SOCKET_EVENTS.ERROR, MESSAGES.NOT_YOUR_TURN);
        return;
      }

      console.log('Validando movimiento:', targetPosition);

      // Procesar el movimiento
      const result = gameStateManager.movePlayer(gameId, userId, targetPosition);

      if (!result.success) {
        socket.emit(SOCKET_EVENTS.ERROR, result.message);
        return;
      }

      // Notificar a todos los jugadores del movimiento
      const players = gameStateManager.getPlayers(gameId);
      io.to(gameId).emit(SOCKET_EVENTS.PLAYERS_MOVED, {
        players,
        movedPlayer: userId,
        path: result.path
      });

      // Si el movimiento fue exitoso, enviar un mensaje de éxito
      socket.emit(SOCKET_EVENTS.MOVE_SUCCESS);
    });

    socket.on(SOCKET_EVENTS.MAKE_ACCUSATION, (accusation) => {

      if (!validateGameAction(gameId, userId)) return;

      const result = gameStateManager.makeAccusation(gameId, userId, accusation);

      if (!result.success) {
        socket.emit(SOCKET_EVENTS.ERROR, result.message);
        return;
      }

      result.isCorrect
        ? handleCorrectAccusation(result)
        : handleIncorrectAccusation(result);
    });

    socket.on(SOCKET_EVENTS.MAKE_SUGGESTION, (suggestion) => {
      if (gameStateManager.getGameState(gameId) !== GAME_STATES.PLAYING) {
        socket.emit(SOCKET_EVENTS.ERROR, MESSAGES.GAME_NOT_IN_PROGRESS);
        return;
      }

      console.log(`Jugador ${username} intenta hacer sugerencia:`, suggestion);

      const validationResult = gameStateManager.validateSuggestion(gameId, userId, suggestion);

      if (!validationResult.valid) {
        socket.emit(SOCKET_EVENTS.ERROR, validationResult.message);
        return;
      }

      suggestion.username = username;

      socket.emit(SOCKET_EVENTS.SUGGESTION_MADE);

      socket.to(gameId).emit(SOCKET_EVENTS.CURRENT_SUGGESTION, {
        suggestion
      });
    });

    socket.on(SOCKET_EVENTS.SHOW_CARD, (card) => {
      if (gameStateManager.getGameState(gameId) !== GAME_STATES.PLAYING) {
        socket.emit(SOCKET_EVENTS.ERROR, MESSAGES.GAME_NOT_IN_PROGRESS);
        return;
      }

      const result = gameStateManager.showCard(gameId, userId, card);

      if (!result.success) {
        socket.emit(SOCKET_EVENTS.ERROR, result.message);
        return;
      }

      const suggestionMakerUsername = result.suggestionMaker;

      const sockets = Array.from(io.sockets.sockets).map(s => s[1]);
      const suggestionMakerSocket = sockets.find(
        s => s.username === suggestionMakerUsername
      );

      if (!suggestionMakerSocket) {
        socket.emit(SOCKET_EVENTS.ERROR, MESSAGES.SUGGESTION_PLAYER_NOT_FOUND);
      }

      io.to(suggestionMakerSocket.id).emit(SOCKET_EVENTS.CARD_SHOWN, {
        username,
        card: result.cardShown
      });

    });

    function validateGameAction(gameId, userId) {
      if (gameStateManager.getGameState(gameId) !== GAME_STATES.PLAYING) {
        socket.emit(SOCKET_EVENTS.ERROR, MESSAGES.GAME_NOT_IN_PROGRESS);
        return false;
      }

      if (!gameStateManager.isPlayerTurn(gameId, userId)) {
        socket.emit(SOCKET_EVENTS.ERROR, MESSAGES.NOT_YOUR_TURN);
        return false;
      }

      return true;
    }

    function endGame(reason, winner, solution = null) {
      gameStateManager.setGameState(gameId, GAME_STATES.ENDED);
      io.to(gameId).emit(SOCKET_EVENTS.GAME_END, { reason, winner, solution });
    }

    function handleCorrectAccusation(result) {
      endGame(
        `${username} ${MESSAGES.SOLVED_CASE_CORRECTLY}`,
        username,
        result.solution
      );
    }

    function handleIncorrectAccusation(result) {
      socket.emit(SOCKET_EVENTS.INCORRECT_ACCUSATION, {
        message: MESSAGES.INCORRECT_ACCUSATION
      });

      if (result.shouldEndGame) {
        endGame(
          `${username} ${MESSAGES.LAST_PLAYER_ELIMINATED}`,
          result.winner,
          result.solution
        );
        return;
      }
      const nextTurn = gameStateManager.nextTurn(gameId);
      nextTurn && io.to(gameId).emit(SOCKET_EVENTS.TURN_UPDATE, { currentTurn: nextTurn });
    }

  });
};