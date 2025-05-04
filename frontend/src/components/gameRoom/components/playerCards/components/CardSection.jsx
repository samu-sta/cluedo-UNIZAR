/**
 * @fileoverview Componente que muestra una sección de cartas del juego separadas por categoría
 * @author Samuel Felipe
 */
import CardColumn from './CardColumn';
import '../styles/CardSection.css';

const CardSection = ({
  title,
  cardsData,
  isLeftover = false,
  className = ''
}) => {
  const { characters, weapons, rooms } = cardsData;

  const hasCards = characters.length > 0 || weapons.length > 0 || rooms.length > 0;

  if (!hasCards) return null;

  return (
    <section className={`cards-section ${isLeftover ? 'leftover' : ''} ${className}`}>
      {title && (
        <h3 className="section-title">{title}</h3>
      )}

      <main className="cards-grid">
        {characters.length > 0 && (
          <CardColumn
            title="Personajes"
            cards={characters}
            cardType="character"
            isLeftover={isLeftover}
          />
        )}

        {weapons.length > 0 && (
          <CardColumn
            title="Armas"
            cards={weapons}
            cardType="weapon"
            isLeftover={isLeftover}
          />
        )}

        {rooms.length > 0 && (
          <CardColumn
            title="Habitaciones"
            cards={rooms}
            cardType="room"
            isLeftover={isLeftover}
          />
        )}
      </main>
    </section>
  );
};

export default CardSection;