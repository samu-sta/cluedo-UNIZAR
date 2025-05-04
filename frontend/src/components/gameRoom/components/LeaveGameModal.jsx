import { createPortal } from 'react-dom';
import '../styles/LeaveGameModal.css';

const LeaveGameModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay">
      <article className="modal-container">
        <h2>¿Abandonar partida?</h2>
        <p className='leave-modal-content-p'>
          ¿Estás seguro de que deseas abandonar la partida? Esta acción no se puede deshacer.</p>

        <section className="modal-actions">
          <button
            className="btn secondary"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="btn danger"
            onClick={onConfirm}
          >
            Abandonar partida
          </button>
        </section>
      </article>
    </div>,
    document.body
  );
};

export default LeaveGameModal;