import '../styles/GameCard.css';

const GameCard = ({ card, type, isLeftover = false }) => {
  return (
    <article className={`game-card ${type} ${isLeftover ? 'leftover' : ''}`}>
      <main className="card-content">
        <h5>{card.name}</h5>
        {isLeftover && <span className="leftover-badge">Sobrante</span>}
      </main>
    </article>
  );
};

export default GameCard;