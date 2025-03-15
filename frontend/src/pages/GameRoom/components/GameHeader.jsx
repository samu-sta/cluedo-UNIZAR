import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { LuCopy } from "react-icons/lu";
import useCopyGameId from '../../../hooks/useCopyGameId';
import LeaveGameModal from './LeaveGameModal';
import useLeaveGameModal from '../../../hooks/useLeaveGameModal';
import './styles/GameHeader.css';

const GameHeader = ({ gameId, gameState, onLeaveGame }) => {
  const { copied, handleCopyGameId } = useCopyGameId({ gameId });

  const {
    showModal,
    handleOpenModal,
    handleCloseModal,
    handleConfirmLeave
  } = useLeaveGameModal({ onLeaveGame });

  return (
    <>
      <header className="game-header">
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