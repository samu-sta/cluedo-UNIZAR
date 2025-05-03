/**
 * @fileoverview Componente que representa una carta del juego, mostrando su nombre y tipo
 * @author Samuel Felipe
 */
import '../styles/GameCard.css';

const GameCard = ({ card, type, isLeftover = false, onClick, className }) => {
  return (
    <article
      className={`game-card ${type} ${isLeftover ? 'leftover' : ''} ${className}`}
      onClick={onClick || undefined}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <main className="card-content">
        <h5>{card.name}</h5>
        {isLeftover && <span className="leftover-badge">Sobrante</span>}
      </main>
    </article>
  );
};

export default GameCard;