import './styles/TurnIndicator.css';

const TurnIndicator = ({ currentTurn, isMyTurn, onPassTurn }) => {
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