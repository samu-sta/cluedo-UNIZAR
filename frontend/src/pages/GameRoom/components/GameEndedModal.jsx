import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import './styles/GameEndedModal.css';

const GameEndedModal = ({ isOpen, winner, reason, toogleEndedModal }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoToLobby = () => {
    toogleEndedModal();
    navigate('/');
  };

  const handlePlayAgain = () => {
    toogleEndedModal();
    navigate('/games');
  };

  return createPortal(
    <div className="modal-overlay">
      <article className="modal-container game-ended">
        <div className="modal-content">
          <h2>Partida finalizada</h2>

          {winner ? (
            <div className="winner-section">
              <p className="winner-label">Ganador:</p>
              <p className="winner-name">{winner}</p>
            </div>
          ) : (
            <p className="end-reason">{reason || 'La partida ha terminado'}</p>
          )}

          <section className="modal-actions">
            <button
              className="btn secondary"
              onClick={handleGoToLobby}
            >
              Volver al lobby
            </button>
            <button
              className="btn primary"
              onClick={handlePlayAgain}
            >
              Crear nueva partida
            </button>
          </section>
        </div>
      </article>
    </div>,
    document.body
  );
};

export default GameEndedModal;