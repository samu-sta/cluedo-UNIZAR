import { useState } from 'react';

const useLeaveGameModal = ({ onLeaveGame }) => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmLeave = () => {
    setShowModal(false);
    onLeaveGame();
  };

  return {
    showModal,
    handleOpenModal,
    handleCloseModal,
    handleConfirmLeave
  };
}

export default useLeaveGameModal;