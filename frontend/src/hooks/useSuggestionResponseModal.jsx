import { useEffect, useState } from 'react';

export function useSuggestionResponseModal({ hasSuggested, suggestionResponses, setSuggestionResponses }) {
  const [showResponseModal, setShowResponseModal] = useState(false);

  useEffect(() => {
    if (hasSuggested) {
      openResponseModal();
    }
  }, [hasSuggested]);

  const openResponseModal = () => {
    setShowResponseModal(true);
  };

  const closeResponseModal = () => {
    setShowResponseModal(false);
    setSuggestionResponses([]);
  };

  return {
    showResponseModal,
    openResponseModal,
    closeResponseModal
  };
}