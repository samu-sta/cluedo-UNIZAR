/*************************************************
 * Pruebas para el componente FeaturesSection
 * 
 * Verifica que la sección de características muestre
 * correctamente el título, descripción y la lista
 * de tarjetas con las funciones del juego.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import { render, screen } from '@testing-library/react';
import FeaturesSection from '../../../../src/components/home/components/FeaturesSection';
import { HOME } from '../../../../src/utils/constants';

jest.mock('../../../../src/components/home/components/FeatureCard', () => {
  return function MockFeatureCard({ icon, iconLabel, title, description }) {
    return (
      <div data-testid="feature-card">
        <div>{icon}</div>
        <div>{iconLabel}</div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    );
  };
});

describe('FeaturesSection Component', () => {
  test('renders title and subtitle correctly', () => {
    render(<FeaturesSection />);

    expect(screen.getByText(HOME.FEATURES.TITLE)).toBeInTheDocument();
    expect(screen.getByText(HOME.FEATURES.DESCRIPTION)).toBeInTheDocument();
  });

  test('renders all feature cards', () => {
    render(<FeaturesSection />);

    const featureCards = screen.getAllByTestId('feature-card');
    expect(featureCards).toHaveLength(HOME.FEATURES.ITEMS.length);

    HOME.FEATURES.ITEMS.forEach((feature, _index) => {
      expect(screen.getByText(feature.title)).toBeInTheDocument();
      expect(screen.getByText(feature.description)).toBeInTheDocument();
    });
  });
});