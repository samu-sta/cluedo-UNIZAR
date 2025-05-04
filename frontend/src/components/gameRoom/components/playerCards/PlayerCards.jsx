import { useState } from 'react';
import CardDrawer from './components/CardDrawer';

const PlayerCards = ({ cards = [], leftoverCards }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  if (!cards.length) {
    return null;
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const organizeCardsByType = (cardsArray = []) => {
    return {
      characters: cardsArray.filter(card => card.type === 'character'),
      weapons: cardsArray.filter(card => card.type === 'weapon'),
      rooms: cardsArray.filter(card => card.type === 'room')
    };
  };

  const organizedCards = organizeCardsByType(cards);
  const organizedLeftoverCards = organizeCardsByType(leftoverCards || []);

  return (
    <CardDrawer
      isCollapsed={isCollapsed}
      toggleCollapse={toggleCollapse}
      totalCards={cards.length}
      cardsData={organizedCards}
      leftoverCards={organizedLeftoverCards}
    />
  );
};

export default PlayerCards;