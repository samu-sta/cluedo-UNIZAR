/**
 * @fileoverview Componente de características que muestra las ventajas del juego
 * @author Samuel Felipe
 */
import { HOME } from '../../../utils/constants';
import SectionTitle from './SectionTitle';
import FeatureCard from './FeatureCard';
import '../styles/FeaturesSection.css';

const FeaturesSection = () => (
  <section className="features">

    <SectionTitle>{HOME.FEATURES.TITLE}</SectionTitle>
    <p className="section-subtitle">{HOME.FEATURES.DESCRIPTION}</p>

    <ul className="feature-list">
      {HOME.FEATURES.ITEMS.map((feature, index) => (
        <FeatureCard
          key={index}
          icon={feature.icon}
          iconLabel={feature.iconLabel}
          title={feature.title}
          description={feature.description}
          index={index}
        />
      ))}
    </ul>
  </section>
);

export default FeaturesSection;