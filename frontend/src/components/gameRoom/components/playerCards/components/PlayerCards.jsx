/**
 * @fileoverview Componente principal que gestiona la visualización de las cartas del jugador en el juego
 * @author Samuel Felipe
 */
import { useState } from 'react';
import CardDrawer from './CardDrawer';
import '../styles/PlayerCards.css';

import React from 'react';
import PropTypes from 'prop-types';

const PlayerCards = ({ cards }) => {
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  return (
    <div className="player-cards">
      {cards.map((card) => (
        <div
          key={card.id}
          className={`card ${selectedCard === card ? 'selected' : ''}`}
          onClick={() => handleCardClick(card)}
        >
          {card.name}
        </div>
      ))}
      {selectedCard && <CardDrawer card={selectedCard} />}
    </div>
  );
};

PlayerCards.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default PlayerCards;