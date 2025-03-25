import '../styles/GameCard.css';

const GameCard = ({ card, type }) => {
  return (
    <article className={`game-card ${type}`}>
      <main className="card-content">
        <h5>{card.name}</h5>
      </main>
    </article>
  );
};

export default GameCard;