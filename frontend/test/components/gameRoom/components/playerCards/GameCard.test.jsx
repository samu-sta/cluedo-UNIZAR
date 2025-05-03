/**
 * @fileoverview Tests for GameCard component which displays an individual game card with its image and details.
 * @author Samuel Felipe
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GameCard from '../../../../../src/components/gameRoom/components/playerCards/components/GameCard';

describe('GameCard Component', () => {
  const mockCard = { name: 'Test Card' };
  const mockOnClick = jest.fn();

  test('should render card with correct name', () => {
    render(<GameCard card={mockCard} type="character" />);
    expect(screen.getByText('Test Card')).toBeInTheDocument();
  });

  test('should apply the correct type class', () => {
    const { container } = render(<GameCard card={mockCard} type="weapon" />);
    expect(container.firstChild).toHaveClass('game-card');
    expect(container.firstChild).toHaveClass('weapon');
  });

  test('should show leftover badge when isLeftover is true', () => {
    render(<GameCard card={mockCard} type="room" isLeftover={true} />);
    expect(screen.getByText('Sobrante')).toBeInTheDocument();
  });

  test('should not show leftover badge when isLeftover is false', () => {
    render(<GameCard card={mockCard} type="room" isLeftover={false} />);
    expect(screen.queryByText('Sobrante')).not.toBeInTheDocument();
  });

  test('should call onClick when clicked', () => {
    render(<GameCard card={mockCard} type="character" onClick={mockOnClick} />);
    fireEvent.click(screen.getByText('Test Card'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('should have pointer cursor when onClick is provided', () => {
    const { container } = render(<GameCard card={mockCard} type="character" onClick={mockOnClick} />);
    expect(container.firstChild).toHaveStyle('cursor: pointer');
  });

  test('should have default cursor when onClick is not provided', () => {
    const { container } = render(<GameCard card={mockCard} type="character" />);
    expect(container.firstChild).toHaveStyle('cursor: default');
  });
});