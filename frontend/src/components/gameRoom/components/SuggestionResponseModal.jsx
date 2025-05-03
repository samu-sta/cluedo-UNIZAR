/**
 * @fileoverview Componente modal que muestra las respuestas a una sugerencia realizada
 * @author Samuel Felipe
 */
import { useSuggestionResponseModal } from '../hooks/useSuggestionResponseModal';
import CharacterBadge from '../../../components/common/CharacterBadge';
import GameCard from './playerCards/components/GameCard';
import '../styles/SuggestionResponseModal.css';

const SuggestionResponseModal = ({ players, hasSuggested, suggestionResponses = [], setSuggestionResponses }) => {
  const {
    showResponseModal,
    closeResponseModal
  } = useSuggestionResponseModal({ hasSuggested, suggestionResponses, setSuggestionResponses });

  const user = JSON.parse(localStorage.getItem('user'));

  if (!showResponseModal) return null;

  const otherPlayers = players.filter(player => player.username !== user?.username);

  return (
    <div className="modal-backdrop">
      <article className="suggestion-response-modal">
        <header className="modal-header">
          <h2>Respuestas a tu sugerencia</h2>
          <button className="close-button" onClick={closeResponseModal}>×</button>
        </header>

        <ul className="players-responses-container">
          {otherPlayers.map((player) => {
            const playerResponse = suggestionResponses.find(
              response => response.username === player.username
            );

            return (
              <li key={player.username} className="player-response-item">
                <CharacterBadge character={player.character} />

                <section className="player-shown-card">
                  {playerResponse ? (
                    playerResponse.card ? (
                      <GameCard
                        card={playerResponse.card}
                        type={playerResponse.card.type}
                      />
                    ) : (
                      <span className="no-card">No mostró ninguna carta</span>
                    )
                  ) : (
                    <span className="waiting-response">Esperando respuesta</span>
                  )}
                </section>
              </li>
            );
          })}
        </ul>
      </article>
    </div>
  );
};

export default SuggestionResponseModal;
