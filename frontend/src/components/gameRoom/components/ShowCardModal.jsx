import React, { useState, useEffect } from 'react';
import GameCard from './playerCards/components/GameCard';
import '../styles/ShowCardModal.css';

const ShowCardModal = ({ isOpen, onSubmit, playerCards, currentSuggestion }) => {
  if (!isOpen) return null;

  const [matchingCards, setMatchingCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);



  useEffect(() => {
    if (currentSuggestion && playerCards) {
      const matching = playerCards.filter(card =>
        (card.type === 'character' && card.name === currentSuggestion.character) ||
        (card.type === 'weapon' && card.name === currentSuggestion.weapon) ||
        (card.type === 'room' && card.name === currentSuggestion.room)
      );
      setMatchingCards(matching);
      if (matching.length === 1) {
        setSelectedCard(matching[0]);
      } else {
        setSelectedCard(null);
      }
    }
  }, [currentSuggestion, playerCards]);



  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleSubmit = () => {
    onSubmit(selectedCard);
  };

  const handleNoCards = () => {
    onSubmit(null);
  };

  return (
    <div className="modal-backdrop">
      <article className="modal-show-card">
        <header className="modal-show-card-header">
          <h2>Responde a la sugerencia</h2>
        </header>

        <main className="modal-show-card-content">
          <p><strong>{currentSuggestion.username}</strong> ha sugerido:</p>
          <ul className='modal-show-card-content-ul'>
            <li><strong>Personaje:</strong> {currentSuggestion.character}</li>
            <li><strong>Arma:</strong> {currentSuggestion.weapon}</li>
            <li><strong>Habitación:</strong> {currentSuggestion.room}</li>
          </ul>

          {matchingCards.length > 0 ? (
            <>
              <p>Tienes las siguientes cartas que coinciden con la sugerencia. Selecciona una para mostrar:</p>

              <ul className="matching-cards-grid">
                {matchingCards.map(card => (
                  <GameCard
                    card={card}
                    type={card.type}
                    key={card.id}
                    onClick={() => handleCardClick(card)}
                    className={`${selectedCard === card ? 'selected' : ''}`}
                  />
                ))}
              </ul>
            </>
          ) : (
            <p className="no-cards-message">No tienes ninguna carta que coincida con la sugerencia.</p>
          )}
        </main>

        <footer className="modal-show-card-footer">
          {matchingCards.length > 0 ? (
            <button
              className={`btn primary ${!selectedCard && matchingCards.length > 1 ? 'disabled' : ''}`}
              onClick={handleSubmit}
              disabled={!selectedCard && matchingCards.length > 1}
            >
              Mostrar carta
            </button>
          ) : (
            <button className="btn secondary" onClick={handleNoCards}>
              No tengo ninguna carta
            </button>
          )}
        </footer>
      </article>
    </div>
  );
};

export default ShowCardModal;