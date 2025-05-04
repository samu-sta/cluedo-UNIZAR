import { useState, useEffect } from 'react';

const useGameEndedModal = (gameState) => {
  const [showEndedModal, setShowEndedModal] = useState(false);


  useEffect(() => {
    if (gameState === 'ended') {
      setShowEndedModal(true);
    }
  }, [gameState]);

  const toogleEndedModal = () => {
    setShowEndedModal(false);
  };

  return {
    showEndedModal,
    toogleEndedModal
  };
}

export default useGameEndedModal;