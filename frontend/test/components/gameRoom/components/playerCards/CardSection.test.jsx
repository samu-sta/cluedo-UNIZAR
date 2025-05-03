/**
 * @fileoverview Tests for CardSection component which organizes and displays cards by categories.
 * @author Samuel Felipe
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import CardSection from '../../../../../src/components/gameRoom/components/playerCards/components/CardSection';

// Mock CardColumn component
jest.mock('../../../../../src/components/gameRoom/components/playerCards/components/CardColumn', () => {
  return function MockedCardColumn({ title, cards, cardType, isLeftover }) {
    return (
      <div data-testid={`mocked-card-column-${cardType}`} data-isleftover={isLeftover.toString()}>
        <h4>{title}</h4>
        <span>{`Cards count: ${cards.length}`}</span>
      </div>
    );
  };
});

describe('CardSection Component', () => {
  const mockCardsData = {
    characters: [{ name: 'Character 1' }, { name: 'Character 2' }],
    weapons: [{ name: 'Weapon 1' }],
    rooms: [{ name: 'Room 1' }, { name: 'Room 2' }, { name: 'Room 3' }]
  };

  test('should render title when provided', () => {
    render(<CardSection title="Test Section" cardsData={mockCardsData} />);
    expect(screen.getByText('Test Section')).toBeInTheDocument();
  });

  test('should render character column when characters exist', () => {
    render(<CardSection cardsData={mockCardsData} />);
    expect(screen.getByTestId('mocked-card-column-character')).toBeInTheDocument();
    expect(screen.getByText('Personajes')).toBeInTheDocument();
  });

  test('should render weapon column when weapons exist', () => {
    render(<CardSection cardsData={mockCardsData} />);
    expect(screen.getByTestId('mocked-card-column-weapon')).toBeInTheDocument();
    expect(screen.getByText('Armas')).toBeInTheDocument();
  });

  test('should render room column when rooms exist', () => {
    render(<CardSection cardsData={mockCardsData} />);
    expect(screen.getByTestId('mocked-card-column-room')).toBeInTheDocument();
    expect(screen.getByText('Habitaciones')).toBeInTheDocument();
  });

  test('should not render when all card arrays are empty', () => {
    const emptyCardsData = {
      characters: [],
      weapons: [],
      rooms: []
    };
    const { container } = render(<CardSection cardsData={emptyCardsData} />);
    expect(container.firstChild).toBeNull();
  });

  test('should apply leftover class when isLeftover is true', () => {
    const { container } = render(<CardSection cardsData={mockCardsData} isLeftover={true} />);
    expect(container.firstChild).toHaveClass('leftover');
  });

  test('should pass isLeftover prop to CardColumn components', () => {
    render(<CardSection cardsData={mockCardsData} isLeftover={true} />);
    const characterColumn = screen.getByTestId('mocked-card-column-character');
    expect(characterColumn).toHaveAttribute('data-isleftover', 'true');
  });
});