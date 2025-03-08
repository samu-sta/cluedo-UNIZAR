import { useState, useEffect } from 'react';
import { joinGame } from '../services/Game';
import { initSocket, closeSocket } from '../services/Socket';

export function useGameSocket(gameId) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!gameId) {
      setError('Falta información para unirse a la partida');
      setLoading(false);
      return;
    }

    const connectToGame = async () => {
      try {
        const response = await joinGame(gameId);

        if (!response.success) {
          setError(response.error || 'No se pudo unir a la partida');
          setLoading(false);
          return;
        }

        const socketInstance = initSocket(response.socketToken);
        setSocket(socketInstance);

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

        socketInstance.on('error', (error) => {
          setError(typeof error === 'string' ? error : 'Error de comunicación');
        });
      } catch (err) {
        console.error('Error al conectarse a la partida:', err);
        setError('Error de conexión al servidor');
        setLoading(false);
      }
    };

    connectToGame();

    return () => {
      closeSocket();
    };
  }, [gameId]);

  const sendReady = () => {
    if (socket) {
      socket.emit('playerReady');
    }
  };

  const leaveGame = () => {
    if (socket) {
      socket.emit('leaveGame');
      closeSocket();
    }
  };

  return {
    players,
    loading,
    error,
    sendReady,
    leaveGame
  };
}