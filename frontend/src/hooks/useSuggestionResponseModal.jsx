import { useEffect, useState } from 'react';

const mockResponses = [
  {
    username: 'sfelipe',
    card: {
      name: 'Profesor Ciruela',
      type: 'character'
    }
  },
  {
    username: 'samu-stad',
    card: null
  },


]

export function useSuggestionResponseModal({ hasSuggested }) {
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [suggestionResponses, setSuggestionResponses] = useState({});

  useEffect(() => {
    if (hasSuggested) {
      openResponseModal(mockResponses);
    }
  }, [hasSuggested]);

  const openResponseModal = (responses) => {
    setSuggestionResponses(responses);
    setShowResponseModal(true);
  };

  const closeResponseModal = () => {
    setShowResponseModal(false);
  };

  return {
    showResponseModal,
    suggestionResponses,
    openResponseModal,
    closeResponseModal
  };
}