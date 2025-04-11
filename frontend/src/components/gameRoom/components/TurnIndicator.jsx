import '../styles/TurnIndicator.css';

const TurnIndicator = ({
  currentTurn,
  isMyTurn,
  onPassTurn,
  onMakeAccusation,
  onMakeSuggestion,
  canMakeSuggestion
}) => {

  return (
    <article className={`turn-indicator ${isMyTurn ? 'my-turn' : ''}`}>
      <header className="turn-info">
        <h3>Turno de: <span className="turn-player-name">{currentTurn.playerName}</span></h3>
        <p className="turn-counter">
          Turno {currentTurn.turnIndex + 1}/{currentTurn.totalPlayers}
        </p>
      </header>

      {isMyTurn && (
        <section className="turn-actions">
          <p className="turn-notification">¡Es tu turno!</p>

          {/* Botón para hacer sugerencia - solo visible cuando el jugador está en una habitación */}
          {canMakeSuggestion && (
            <button
              className="btn accent"
              onClick={onMakeSuggestion}
            >
              Hacer Sugerencia
            </button>
          )}

          <button
            className="btn danger"
            onClick={onMakeAccusation}
          >
            Hacer Acusación
          </button>

          <button
            className="btn primary pass-turn-btn"
            onClick={onPassTurn}
          >
            Pasar turno
          </button>
        </section>
      )}
    </article>
  );
};

export default TurnIndicator;