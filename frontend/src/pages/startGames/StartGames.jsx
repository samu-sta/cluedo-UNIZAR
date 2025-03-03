import './styles/StartGames.css';
import useStartGames from '../../hooks/useStartGames';
const Games = () => {
  const { isSearching, handleSearchGame, handleCancelSearch } = useStartGames();

  return (
    <main className="games-container">
      <span className="decorative-element circle top-left" aria-hidden="true"></span>
      <span className="decorative-element dots bottom-right" aria-hidden="true"></span>

      <section className="games-content">
        <header className="games-header">
          <h1 className="games-title">
            Partidas de <span className="accent">Cluedo UNIZAR</span>
          </h1>
          <p className="games-subtitle">
            Únete a una partida para resolver el misterio
          </p>
        </header>

        <section className={`search-game-container ${isSearching ? 'searching' : ''}`}>
          {!isSearching ? (
            <>
              <button
                className="btn primary large with-shadow search-button"
                onClick={handleSearchGame}
              >
                Buscar partida pública
              </button>

            </>
          ) : (
            <section className="searching-container">
              <figure className="loading-spinner"></figure>
              <h2>Buscando partida</h2>
              <p className="searching-text">Conectando con otros detectives...</p>
              <button
                className="btn outline cancel-button"
                onClick={handleCancelSearch}
              >
                Cancelar búsqueda
              </button>
            </section>
          )}
        </section>
      </section>
    </main>
  );
};

export default Games;