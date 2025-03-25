import { IoIosArrowDown } from "react-icons/io";
import CardColumn from './CardColumn';
import '../styles/CardDrawer.css';

const CardDrawer = ({ isCollapsed, toggleCollapse, totalCards, cardsData }) => {
  const { characters, weapons, rooms } = cardsData;

  return (
    <section className={`player-cards-drawer ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <header className="drawer-header" onClick={toggleCollapse}>
        <h3>Tus Cartas ({totalCards})</h3>
        <button className={`btn toggle-drawer ${isCollapsed ? 'collapsed' : 'expanded'}`}
          aria-label="Mostrar u ocultar cartas">
          <IoIosArrowDown />
        </button>
      </header>
      <main className="cards-container">
        {characters.length > 0 && (
          <CardColumn
            title="Personajes"
            cards={characters}
            cardType="character"
          />
        )}

        {weapons.length > 0 && (
          <CardColumn
            title="Armas"
            cards={weapons}
            cardType="weapon"
          />
        )}

        {rooms.length > 0 && (
          <CardColumn
            title="Habitaciones"
            cards={rooms}
            cardType="room"
          />
        )}
      </main>
    </section>
  );
};

export default CardDrawer;