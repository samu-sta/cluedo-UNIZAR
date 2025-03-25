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

  const organizedCards = {
    characters: cards.filter(card => card.type === 'character'),
    weapons: cards.filter(card => card.type === 'weapon'),
    rooms: cards.filter(card => card.type === 'room')
  };

  const organizedLeftoverCards = {
    characters: leftoverCards.filter(card => card.type === 'character'),
    weapons: leftoverCards.filter(card => card.type === 'weapon'),
    rooms: leftoverCards.filter(card => card.type === 'room')
  };

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