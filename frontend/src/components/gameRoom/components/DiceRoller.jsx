/**
 * @fileoverview Componente que muestra los dados y permite al jugador lanzarlos en su turno
 * @author Samuel Felipe
 */
import { useState, useEffect } from 'react';
import '../styles/DiceRoller.css';
import Die from './Die';

const DiceRoller = ({ diceResult, rollDice, isMyTurn, canRoll, setCanRoll }) => {
  const [isRolling, setIsRolling] = useState(false);

  useEffect(() => {
    if (diceResult) {
      // Cuando recibimos un resultado, terminamos la animación
      setTimeout(() => {
        setIsRolling(false)
        setCanRoll(false)
      }, 800);
      ;
    }
  }, [diceResult]);

  const handleRollClick = () => {
    setIsRolling(true);
    rollDice();
  };

  return (
    <article className={`dice-roller ${isMyTurn ? 'my-turn' : ''}`}>
      <section>
        {isMyTurn && (
          <button
            className={`btn primary roll-dice-btn ${canRoll ? '' : 'cantRoll'}`}
            onClick={handleRollClick}
            disabled={isRolling || !canRoll}
          >
            {isRolling ? 'Tirando...' : 'Tirar dados'}
          </button>
        )}
      </section>
      <section className={`dice-pair ${isRolling ? 'rolling' : ''}`}>
        {diceResult ? (
          <>
            <Die value={diceResult[0]} />
            <Die value={diceResult[1]} />
          </>
        ) : null
        }
      </section>
    </article>
  );
};

export default DiceRoller;