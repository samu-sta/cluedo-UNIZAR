/**
 * @fileoverview Componente que implementa un cajón desplegable para mostrar las cartas del jugador
 * @author Samuel Felipe
 */
import { IoIosArrowDown } from "react-icons/io";
import CardSection from './CardSection';
import '../styles/CardDrawer.css';

const CardDrawer = ({ isCollapsed, toggleCollapse, totalCards, cardsData, leftoverCards = { characters: [], weapons: [], rooms: [] } }) => {
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
        <CardSection cardsData={cardsData} />

        <CardSection
          title="Cartas Sobrantes"
          cardsData={leftoverCards}
          isLeftover={true}
          className="leftover-section"
        />
      </main>
    </section>
  );
};

export default CardDrawer;