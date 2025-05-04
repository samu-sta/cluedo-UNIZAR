/**
 * @fileoverview Tests for DeductionCategory component which groups deduction items by category (characters, weapons, rooms).
 * @author Samuel Felipe
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import DeductionCategory from '../../../../../../src/components/gameRoom/components/deductionTable/components/DeductionCategory';

jest.mock('../../../../../../src/components/gameRoom/components/deductionTable/components/DeductionItem', () => {
  return function MockDeductionItem({ name, status, onChange }) {
    return (
      <li data-testid={`deduction-item-${name}`} onClick={onChange}>
        {name} - {status}
      </li>
    );
  };
});

describe('DeductionCategory', () => {
  const mockUpdateDeduction = jest.fn();
  const mockItems = {
    'Señora Celeste': 'unknown',
    'Coronel Rubio': 'no',
    'Señora Blanco': 'yes',
    'Profesor Verde': 'maybe'
  };

  test('should render correctly with title and items', () => {
    render(
      <DeductionCategory
        title="Personajes"
        items={mockItems}
        updateDeduction={mockUpdateDeduction}
        deductionCategory="characters"
      />
    );

    expect(screen.getByText('Personajes')).toBeInTheDocument();

    expect(screen.getByTestId('deduction-item-Señora Celeste')).toBeInTheDocument();
    expect(screen.getByTestId('deduction-item-Coronel Rubio')).toBeInTheDocument();
    expect(screen.getByTestId('deduction-item-Señora Blanco')).toBeInTheDocument();
    expect(screen.getByTestId('deduction-item-Profesor Verde')).toBeInTheDocument();
  });

  test('should render correctly without items', () => {
    render(
      <DeductionCategory
        title="Armas"
        items={{}}
        updateDeduction={mockUpdateDeduction}
        deductionCategory="weapons"
      />
    );

    expect(screen.getByText('Armas')).toBeInTheDocument();
    expect(screen.queryByTestId(/deduction-item/)).not.toBeInTheDocument();
  });
});