/**
 * @fileoverview Tests for SuggestionResponseModal component which displays the responses from other players to the current player's suggestion.
 * @author Samuel Felipe
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SuggestionResponseModal from '../../../../src/components/gameRoom/components/SuggestionResponseModal';

jest.mock('../../../../src/components/gameRoom/hooks/useSuggestionResponseModal', () => ({
  useSuggestionResponseModal: ({ hasSuggested, suggestionResponses, setSuggestionResponses }) => ({
    showResponseModal: hasSuggested,
    closeResponseModal: jest.fn()
  })
}));

jest.mock('../../../../src/components/common/CharacterBadge', () => {
  return function MockedCharacterBadge({ character }) {
    return <div data-testid="character-badge">{character}</div>;
  };
});

jest.mock('../../../../src/components/gameRoom/components/playerCards/components/GameCard', () => {
  return function MockedGameCard({ card }) {
    return <div data-testid="game-card">{card.name}</div>;
  };
});

const mockLocalStorage = {
  getItem: jest.fn().mockImplementation((key) => {
    if (key === 'user') {
      return JSON.stringify({ username: 'testUser' });
    }
    return null;
  })
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('SuggestionResponseModal component', () => {
  const mockSetSuggestionResponses = jest.fn();

  const players = [
    { username: 'testUser', character: 'Colonel Mustard' },
    { username: 'player1', character: 'Mrs. White' },
    { username: 'player2', character: 'Professor Plum' }
  ];

  const suggestionResponses = [
    { username: 'player1', card: { name: 'Kitchen', type: 'room', id: '1' } },
    { username: 'player2', card: null }
  ];

  const defaultProps = {
    players,
    hasSuggested: true,
    suggestionResponses,
    setSuggestionResponses: mockSetSuggestionResponses
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not render when hasSuggested is false', () => {
    render(
      <SuggestionResponseModal
        {...defaultProps}
        hasSuggested={false}
      />
    );

    expect(screen.queryByText('Respuestas a tu sugerencia')).not.toBeInTheDocument();
  });

  test('renders when hasSuggested is true', () => {
    render(<SuggestionResponseModal {...defaultProps} />);

    expect(screen.getByText('Respuestas a tu sugerencia')).toBeInTheDocument();
  });

  test('displays only other players (not the current user)', () => {
    render(<SuggestionResponseModal {...defaultProps} />);

    const characterBadges = screen.getAllByTestId('character-badge');
    expect(characterBadges).toHaveLength(2);
    expect(characterBadges[0].textContent).toBe('Mrs. White');
    expect(characterBadges[1].textContent).toBe('Professor Plum');
  });

  test('shows card from player who responded with a card', () => {
    render(<SuggestionResponseModal {...defaultProps} />);

    const gameCard = screen.getByTestId('game-card');
    expect(gameCard).toBeInTheDocument();
    expect(gameCard.textContent).toBe('Kitchen');
  });

  test('shows "No mostró ninguna carta" for player who responded with null card', () => {
    render(<SuggestionResponseModal {...defaultProps} />);

    expect(screen.getByText('No mostró ninguna carta')).toBeInTheDocument();
  });

  test('shows "Esperando respuesta" for player who has not responded yet', () => {
    const playersWithExtra = [
      ...players,
      { username: 'player3', character: 'Miss Scarlett' }
    ];

    render(
      <SuggestionResponseModal
        {...defaultProps}
        players={playersWithExtra}
      />
    );

    expect(screen.getByText('Esperando respuesta')).toBeInTheDocument();
  });
});