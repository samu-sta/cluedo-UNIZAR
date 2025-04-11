import { Link } from 'react-router-dom';
import { HOME, ROUTES } from '../../../utils/constants';
import '../styles/CTASection.css';

const CTASection = () => (
  <section className="home-cta">
    <h2>{HOME.CTA.TITLE}</h2>
    <p className="home-cta-description">{HOME.CTA.DESCRIPTION}</p>

    <section className="home-cta-actions">
      <Link to={ROUTES.REGISTER} className="btn primary large with-shadow pulse">
        {HOME.CTA.BUTTON}
      </Link>
      <p className="home-cta-note">{HOME.CTA.NOTE}</p>
    </section>
  </section >
);

export default CTASection;