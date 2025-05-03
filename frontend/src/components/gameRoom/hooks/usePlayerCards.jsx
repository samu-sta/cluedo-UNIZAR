/**
 * @fileoverview Hook para gestionar las cartas del jugador en el juego
 * @author Samuel Felipe
 */
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para gestionar las cartas del jugador
 * Responsabilidad: Mantener el estado de las cartas del jugador y cartas sobrantes
 */
export function usePlayerCards(socket) {
  const [playerCards, setPlayerCards] = useState([]);
  const [leftoverCards, setLeftoverCards] = useState([]);
  const [cardsShown, setCardsShown] = useState([]);

  useEffect(() => {
    if (!socket) return;

    socket.on('playerCards', ({ cards, leftoverCards = [] }) => {
      setPlayerCards(cards);
      setLeftoverCards(leftoverCards);
    });

    socket.on('gameStart', () => {
      setCardsShown([]);
      socket.emit('requestCards');
    });

    socket.on('cardShown', ({ username, card }) => {
      if (!card) return;

      if (cardsShown.some(shownCard => shownCard.name === card.name)) {
        return;
      }
      setCardsShown(prev => [...prev, card]);
    });

    return () => {
    };
  }, [socket, cardsShown]);

  const requestCards = () => {
    if (socket) {
      socket.emit('requestCards');
    }
  };

  return {
    playerCards,
    leftoverCards,
    cardsShown,
    requestCards
  };
}