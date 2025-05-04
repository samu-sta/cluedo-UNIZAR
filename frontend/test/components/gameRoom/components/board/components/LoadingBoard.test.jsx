/*************************************************
 * Pruebas para el componente LoadingBoard
 * 
 * Verifica el comportamiento del componente que muestra
 * una animación de carga mientras se inicializa
 * el tablero de juego y sus componentes.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingBoard from '../../../../../../src/components/gameRoom/components/board/components/LoadingBoard';

describe('LoadingBoard Component', () => {
  test('renders loading spinner', () => {
    const { container } = render(<LoadingBoard />);
    expect(container.querySelector('.loading-spinner')).toBeInTheDocument();
  });

  test('renders loading text', () => {
    render(<LoadingBoard />);
    expect(screen.getByText('Cargando tablero...')).toBeInTheDocument();
  });
});