import { useState, useEffect, useRef, useCallback } from 'react';
import { joinGame } from '../services/Game';
import { initSocket, closeSocket } from '../services/Socket';

export function useGameSocket(gameId) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [gameState, setGameState] = useState('waiting');
  const [winner, setWinner] = useState(null);
  const [endReason, setEndReason] = useState(null);
  const [gameInfo, setGameInfo] = useState(null);
  const [playerCards, setPlayerCards] = useState([]);
  const [leftoverCards, setLeftoverCards] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [diceResult, setDiceResult] = useState(null);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [canMakeSuggestion, setCanMakeSuggestion] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [hasSuggested, setHasSuggested] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const [validMoves, setValidMoves] = useState([]);
  const [currentPath, setCurrentPath] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [hasRolled, setHasRolled] = useState(false);
  const [showAccusationModal, setShowAccusationModal] = useState(false);
  const [solution, setSolution] = useState(null);
  const [incorrectAccusation, setIncorrectAccusation] = useState(false);
  const [incorrectAccusationMessage, setIncorrectAccusationMessage] = useState('');

  const gameStateRef = useRef('waiting');
  const socketRef = useRef(null);
  const joinedGameRef = useRef(false);

  const checkIfInRoom = useCallback(() => {
    if (!players || !user || !gameInfo?.board?.rooms) return false;

    const currentPlayer = players.find(p => p.username === user.username);
    if (!currentPlayer || !currentPlayer.position) return false;

    const { row, column } = currentPlayer.position;

    // Buscar en qué habitación está el jugador
    for (const room of gameInfo.board.rooms) {
      // Primero verificar que NO esté en una puerta
      const isInDoor = room.doors.some(door =>
        door.row === row && door.column === column
      );

      if (isInDoor) continue; // Si está en una puerta, no está dentro de la habitación

      // Determinar los límites de la habitación basados en las paredes
      if (isPositionInsideRoom(room, { row, column })) {
        setCurrentRoom(room.name);
        return true;
      }
    }

    setCurrentRoom(null);
    return false;
  }, [players, user, gameInfo]);

  // Función auxiliar para determinar si una posición está dentro de una habitación
  const isPositionInsideRoom = (room, position) => {
    if (!room.walls || room.walls.length < 3) return false;

    // Encontrar los límites de la habitación
    let minRow = Infinity, maxRow = -Infinity;
    let minCol = Infinity, maxCol = -Infinity;

    room.walls.forEach(wall => {
      minRow = Math.min(minRow, wall.row);
      maxRow = Math.max(maxRow, wall.row);
      minCol = Math.min(minCol, wall.column);
      maxCol = Math.max(maxCol, wall.column);
    });

    return (
      position.row > minRow && position.row < maxRow &&
      position.column > minCol && position.column < maxCol
    );
  };

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    if (isMyTurn && gameState === 'playing') {
      setCanMakeSuggestion(hasRolled && hasMoved && checkIfInRoom() && !hasSuggested);
    } else {
      setCanMakeSuggestion(false);
    }
  }, [isMyTurn, gameState, checkIfInRoom]);

  useEffect(() => {
    if (!gameId) {
      setError('Falta información para unirse a la partida');
      setLoading(false);
      return;
    }

    const connectToGame = async () => {
      try {
        if (!joinedGameRef.current) {
          const response = await joinGame(gameId);

          if (!response.success) {
            setError(response.error || 'No se pudo unir a la partida');
            setLoading(false);
            return;
          }

          setGameInfo(response.gameInfo);
          const socketInstance = initSocket(response.socketToken);
          socketRef.current = socketInstance;
          joinedGameRef.current = true;
        }

        const socketInstance = socketRef.current;

        socketInstance.on('playerList', ({ players }) => {
          setPlayers(players);
          setLoading(false);
        });

        socketInstance.on('playerJoined', ({ username }) => {
          setPlayers(prev => {
            if (prev.some(player => player.username === username)) {
              return prev;
            }
            return [...prev, { username }];
          });
        });

        socketInstance.on('playerLeft', ({ username }) => {
          setPlayers(prev => prev.filter(player => player.username !== username));
          if (gameStateRef.current === 'playing') {
            socketInstance.emit('requestCards');
          }
        });

        socketInstance.on('countdownUpdate', ({ seconds }) => {
          setGameState('countdown');
          setCountdown(seconds);
        });

        socketInstance.on('countdownCancelled', () => {
          setCountdown(null);
          setGameState('waiting');
        });

        socketInstance.on('playerCards', ({ cards, leftoverCards = [] }) => {
          setPlayerCards(cards);
          setLeftoverCards(leftoverCards);
        });

        socketInstance.on('gameStart', ({ currentTurn, players }) => {
          setPlayers(players);
          setCountdown(null);
          setGameState('playing');
          socketInstance.emit('requestCards');
          setCurrentTurn(currentTurn);
          setIsMyTurn(user && currentTurn.playerId === user.id);
        });

        socketInstance.on('turnUpdate', ({ currentTurn }) => {
          setCurrentTurn(currentTurn);
          const isNowMyTurn = user && currentTurn.playerId === user.id;
          setIsMyTurn(isNowMyTurn);
          if (!isNowMyTurn) {
            setValidMoves([]);
            setCurrentPath(null);
          }
        });

        socketInstance.on('gameEnd', ({ reason, winner, solution }) => {
          setCountdown(null);
          setGameState('ended');
          setWinner(winner);
          setEndReason(reason);
          setSolution(solution);
        });

        socketInstance.on('diceRolled', ({ diceResult, validMoves }) => {
          setDiceResult(diceResult);
          setValidMoves(validMoves);
        });

        socketInstance.on('playersMoved', ({ players, movedPlayer, path }) => {
          setPlayers(players);

          if (movedPlayer === user.id) {
            // Si soy yo quien se mueve, mostrar animación
            setCurrentPath(path);
            animateMovement(path);
          }
        });

        socketInstance.on('moveSuccess', () => {
          // Limpiar los movimientos válidos después de moverse
          setHasMoved(true);
          setValidMoves([]);
          setHasRolled(true);
          setCanMakeSuggestion(checkIfInRoom() && !hasSuggested);
        });

        socketInstance.on('suggestionMade', () => {
          setHasSuggested(true);
          setCanMakeSuggestion(false);
        });

        socketInstance.on('incorrectAccusation', ({ message }) => {
          setIncorrectAccusation(true);
          setIncorrectAccusationMessage(message);
        });

        socketInstance.on('error', (error) => {
          setError(typeof error === 'string' ? error : 'Error de comunicación');
        });

      } catch (err) {
        setError('Error de conexión al servidor');
        setLoading(false);
      }
    };

    connectToGame();

    return () => {
    };
  }, [gameId]);

  const leaveGame = () => {
    if (socketRef.current) {
      closeSocket();
      joinedGameRef.current = false;
      socketRef.current = null;
    }
  };

  const passTurn = () => {
    const socketInstance = socketRef.current;
    if (!socketInstance && isMyTurn) {
      setValidMoves([]);
      return;
    }
    socketInstance.emit('passTurn');
    setHasRolled(false);
    setHasMoved(false);
    setHasSuggested(false);
  };

  const animateMovement = (path) => {
    if (!path || path.length < 2) return;

    setIsMoving(true);
    let step = 0;

    const interval = setInterval(() => {
      step++;
      if (step >= path.length) {
        clearInterval(interval);
        setIsMoving(false);
        setCurrentPath(null);
      }
    }, 300); // 300ms por paso
  };

  const makeSuggestion = (suggestion) => {
    if (socketRef.current && isMyTurn && canMakeSuggestion) {
      socketRef.current.emit('makeSuggestion', suggestion);
    }
  };

  const movePlayer = (position) => {
    const socketInstance = socketRef.current;
    if (socketInstance && isMyTurn && !isMoving) {
      socketInstance.emit('movePlayer', position);
    }
  };

  const handleRollDice = () => {
    socketRef.current?.emit('rollDice')
    setHasRolled(true);
  }

  const makeAccusation = (accusation) => {
    if (socketRef.current && isMyTurn) {
      socketRef.current.emit('makeAccusation', accusation);
    }
  };

  return {
    players,
    loading,
    error,
    countdown,
    currentTurn,
    isMyTurn,
    passTurn,
    gameState,
    gameInfo,
    sendReady: () => socketRef.current?.emit('playerReady'),
    winner,
    endReason,
    leaveGame,
    diceResult,
    rollDice: handleRollDice,
    validMoves,
    isMoving,
    movePlayer,
    hasRolled,
    currentPath,
    playerCards,
    leftoverCards,
    makeAccusation,
    showAccusationModal,
    setShowAccusationModal,
    solution,
    requestCards: () => socketRef.current?.emit('requestCards'),
    incorrectAccusation,
    incorrectAccusationMessage,
    makeSuggestion,
    showSuggestionModal,
    setShowSuggestionModal,
    canMakeSuggestion,
    currentRoom,
    hasSuggested,
    resetIncorrectAccusation: () => setIncorrectAccusation(false),
  };
}