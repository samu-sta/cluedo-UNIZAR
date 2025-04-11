import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGame, joinGame } from '../../../services/Game';

const useStartGames = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateGame = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createGame();

      if (!response.success) {
        setError(response.error || 'Error al crear la partida');
        setIsLoading(false);
        return;
      }

      navigate(`/game/${response.gameId}`);
    }
    catch (err) {
      setError('Error de conexión al servidor');
      setIsLoading(false);
    }
  };

  const handleJoinGame = async (e) => {
    if (e) e.preventDefault();

    const formData = new FormData(e.target);
    const gameId = formData.get('gameId');

    if (!gameId) {
      setError('Introduce un ID de partida válido');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await joinGame(gameId);

      if (!response.success) {
        setError(response.error || 'Error al unirse a la partida');
        setIsLoading(false);
        return;
      }

      navigate(`/game/${response.gameId}`);
    }
    catch (err) {
      setError('Error de conexión al servidor');
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    isLoading,
    error,
    handleCreateGame,
    handleJoinGame,
    clearError
  };
};

export default useStartGames;