import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DeductionHeader from '../../../../../../src/components/gameRoom/components/deductionTable/components/DeductionHeader';

jest.mock('react-icons/io', () => ({
  IoIosArrowDown: () => <svg data-testid="arrow-icon">arrow</svg>
}));

describe('DeductionHeader', () => {
  const mockToggleCollapse = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render correctly with the title', () => {
    render(
      <DeductionHeader
        isCollapsed={true}
        toggleCollapse={mockToggleCollapse}
      />
    );

    expect(screen.getByText('Tabla de Descarte')).toBeInTheDocument();
    expect(screen.getByTestId('arrow-icon')).toBeInTheDocument();
  });

  test('should apply the "collapsed" class when isCollapsed is true', () => {
    render(
      <DeductionHeader
        isCollapsed={true}
        toggleCollapse={mockToggleCollapse}
      />
    );

    expect(screen.getByRole('button').classList.contains('collapsed')).toBe(true);
    expect(screen.getByRole('button').classList.contains('expanded')).toBe(false);
  });

  test('should apply the "expanded" class when isCollapsed is false', () => {
    render(
      <DeductionHeader
        isCollapsed={false}
        toggleCollapse={mockToggleCollapse}
      />
    );

    expect(screen.getByRole('button').classList.contains('expanded')).toBe(true);
    expect(screen.getByRole('button').classList.contains('collapsed')).toBe(false);
  });

  test('should call toggleCollapse when the header is clicked', () => {
    render(
      <DeductionHeader
        isCollapsed={true}
        toggleCollapse={mockToggleCollapse}
      />
    );

    fireEvent.click(screen.getByRole('heading', { name: 'Tabla de Descarte' }).parentNode);
    expect(mockToggleCollapse).toHaveBeenCalledTimes(1);
  });

  test('should call toggleCollapse when the button is clicked', () => {
    render(
      <DeductionHeader
        isCollapsed={true}
        toggleCollapse={mockToggleCollapse}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    expect(mockToggleCollapse).toHaveBeenCalledTimes(1);
  });
});