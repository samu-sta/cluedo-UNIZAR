/**
 * @fileoverview Hook personalizado para copiar el ID de la partida al portapapeles
 * @author Samuel Felipe
 */
import { useState } from 'react';

const useCopyGameId = ({ gameId, handleError }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyGameId = () => {
    // Verificar si la API del portapapeles está disponible
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(gameId)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          fallbackCopyTextToClipboard(gameId);
          if (handleError) {
            handleError(err);
          }
        });
    } else {
      // Método alternativo para navegadores que no soportan clipboard API
      fallbackCopyTextToClipboard(gameId);
    }
  };

  // Método de respaldo usando el elemento textarea temporal
  const fallbackCopyTextToClipboard = (text) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;

      // Hacer el textarea fuera de la vista del usuario
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.width = '2em';
      textArea.style.height = '2em';
      textArea.style.padding = '0';
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';
      textArea.style.background = 'transparent';

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Error al copiar texto: ', err);
      if (handleError) {
        handleError(err);
      }
    }
  };

  return { copied, handleCopyGameId };
}

export default useCopyGameId;