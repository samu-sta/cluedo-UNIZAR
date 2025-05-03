/**
 * @fileoverview Tests for CardColumn component which renders a column of game cards of the same type.
 * @author Samuel Felipe
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import CardColumn from '../../../../../src/components/gameRoom/components/playerCards/components/CardColumn';

jest.mock('../../../../../src/components/gameRoom/components/playerCards/components/GameCard', () => {
  return function MockedGameCard({ card, type, isLeftover }) {
    return (
      <div data-testid={`mocked-game-card-${type}`}>
        {card.name}
        {isLeftover && <span>Leftover</span>}
      </div>
    );
  };
});

describe('CardColumn Component', () => {
  const mockCards = [
    { name: 'Card 1' },
    { name: 'Card 2' }
  ];

  test('should render title correctly', () => {
    render(<CardColumn title="Test Title" cards={mockCards} cardType="character" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  test('should render all cards', () => {
    render(<CardColumn title="Test Title" cards={mockCards} cardType="weapon" />);
    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('Card 2')).toBeInTheDocument();
  });

  test('should pass correct cardType to GameCard components', () => {
    render(<CardColumn title="Test Title" cards={mockCards} cardType="room" />);
    expect(screen.getAllByTestId('mocked-game-card-room').length).toBe(2);
  });

  test('should apply leftover class when isLeftover is true', () => {
    const { container } = render(
      <CardColumn title="Test Title" cards={mockCards} cardType="character" isLeftover={true} />
    );
    expect(container.firstChild).toHaveClass('leftover');
  });

  test('should pass isLeftover prop to GameCard components', () => {
    render(<CardColumn title="Test Title" cards={mockCards} cardType="character" isLeftover={true} />);
    const cards = screen.getAllByText(/Card/);
    cards.forEach(card => {
      expect(card.parentElement).toHaveTextContent('Leftover');
    });
  });
});