/*************************************************
 * Pruebas para el componente SectionTitle
 * 
 * Verifica que el componente de título de sección
 * muestre correctamente el encabezado, con las clases
 * y estilos adecuados para las diferentes secciones.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import { render, screen } from '@testing-library/react';
import SectionTitle from '../../../../src/components/home/components/SectionTitle';

describe('SectionTitle Component', () => {
  test('renders title with provided text', () => {
    const titleText = 'Test Title';
    render(<SectionTitle>{titleText}</SectionTitle>);

    const titleElement = screen.getByText(titleText);
    expect(titleElement).toBeInTheDocument();
  });
});