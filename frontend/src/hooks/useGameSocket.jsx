import { useState, useEffect, useRef } from 'react';
import { joinGame } from '../services/Game';
import { initSocket, closeSocket, getSocket } from '../services/Socket';

export function useGameSocket(gameId) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [gameState, setGameState] = useState('waiting');
  const [winner, setWinner] = useState(null);
  const [endReason, setEndReason] = useState(null);

  const joinedGameRef = useRef(false);
  const socketRef = useRef(getSocket());

  useEffect(() => {
    if (!gameId) {
      setError('Falta información para unirse a la partida');
      setLoading(false);
      return;
    }

    if (socketRef.current && joinedGameRef.current) {
      console.log('Ya hay una conexión socket activa para esta partida');
      setLoading(false);
      return;
    }

    const connectToGame = async () => {
      try {
        if (!joinedGameRef.current) {
          console.log('Conectando a partida por primera vez:', gameId);
          const response = await joinGame(gameId);

          if (!response.success) {
            setError(response.error || 'No se pudo unir a la partida');
            setLoading(false);
            return;
          }

          const socketInstance = initSocket(response.socketToken);
          socketRef.current = socketInstance;
          joinedGameRef.current = true;
        }

        const socketInstance = socketRef.current;

        socketInstance.on('playerList', ({ players }) => {
          setPlayers(players);
          setLoading(false);
        });

        socketInstance.on('playerJoined', (data) => {
          setPlayers(prev => {
            if (!prev.some(p => p.username === data.username)) {
              return [...prev, data];
            }
            return prev;
          });
        });

        socketInstance.on('playerLeft', (data) => {
          setPlayers(prev => prev.filter(player =>
            player.username !== data.username
          ));
        });

        socketInstance.on('countdownUpdate', ({ seconds }) => {
          setCountdown(seconds);
          setGameState('countdown');
        });

        socketInstance.on('countdownCancelled', () => {
          setCountdown(null);
          setGameState('waiting');
        });

        socketInstance.on('gameStart', () => {
          setCountdown(null);
          setGameState('playing');
        });

        socketInstance.on('gameEnd', ({ reason, winner }) => {
          setCountdown(null);
          setGameState('ended');
          setWinner(winner);
          setEndReason(reason);
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

  // Función explícita para abandonar la partida
  const leaveGame = () => {
    if (socketRef.current) {
      socketRef.current.emit('leaveGame');
      closeSocket();
      joinedGameRef.current = false;
      socketRef.current = null;
    }
  };

  return {
    players,
    loading,
    error,
    countdown,
    gameState,
    sendReady: () => socketRef.current?.emit('playerReady'),
    winner,
    endReason,
    leaveGame
  };
}