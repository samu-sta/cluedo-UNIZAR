import { FaCheck } from 'react-icons/fa';
import { LuCopy } from "react-icons/lu";
import useCopyGameId from '../hooks/useCopyGameId';
import LeaveGameModal from './LeaveGameModal';
import useLeaveGameModal from '../hooks/useLeaveGameModal';
import useIsMobile from '../../common/hooks/useIsMobile';
import '../styles/GameHeader.css';

const maxWidth = 430;

const GameHeader = ({ gameId, gameState, onLeaveGame, players }) => {
  const { copied, handleCopyGameId } = useCopyGameId({ gameId });
  const isMobile = useIsMobile(maxWidth);
  const user = JSON.parse(localStorage.getItem('user'));

  const {
    showModal,
    handleOpenModal,
    handleCloseModal,
    handleConfirmLeave
  } = useLeaveGameModal({ onLeaveGame });

  const currentPlayer = players.find(player => player.username === user?.username);
  const character = currentPlayer?.character || null;

  const characterName = character?.name;
  const characterBackground = character?.colorHex || '#000000';
  const characterTextColor = character?.textColorHex || '#ffffff';

  return (
    <>
      <header className={`game-header ${isMobile ? 'mobile' : ''}`}>
        {/* Sección del personaje (izquierda) */}
        <section>
          {character && (
            <article
              className="character-badge"
              style={{
                backgroundColor: characterBackground,
                color: characterTextColor
              }}
            >
              {characterName}
            </article>
          )}
        </section>

        {/* Sección de botones y estado (derecha) */}
        <section className="game-info-header">
          {gameState !== 'playing' &&
            <button
              className="btn secondary copy-button"
              onClick={handleCopyGameId}
              title="Copiar código de partida"
            >
              {copied
                ?
                <>
                  <FaCheck className="copy-icon copied" />
                  <span className="copy-text">Código copiado</span>
                </>
                :
                <>
                  <LuCopy className="copy-icon" />
                  <span className="copy-text">Copiar código de partida</span>
                </>}
            </button>
          }
          <button
            className="btn leave-game"
            onClick={handleOpenModal}
          >
            Abandonar partida
          </button>
          <span className={`status-badge ${gameState === 'playing' ? 'playing' : 'waiting'}`}>
            {gameState === 'playing' ? 'En juego' : 'En espera'}
          </span>
        </section>
      </header>

      <LeaveGameModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmLeave}
      />
    </>
  )
}

export default GameHeader;
