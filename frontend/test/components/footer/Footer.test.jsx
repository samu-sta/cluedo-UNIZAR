/*************************************************
 * Pruebas para el componente Footer
 * 
 * Verifica que el pie de página muestre correctamente
 * la información de créditos y copyright del juego,
 * así como su estilo y estructura adecuados.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../../../src/components/footer/Footer';

describe('Footer Component', () => {
  test('renders footer component correctly', () => {
    render(<Footer />);

    const credits = screen.getByText(/Hecho por Samuel Felipe y Daniel Sanagustin./i);
    expect(credits).toBeInTheDocument();

    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toHaveClass('footer');
  });

  test('displays the current year in the copyright message', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    const copyrightText = screen.getByText(new RegExp(`© ${currentYear} Cluedo UNIZAR`, 'i'));
    expect(copyrightText).toBeInTheDocument();
  });

  test('displays all expected elements', () => {
    const { container } = render(<Footer />);

    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs.length).toBe(2);

    expect(paragraphs[0]).toHaveClass('footer-credits');
    expect(paragraphs[1]).toHaveClass('footer-copyright');
  });
});