import { useState, useEffect } from 'react';

/**
 * Hook para gestionar los turnos del juego
 * Responsabilidad: Control del turno actual y acciones relacionadas con los turnos
 */
export function useGameTurn(socket) {
  const [currentTurn, setCurrentTurn] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [hasRolled, setHasRolled] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [hasSuggested, setHasSuggested] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!socket) return;

    socket.on('gameStart', (data) => {
      if (data && data.currentTurn) {
        setCurrentTurn(data.currentTurn);
        setIsMyTurn(user && data.currentTurn.playerId === user.id);
      }
    });

    socket.on('turnUpdate', ({ currentTurn }) => {
      setCurrentTurn(currentTurn);
      const isNowMyTurn = user && currentTurn.playerId === user.id;
      setIsMyTurn(isNowMyTurn);

      if (isNowMyTurn) {
        setHasMoved(false);
        setHasRolled(false);
        setHasSuggested(false);
      }
    });

    socket.on('moveSuccess', () => {
      setHasMoved(true);
    });

    socket.on('suggestionMade', () => {
      setHasSuggested(true);
    });

    return () => {
    };
  }, [socket, user]);

  const passTurn = () => {
    if (!socket || !isMyTurn) return;

    socket.emit('passTurn');
    setHasRolled(false);
    setHasMoved(false);
    setHasSuggested(false);
  };

  return {
    currentTurn,
    isMyTurn,
    hasRolled,
    setHasRolled,
    hasMoved,
    hasSuggested,
    passTurn
  };
}