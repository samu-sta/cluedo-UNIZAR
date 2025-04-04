import { useState } from 'react';
import { createPortal } from 'react-dom';
import './styles/AccusationModal.css';

const AccusationModal = ({ isOpen, onClose, onSubmit, gameInfo }) => {
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [selectedWeapon, setSelectedWeapon] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');

  if (!isOpen || !gameInfo) return null;

  const characters = gameInfo.cards.filter(card => card.type === 'character') || [];
  const weapons = gameInfo.cards.filter(card => card.type === 'weapon') || [];
  const rooms = gameInfo.cards.filter(card => card.type === 'room') || [];

  const handleSubmit = () => {
    if (selectedCharacter && selectedWeapon && selectedRoom) {
      onSubmit({
        character: selectedCharacter,
        weapon: selectedWeapon,
        room: selectedRoom
      });
    }
  };

  return createPortal(
    <div className="modal-overlay">
      <article className="accusation-modal">
        <h2>Hacer Acusación Final</h2>
        <p className="accusation-warning">
          ⚠️ Atención: Si tu acusación es incorrecta, serás eliminado de la partida.
        </p>

        <main className="accusation-selectors">
          <section className="accusation-section">
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

          <section className="accusation-section">
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

          <section className="accusation-section">
            <h3>Habitación</h3>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              required
            >
              <option value="">Selecciona una habitación</option>
              {rooms.map(room => (
                <option key={room.name} value={room.name}>
                  {room.name}
                </option>
              ))}
            </select>
          </section>
        </main>

        <footer className="accusation-actions">
          <button
            className="btn secondary"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="btn danger"
            onClick={handleSubmit}
            disabled={!selectedCharacter || !selectedWeapon || !selectedRoom}
          >
            Hacer Acusación
          </button>
        </footer>
      </article>
    </div>,
    document.body
  );
};

export default AccusationModal;