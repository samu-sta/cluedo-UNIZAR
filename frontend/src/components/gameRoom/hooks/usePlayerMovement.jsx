/**
 * @fileoverview Hook para gestionar el movimiento de jugadores y los lanzamientos de dados durante el juego
 * @author Samuel Felipe
 */
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para gestionar el movimiento de jugadores y los dados
 * Responsabilidad: Control de movimientos, dados y validación de posiciones
 */
export function usePlayerMovement(socket, isMyTurn, gameInfo) {
  const [diceResult, setDiceResult] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [currentPath, setCurrentPath] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!socket) return;

    socket.on('diceRolled', ({ diceResult, validMoves }) => {
      setDiceResult(diceResult);
      setValidMoves(validMoves);
    });

    socket.on('playersMoved', ({ movedPlayer, path }) => {
      setCurrentPath(path);
      animateMovement(path);
    });

    socket.on('moveSuccess', () => {
      setValidMoves([]);
    });

    socket.on('turnUpdate', () => {
      if (!isMyTurn) {
        setValidMoves([]);
        setCurrentPath(null);
      }
    });

    return () => {
    };
  }, [socket, isMyTurn]);

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
    }, 300);
  };

  const movePlayer = (position) => {
    if (socket && isMyTurn && !isMoving) {
      socket.emit('movePlayer', position);
    }
  };

  const rollDice = () => {
    if (socket && isMyTurn) {
      socket.emit('rollDice');
      return true;
    }
    return false;
  };

  return {
    diceResult,
    validMoves,
    currentPath,
    isMoving,
    movePlayer,
    rollDice
  };
}