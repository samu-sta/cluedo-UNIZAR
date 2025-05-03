/**
 * @fileoverview Componente de llamada a la acción para animar a los usuarios a registrarse
 * @author Samuel Felipe
 */
import { Link } from 'react-router-dom';
import { HOME, ROUTES } from '../../../utils/constants';
import '../styles/CTASection.css';

const CTASection = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <section className="home-cta">
      <h2>{user ? "¿Listo para investigar?" : HOME.CTA.TITLE}</h2>
      <p className="home-cta-description">
        {user ? "Resuelve el misterio en una partida de Cluedo UNIZAR" : HOME.CTA.DESCRIPTION}
      </p>

      <section className="home-cta-actions">
        {user ? (
          <Link to={ROUTES.GAMES} className="btn primary large with-shadow pulse">
            Jugar Partida
          </Link>
        ) : (
          <>
            <Link to={ROUTES.REGISTER} className="btn primary large with-shadow pulse">
              {HOME.CTA.BUTTON}
            </Link>
            <p className="home-cta-note">{HOME.CTA.NOTE}</p>
          </>
        )}
      </section>
    </section>
  );
};

export default CTASection;