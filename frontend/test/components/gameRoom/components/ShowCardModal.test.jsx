/**
 * @fileoverview Tests for ShowCardModal component which displays cards during the suggestion/accusation phase.
 * @author Samuel Felipe
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ShowCardModal from '../../../../src/components/gameRoom/components/ShowCardModal';

jest.mock('../../../../src/components/gameRoom/components/playerCards/components/GameCard', () => {
  return function MockedGameCard({ card, onClick, className }) {
    return (
      <div
        data-testid={`game-card-${card.name}`}
        className={className || ''}
        onClick={onClick}
      >
        {card.name} ({card.type})
      </div>
    );
  };
});

describe('ShowCardModal component', () => {
  const mockSubmit = jest.fn();

  const playerCards = [
    { id: '1', type: 'character', name: 'Mrs. White' },
    { id: '2', type: 'weapon', name: 'Rope' },
    { id: '3', type: 'room', name: 'Kitchen' }
  ];

  const suggestion = {
    username: 'player1',
    character: 'Mrs. White',
    weapon: 'Candlestick',
    room: 'Kitchen'
  };

  const defaultProps = {
    isOpen: true,
    onSubmit: mockSubmit,
    playerCards,
    currentSuggestion: suggestion
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not render when isOpen is false', () => {
    render(<ShowCardModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText('Responde a la sugerencia')).not.toBeInTheDocument();
  });

  test('renders correctly when isOpen is true', () => {
    render(<ShowCardModal {...defaultProps} />);

    expect(screen.getByText('Responde a la sugerencia')).toBeInTheDocument();

    const playerNameElement = screen.getByText('player1');
    expect(playerNameElement).toBeInTheDocument();
    expect(playerNameElement.parentNode).toHaveTextContent('player1 ha sugerido:');
  });

  test('displays matching cards from player hand', () => {
    render(<ShowCardModal {...defaultProps} />);

    expect(screen.getByTestId('game-card-Mrs. White')).toBeInTheDocument();
    expect(screen.getByTestId('game-card-Kitchen')).toBeInTheDocument();

    expect(screen.queryByTestId('game-card-Rope')).not.toBeInTheDocument();
  });

  test('allows selecting a card and submits it', () => {
    render(<ShowCardModal {...defaultProps} />);

    const kitchenCard = screen.getByTestId('game-card-Kitchen');
    fireEvent.click(kitchenCard);

    const submitButton = screen.getByText('Mostrar carta');
    fireEvent.click(submitButton);

    expect(mockSubmit).toHaveBeenCalledWith(playerCards[2]);
  });

  test('displays message when no matching cards', () => {
    const noMatchSuggestion = {
      ...suggestion,
      character: 'Professor Plum',
      weapon: 'Revolver',
      room: 'Hall'
    };

    render(
      <ShowCardModal
        {...defaultProps}
        currentSuggestion={noMatchSuggestion}
      />
    );

    expect(screen.getByText('No tienes ninguna carta que coincida con la sugerencia.')).toBeInTheDocument();

    const noCardButton = screen.getByText('No tengo ninguna carta');
    expect(noCardButton).toBeInTheDocument();

    fireEvent.click(noCardButton);

    expect(mockSubmit).toHaveBeenCalledWith(null);
  });

  test('disables submit button when no card is selected and multiple matches', () => {
    render(<ShowCardModal {...defaultProps} />);

    const submitButton = screen.getByText('Mostrar carta');
    expect(submitButton).toBeDisabled();

    const kitchenCard = screen.getByTestId('game-card-Kitchen');
    fireEvent.click(kitchenCard);

    expect(submitButton).not.toBeDisabled();
  });

  test('automatically selects card when there is only one match', () => {
    const singleMatchSuggestion = {
      ...suggestion,
      character: 'Professor Plum',
      room: 'Hall',
      weapon: 'Rope'
    };

    render(
      <ShowCardModal
        {...defaultProps}
        currentSuggestion={singleMatchSuggestion}
      />
    );

    expect(screen.getByTestId('game-card-Rope')).toBeInTheDocument();

    const submitButton = screen.getByText('Mostrar carta');
    fireEvent.click(submitButton);

    expect(mockSubmit).toHaveBeenCalledWith(playerCards[1]);
  });
});