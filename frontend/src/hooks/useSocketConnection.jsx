import { useState, useRef, useEffect } from 'react';
import { joinGame } from '../services/Game';
import { initSocket, closeSocket } from '../services/Socket';

/**
 * Hook para manejar la conexión básica del socket
 * Responsabilidad: Establecer y cerrar la conexión del socket
 */
export function useSocketConnection(gameId) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameInfo, setGameInfo] = useState(null);

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
      } catch (err) {
        setError('Error de conexión al servidor');
        setLoading(false);
      }
    };

    connectToGame();

    return () => { };
  }, [gameId]);

  const leaveGame = () => {
    if (socketRef.current) {
      closeSocket();
      joinedGameRef.current = false;
      socketRef.current = null;
    }
  };

  return {
    socket: socketRef.current,
    loading,
    error,
    gameInfo,
    setLoading,
    leaveGame
  };
}