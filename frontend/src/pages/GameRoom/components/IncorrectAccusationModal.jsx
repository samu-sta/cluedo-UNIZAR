import { createPortal } from 'react-dom';
import './styles/IncorrectAccusationModal.css';

const IncorrectAccusationModal = ({ isOpen, onLeaveGame, message }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay">
      <article className="incorrect-accusation-modal">
        <h2>Acusación Incorrecta</h2>

        <main className="incorrect-accusation-content">
          <figure className="incorrect-icon">❌</figure>
          <p>{message || 'Tu acusación es incorrecta. Has sido eliminado de la partida.'}</p>
        </main>

        <aside className="incorrect-accusation-actions">
          <button
            className="btn primary"
            onClick={onLeaveGame}
          >
            Abandonar Partida
          </button>
        </aside>
      </article>
    </div>,
    document.body
  );
};

export default IncorrectAccusationModal;