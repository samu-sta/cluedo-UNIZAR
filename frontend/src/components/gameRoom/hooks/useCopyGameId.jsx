import { useState } from 'react';

const useCopyGameId = ({ gameId, handleError }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyGameId = () => {
    navigator.clipboard.writeText(gameId)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        if (handleError) {
          handleError(err);
        }
      });
  };

  return { copied, handleCopyGameId };
}

export default useCopyGameId;