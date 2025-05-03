/**
 * @fileoverview Componente modal que se muestra cuando finaliza una partida
 * @author Samuel Felipe
 */
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import useGameEndedModal from '../hooks/useGameEndedModal';
import '../styles/GameEndedModal.css';

const GameEndedModal = ({ winner, reason, solution, gameState }) => {
  const navigate = useNavigate();

  const { showEndedModal, toogleEndedModal } = useGameEndedModal(gameState);


  if (!showEndedModal) return null;

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
        <h2>Partida finalizada</h2>

        {winner ? (
          <section className="winner-section">
            <p className="winner-label">Ganador:</p>
            <p className="winner-name">{winner}</p>
          </section>
        ) : (
          <p className="end-reason">{reason || 'La partida ha terminado'}</p>
        )}

        {solution && (
          <section className="solution-section">
            <h3>La solución era:</h3>
            <main className="solution-details">
              <p className='solution-details-p'>
                <strong>Personaje:</strong> {solution.character.name}
              </p>
              <p className='solution-details-p'>
                <strong>Arma:</strong> {solution.weapon.name}
              </p>
              <p className='solution-details-p'>
                <strong>Habitación:</strong> {solution.room.name}
              </p>
            </main>
          </section>
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
      </article>
    </div>,
    document.body
  );
};

export default GameEndedModal;