/*************************************************
 * Pruebas para el componente RulesSection
 * 
 * Verifica que la sección de reglas del juego muestre
 * correctamente el título, descripción y la lista
 * de reglas principales con su formato adecuado.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RulesSection from '../../../../src/components/home/components/RulesSection';
import { HOME, ROUTES } from '../../../../src/utils/constants';

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('RulesSection Component', () => {
  test('renders section title correctly', () => {
    renderWithRouter(<RulesSection isMobile={false} />);

    expect(screen.getByText(HOME.RULES.TITLE)).toBeInTheDocument();
  });

  test('renders content correctly', () => {
    renderWithRouter(<RulesSection isMobile={false} />);

    expect(screen.getByText('Instrucciones')).toBeInTheDocument();
    expect(screen.getByText(HOME.RULES.SUBTITLE)).toBeInTheDocument();
    expect(screen.getByText(HOME.RULES.DESCRIPTION)).toBeInTheDocument();
  });

  test('renders all rule items', () => {
    renderWithRouter(<RulesSection isMobile={false} />);

    HOME.RULES.ITEMS.forEach((item, index) => {
      expect(screen.getByText(item)).toBeInTheDocument();
      expect(screen.getByText(`${index + 1}`)).toBeInTheDocument();
    });
  });

  test('renders image with correct attributes', () => {
    renderWithRouter(<RulesSection isMobile={false} />);

    const image = screen.getByAltText('Tablero de juego de Cluedo');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', HOME.IMAGES.GAME_BOARD);
    expect(image).toHaveClass('home-rules-image');
  });
});