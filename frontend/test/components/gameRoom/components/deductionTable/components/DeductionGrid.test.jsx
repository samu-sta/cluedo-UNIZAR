import React from 'react';
import { render, screen } from '@testing-library/react';
import DeductionGrid from '../../../../../../src/components/gameRoom/components/deductionTable/components/DeductionGrid';

jest.mock('../../../../../../src/components/gameRoom/components/deductionTable/components/DeductionCategory', () => {
  return function MockDeductionCategory({ title, items, deductionCategory }) {
    return (
      <div data-testid={`deduction-category-${deductionCategory}`}>
        <h4>{title}</h4>
        <span data-testid={`items-count-${deductionCategory}`}>
          {Object.keys(items).length}
        </span>
      </div>
    );
  };
});

describe('DeductionGrid', () => {
  const mockUpdateDeduction = jest.fn();
  const mockDeductions = {
    characters: {
      'Señora Celeste': 'unknown',
      'Coronel Rubio': 'no'
    },
    weapons: {
      'Pistola': 'yes',
      'Candelabro': 'maybe'
    },
    rooms: {
      'Biblioteca': 'unknown',
      'Cocina': 'no',
      'Salón': 'yes'
    }
  };

  test('should render grid with the three deduction categories', () => {
    render(
      <DeductionGrid
        deductions={mockDeductions}
        updateDeduction={mockUpdateDeduction}
        isMobile={false}
      />
    );

    expect(screen.getByTestId('deduction-category-characters')).toBeInTheDocument();
    expect(screen.getByTestId('deduction-category-weapons')).toBeInTheDocument();
    expect(screen.getByTestId('deduction-category-rooms')).toBeInTheDocument();

    expect(screen.getByText('Personajes')).toBeInTheDocument();
    expect(screen.getByText('Armas')).toBeInTheDocument();
    expect(screen.getByText('Habitaciones')).toBeInTheDocument();
  });

  test('should correctly pass items to each category', () => {
    render(
      <DeductionGrid
        deductions={mockDeductions}
        updateDeduction={mockUpdateDeduction}
        isMobile={false}
      />
    );

    expect(screen.getByTestId('items-count-characters').textContent).toBe('2');
    expect(screen.getByTestId('items-count-weapons').textContent).toBe('2');
    expect(screen.getByTestId('items-count-rooms').textContent).toBe('3');
  });

  test('should apply mobile class when isMobile is true', () => {
    const { container } = render(
      <DeductionGrid
        deductions={mockDeductions}
        updateDeduction={mockUpdateDeduction}
        isMobile={true}
      />
    );

    expect(container.querySelector('.deduction-grid.mobile')).toBeInTheDocument();
  });

  test('should not apply mobile class when isMobile is false', () => {
    const { container } = render(
      <DeductionGrid
        deductions={mockDeductions}
        updateDeduction={mockUpdateDeduction}
        isMobile={false}
      />
    );

    expect(container.querySelector('.deduction-grid')).toBeInTheDocument();
    expect(container.querySelector('.deduction-grid.mobile')).not.toBeInTheDocument();
  });
});