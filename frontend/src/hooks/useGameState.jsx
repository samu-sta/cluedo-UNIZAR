import { useState, useEffect, useRef } from 'react';

/**
 * Hook para gestionar el estado del juego y los jugadores
 * Responsabilidad: Mantener información sobre la sala, los jugadores y el estado actual del juego
 */
export function useGameState(socket) {
  const [players, setPlayers] = useState([]);
  const [gameState, setGameState] = useState('waiting');
  const [countdown, setCountdown] = useState(null);
  const [winner, setWinner] = useState(null);
  const [endReason, setEndReason] = useState(null);
  const [solution, setSolution] = useState(null);
  const gameStateRef = useRef('waiting');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    if (!socket) return;

    socket.on('playerList', ({ players }) => {
      setPlayers(players);
    });

    socket.on('playerJoined', ({ username }) => {
      setPlayers(prev => {
        if (prev.some(player => player.username === username)) {
          return prev;
        }
        return [...prev, { username }];
      });
    });

    socket.on('playerLeft', ({ username }) => {
      setPlayers(prev => prev.filter(player => player.username !== username));
      if (gameStateRef.current === 'playing') {
        socket.emit('requestCards');
      }
    });

    socket.on('countdownUpdate', ({ seconds }) => {
      setGameState('countdown');
      setCountdown(seconds);
    });

    socket.on('countdownCancelled', () => {
      setCountdown(null);
      setGameState('waiting');
    });

    socket.on('playersMoved', ({ players, movedPlayer, path }) => {
      setPlayers(players);
    });

    socket.on('gameStart', ({ players, currentTurn }) => {
      setPlayers(players);
      setCountdown(null);
      setGameState('playing');
    });

    socket.on('gameEnd', ({ reason, winner, solution }) => {
      setCountdown(null);
      setGameState('ended');
      setWinner(winner);
      setEndReason(reason);
      setSolution(solution);
    });

    return () => {
    };
  }, [socket]);

  return {
    players,
    gameState,
    countdown,
    winner,
    endReason,
    solution,
    sendReady: () => socket?.emit('playerReady')
  };
}