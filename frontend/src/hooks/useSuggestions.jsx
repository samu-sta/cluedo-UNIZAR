import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para gestionar las sugerencias y acusaciones
 * Responsabilidad: Controlar la lógica de acusaciones, sugerencias y respuestas
 */
export function useSuggestions(socket, gameInfo, isMyTurn) {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [canMakeSuggestion, setCanMakeSuggestion] = useState(false);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [showAccusationModal, setShowAccusationModal] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [suggestionResponses, setSuggestionResponses] = useState([]);
  const [incorrectAccusation, setIncorrectAccusation] = useState(false);
  const [incorrectAccusationMessage, setIncorrectAccusationMessage] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  const resetSuggestions = useCallback(() => {
    setSuggestionResponses([]);
    setCurrentSuggestion(null);
    setShowCardModal(false);
    setShowSuggestionModal(false);
    setShowAccusationModal(false);
    setIncorrectAccusation(false);
    setIncorrectAccusationMessage('');
  }, []);

  const checkIfInRoom = useCallback(() => {
    if (!gameInfo?.board?.rooms || !user) return false;

    const players = gameInfo.players || [];
    const currentPlayer = players.find(p => p.username === user.username);
    if (!currentPlayer || !currentPlayer.position) return false;

    const { row, column } = currentPlayer.position;

    for (const room of gameInfo.board.rooms) {
      const isInDoor = room.doors.some(door =>
        door.row === row && door.column === column
      );

      if (isInDoor) continue;

      if (isPositionInsideRoom(room, { row, column })) {
        setCurrentRoom(room.name);
        return true;
      }
    }

    setCurrentRoom(null);
    return false;
  }, [gameInfo, user]);

  const isPositionInsideRoom = (room, position) => {
    if (!room.walls || room.walls.length < 3) return false;

    let minRow = Infinity, maxRow = -Infinity;
    let minCol = Infinity, maxCol = -Infinity;

    room.walls.forEach(wall => {
      minRow = Math.min(minRow, wall.row);
      maxRow = Math.max(maxRow, wall.row);
      minCol = Math.min(minCol, wall.column);
      maxCol = Math.max(maxCol, wall.column);
    });

    return (
      position.row > minRow && position.row < maxRow &&
      position.column > minCol && position.column < maxCol
    );
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('currentSuggestion', ({ suggestion }) => {
      setCurrentSuggestion(suggestion);
      setShowCardModal(true);
    });

    socket.on('incorrectAccusation', ({ message }) => {
      setIncorrectAccusation(true);
      setIncorrectAccusationMessage(message);
    });

    socket.on('cardShown', ({ username, card }) => {
      setSuggestionResponses(prev => [...prev, { username, card }]);
    });

    return () => {
    };
  }, [socket]);

  useEffect(() => {
    if (isMyTurn) {
      const hasRolled = gameInfo?.hasRolled || false;
      const hasMoved = gameInfo?.hasMoved || false;
      const hasSuggested = gameInfo?.hasSuggested || false;
      setCanMakeSuggestion(hasRolled && hasMoved && checkIfInRoom() && !hasSuggested);
    } else {
      setCanMakeSuggestion(false);
    }
  }, [isMyTurn, gameInfo, checkIfInRoom]);

  const makeSuggestion = (suggestion) => {
    if (socket && isMyTurn && canMakeSuggestion) {
      socket.emit('makeSuggestion', suggestion);
    }
  };

  const makeAccusation = (accusation) => {
    if (socket && isMyTurn) {
      socket.emit('makeAccusation', accusation);
    }
  };

  const showCard = (card) => {
    if (socket) {
      socket.emit('showCard', card);
    }
  };

  const resetIncorrectAccusation = () => {
    setIncorrectAccusation(false);
  };

  return {
    currentRoom,
    canMakeSuggestion,
    showSuggestionModal,
    setShowSuggestionModal,
    showAccusationModal,
    setShowAccusationModal,
    currentSuggestion,
    showCardModal,
    setShowCardModal,
    suggestionResponses,
    setSuggestionResponses,
    incorrectAccusation,
    incorrectAccusationMessage,
    makeSuggestion,
    makeAccusation,
    showCard,
    resetIncorrectAccusation,
    checkIfInRoom,
    resetSuggestions
  };
}