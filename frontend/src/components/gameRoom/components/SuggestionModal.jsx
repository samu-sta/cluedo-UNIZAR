/**
 * @fileoverview Componente modal que permite al jugador hacer una sugerencia sobre el caso
 * @author Samuel Felipe
 */
import { useState } from 'react';
import { createPortal } from 'react-dom';
import '../styles/SuggestionModal.css';

const SuggestionModal = ({ isOpen, onClose, onSubmit, gameInfo, currentRoom }) => {
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [selectedWeapon, setSelectedWeapon] = useState('');

  if (!isOpen || !gameInfo) return null;

  const characters = gameInfo.cards.filter(card => card.type === 'character') || [];
  const weapons = gameInfo.cards.filter(card => card.type === 'weapon') || [];

  const handleSubmit = () => {
    if (selectedCharacter && selectedWeapon && currentRoom) {
      onSubmit({
        character: selectedCharacter,
        weapon: selectedWeapon,
        room: currentRoom
      });
    }
  };

  return createPortal(
    <div className="modal-overlay">
      <article className="suggestion-modal">
        <h2>Hacer Sugerencia</h2>
        <p className="suggestion-info">
          Estás sugiriendo que el crimen ocurrió en la habitación <strong>{currentRoom}</strong>
        </p>

        <main className="suggestion-selectors">
          <section className="suggestion-section">
            <h3>Personaje</h3>
            <select
              value={selectedCharacter}
              onChange={(e) => setSelectedCharacter(e.target.value)}
              required
            >
              <option value="">Selecciona un personaje</option>
              {characters.map(character => (
                <option key={character.name} value={character.name}>
                  {character.name}
                </option>
              ))}
            </select>
          </section>

          <section className="suggestion-section">
            <h3>Arma</h3>
            <select
              value={selectedWeapon}
              onChange={(e) => setSelectedWeapon(e.target.value)}
              required
            >
              <option value="">Selecciona un arma</option>
              {weapons.map(weapon => (
                <option key={weapon.name} value={weapon.name}>
                  {weapon.name}
                </option>
              ))}
            </select>
          </section>
        </main>

        <section className="suggestion-actions">
          <button
            className="btn cancel"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="btn suggestion"
            onClick={handleSubmit}
            disabled={!selectedCharacter || !selectedWeapon}
          >
            Hacer Sugerencia
          </button>
        </section>
      </article>
    </div>,
    document.body
  );
};

export default SuggestionModal;