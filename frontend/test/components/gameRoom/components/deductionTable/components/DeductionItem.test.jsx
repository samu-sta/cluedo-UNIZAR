/*************************************************
 * Pruebas para el componente DeductionItem
 * 
 * Verifica el comportamiento de cada elemento individual
 * de la tabla de deducción, incluyendo la visualización
 * de estados y la gestión de clics del usuario.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DeductionItem from '../../../../../../src/components/gameRoom/components/deductionTable/components/DeductionItem';

jest.mock('react-icons/fa', () => ({
  FaCheck: () => <svg data-testid="check-icon">check</svg>,
  FaTimes: () => <svg data-testid="times-icon">times</svg>,
  FaQuestion: () => <svg data-testid="question-icon">question</svg>
}));

describe('DeductionItem', () => {
  const mockOnChange = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render correctly with "unknown" status', () => {
    render(
      <DeductionItem
        name="Señora Celeste"
        status="unknown"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Señora Celeste')).toBeInTheDocument();
    expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('times-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('question-icon')).not.toBeInTheDocument();
  });

  test('should render correctly with "no" status', () => {
    render(
      <DeductionItem
        name="Coronel Rubio"
        status="no"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Coronel Rubio')).toBeInTheDocument();
    expect(screen.getByTestId('times-icon')).toBeInTheDocument();
  });

  test('should render correctly with "yes" status', () => {
    render(
      <DeductionItem
        name="Candelabro"
        status="yes"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Candelabro')).toBeInTheDocument();
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });

  test('should render correctly with "maybe" status', () => {
    render(
      <DeductionItem
        name="Biblioteca"
        status="maybe"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Biblioteca')).toBeInTheDocument();
    expect(screen.getByTestId('question-icon')).toBeInTheDocument();
  });

  test('should call onChange when item is clicked', () => {
    render(
      <DeductionItem
        name="Señora Celeste"
        status="unknown"
        onChange={mockOnChange}
      />
    );

    fireEvent.click(screen.getByText('Señora Celeste').closest('li'));
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });
});