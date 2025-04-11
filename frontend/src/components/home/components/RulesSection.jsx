import { Link } from 'react-router-dom';
import { HOME, ROUTES } from '../../../utils/constants';
import SectionTitle from './SectionTitle';
import '../styles/RulesSection.css';

const RulesSection = ({ isMobile }) => (
  <section className="home-rules">

    <SectionTitle>{HOME.RULES.TITLE}</SectionTitle>

    <article className={`home-rules-content ${isMobile ? 'mobile' : 'desktop'}`}>
      <header className="home-rules-text">
        <h2 className="home-rule-badge">Instrucciones</h2>
        <h3>{HOME.RULES.SUBTITLE}</h3>
        <p>{HOME.RULES.DESCRIPTION}</p>

        <ul className="home-rules-list">
          {HOME.RULES.ITEMS.map((item, index) => (
            <li key={index} className="home-rule-item">
              <span className="home-rule-number">{index + 1}</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <Link to={ROUTES.RULES} className="btn outline with-arrow">
          {HOME.RULES.VIEW_RULES_BTN}
          <span className="btn-arrow" aria-hidden="true">→</span>
        </Link>
      </header>
      <img
        src={HOME.IMAGES.GAME_BOARD}
        alt="Tablero de juego de Cluedo"
        className="home-rules-image"
      />
    </article>
  </section>
);

export default RulesSection;