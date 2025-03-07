import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useStartGames = () => {
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const [searchTimeout, setSearchTimeout] = useState(null);

  const handleSearchGame = () => {
    setIsSearching(true);

    // Simulación de búsqueda
    const timeoutId = setTimeout(() => {
      navigate('/game/12345');
    }, 3000);

    setSearchTimeout(timeoutId);
  };

  const handleCancelSearch = () => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
      setSearchTimeout(null);
    }

    setIsSearching(false);
  };

  return {
    isSearching,
    handleSearchGame,
    handleCancelSearch,
  };
}

export default useStartGames;