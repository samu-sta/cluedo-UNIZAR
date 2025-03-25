import GameCard from './GameCard';
import '../styles/CardColumn.css';

const CardColumn = ({ title, cards, cardType, isLeftover = false }) => {
  return (
    <article className={`card-column ${isLeftover ? 'leftover' : ''}`}>
      <h4>{title}</h4>
      <ul className="card-grid">
        {cards.map((card, index) => (
          <li key={`${cardType}-${index}`}>
            <GameCard
              card={card}
              type={cardType}
              isLeftover={isLeftover}
            />
          </li>
        ))}
      </ul>
    </article>
  );
};

export default CardColumn;