import GameCard from './GameCard';
import '../styles/CardColumn.css';

const CardColumn = ({ title, cards, cardType }) => {
  return (
    <article className="card-column">
      <h4>{title}</h4>
      <ul className="card-grid">
        {cards.map((card, index) => (
          <li>
            <GameCard
              key={`${cardType}-${index}`}
              card={card}
              type={cardType}
            />
          </li>
        ))}
      </ul>
    </article>
  );
};

export default CardColumn;