/**
 * @fileoverview Hook personalizado para gestionar la lógica de creación y unión a partidas
 * @autor Samuel Felipe
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGame, joinGame, findRandomGame } from '../../../services/Game';

const useStartGames = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gameId, setGameId] = useState('');

  const handleCreateGame = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createGame();

      if (!response.success) {
        setError(response.error || response.message || 'Error al crear la partida');
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
      console.log(response);
      if (!response.success) {
        // Mostrar el mensaje exacto que viene del servidor
        setError(response.message || response.error || 'Error al unirse a la partida');
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

  const handleFindRandomGame = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await findRandomGame();

      if (!response.success) {
        setError(response.message || response.error || 'No hay partidas disponibles');
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

  const handleGameIdChange = (e) => {
    setGameId(e.target.value);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    isLoading,
    error,
    gameId,
    handleCreateGame,
    handleJoinGame,
    handleFindRandomGame,
    handleGameIdChange,
    clearError
  };
};

export default useStartGames;