import { useState, useEffect, useRef } from 'react';
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
  const user = JSON.parse(localStorage.getItem('user'));



  const socketRef = useRef(null);
  const joinedGameRef = useRef(false);

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
          setIsMyTurn(user && currentTurn.playerId === user.id);
        });

        socketInstance.on('gameEnd', ({ reason, winner }) => {
          setCountdown(null);
          setGameState('ended');
          setWinner(winner);
          setEndReason(reason);
        });

        socketInstance.on('diceRolled', ({ diceResult }) => {
          setDiceResult(diceResult);
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
      socketRef.current.emit('leaveGame');
      closeSocket();
      joinedGameRef.current = false;
      socketRef.current = null;
    }
  };

  const passTurn = () => {
    const socketInstance = socketRef.current;
    if (socketInstance && isMyTurn) {
      socketInstance.emit('passTurn');
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
    rollDice: () => socketRef.current?.emit('rollDice'),
    playerCards,
    leftoverCards,
    requestCards: () => socketRef.current?.emit('requestCards')
  };
}