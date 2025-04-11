import { useState, useEffect } from 'react';
import useIsMobile from '../../../../common/hooks/useIsMobile';
const IS_MOBILE_WIDTH = 750;

const useDeductions = (gameInfo, playerCards = [], leftoverCards = [], cardsShown) => {
  const isMobile = useIsMobile(IS_MOBILE_WIDTH);

  const [deductions, setDeductions] = useState({
    characters: {},
    weapons: {},
    rooms: {}
  });

  useEffect(() => {
    if (gameInfo && gameInfo.cards) {
      const newDeductions = {
        characters: {},
        weapons: {},
        rooms: {}
      };

      const cardsToDiscard = new Map();

      playerCards.forEach(card => {
        cardsToDiscard.set(card.name, true);
      });

      leftoverCards.forEach(card => {
        cardsToDiscard.set(card.name, true);
      });

      cardsShown.forEach(card => {
        cardsToDiscard.set(card.name, true);
      });

      gameInfo.cards.forEach(card => {
        const status = cardsToDiscard.has(card.name) ? 'no' : 'unknown';

        if (card.type === 'character') {
          newDeductions.characters[card.name] = status;
        } else if (card.type === 'weapon') {
          newDeductions.weapons[card.name] = status;
        } else if (card.type === 'room') {
          newDeductions.rooms[card.name] = status;
        }
      });

      setDeductions(newDeductions);
    }
  }, [gameInfo, playerCards, leftoverCards, cardsShown]);

  const updateDeduction = (category, name) => {
    setDeductions(prev => {
      const currentStatus = prev[category][name];
      let nextStatus;

      // Ciclo de estados: unknown -> no -> yes -> maybe -> unknown
      if (currentStatus === 'unknown') nextStatus = 'no';
      else if (currentStatus === 'no') nextStatus = 'yes';
      else if (currentStatus === 'yes') nextStatus = 'maybe';
      else nextStatus = 'unknown';

      return {
        ...prev,
        [category]: {
          ...prev[category],
          [name]: nextStatus
        }
      };
    });
  };

  return { deductions, updateDeduction, isMobile };
};

export default useDeductions;