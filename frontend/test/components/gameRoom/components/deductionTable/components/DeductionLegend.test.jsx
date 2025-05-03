/**
 * @fileoverview Tests for DeductionLegend component which displays the icons and meanings of different deduction states.
 * @author Samuel Felipe
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import DeductionLegend from '../../../../../../src/components/gameRoom/components/deductionTable/components/DeductionLegend';

jest.mock('react-icons/fa', () => ({
  FaCheck: () => <svg data-testid="check-icon">check</svg>,
  FaTimes: () => <svg data-testid="times-icon">times</svg>,
  FaQuestion: () => <svg data-testid="question-icon">question</svg>
}));

describe('DeductionLegend', () => {
  test('should render all legends with their icons', () => {
    render(<DeductionLegend />);

    expect(screen.getByText('Descartado')).toBeInTheDocument();
    expect(screen.getByText('Confirmado')).toBeInTheDocument();
    expect(screen.getByText('Posible')).toBeInTheDocument();

    expect(screen.getByTestId('times-icon')).toBeInTheDocument();
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    expect(screen.getByTestId('question-icon')).toBeInTheDocument();
  });

  test('should render with the correct CSS class', () => {
    const { container } = render(<DeductionLegend />);

    expect(container.querySelector('.deduction-legend')).toBeInTheDocument();
    expect(container.querySelectorAll('.legend-item').length).toBe(3);
  });
});