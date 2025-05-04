/*************************************************
 * Indicador de turno
 * 
 * Muestra información sobre el turno actual del juego,
 * incluyendo qué jugador tiene el turno y botones de
 * acción disponibles para el usuario activo.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

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
    <article className='turn-indicator'>
      <header className="turn-info">
        <h3>Turno de: <span className="turn-player-name">{currentTurn.playerName}</span></h3>
        <p className="turn-counter">
          Turno {currentTurn.turnIndex + 1}/{currentTurn.totalPlayers}
        </p>
      </header>

      {isMyTurn && (
        <section className="turn-actions">

          {/* Botón para hacer sugerencia - solo visible cuando el jugador está en una habitación */}
          {canMakeSuggestion && (
            <button
              className="btn suggestion"
              onClick={onMakeSuggestion}
            >
              Hacer Sugerencia
            </button>
          )}

          <button
            className="btn accusation"
            onClick={onMakeAccusation}
          >
            Hacer Acusación
          </button>

          <button
            className="btn pass-turn"
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