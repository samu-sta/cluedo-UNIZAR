/**
 * @fileoverview Tests for GameHeader component which displays game status information at the top of the game room.
 * @author Samuel Felipe
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GameHeader from '../../../../src/components/gameRoom/components/GameHeader';

jest.mock('../../../../src/components/gameRoom/hooks/useCopyGameId', () => ({
  __esModule: true,
  default: () => ({
    copied: false,
    handleCopyGameId: jest.fn()
  })
}));

jest.mock('../../../../src/components/gameRoom/hooks/useLeaveGameModal', () => ({
  __esModule: true,
  default: ({ onLeaveGame }) => ({
    showModal: false,
    handleOpenModal: jest.fn(),
    handleCloseModal: jest.fn(),
    handleConfirmLeave: jest.fn(() => onLeaveGame())
  })
}));

jest.mock('../../../../src/components/common/hooks/useIsMobile', () => ({
  __esModule: true,
  default: () => false
}));

jest.mock('react-icons/fa', () => ({
  FaCheck: () => <div data-testid="check-icon">Check Icon</div>
}));

jest.mock('react-icons/lu', () => ({
  LuCopy: () => <div data-testid="copy-icon">Copy Icon</div>
}));

const mockLocalStorage = {
  getItem: jest.fn().mockImplementation(() => JSON.stringify({ username: 'testUser' }))
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

jest.mock('../../../../src/components/gameRoom/components/LeaveGameModal', () => {
  return function MockedLeaveGameModal() {
    return <div data-testid="leave-game-modal">Leave Game Modal</div>;
  };
});

describe('GameHeader component', () => {
  const mockLeaveGame = jest.fn();

  const defaultProps = {
    gameId: 'game-123',
    gameState: 'waiting',
    onLeaveGame: mockLeaveGame,
    players: [
      {
        username: 'testUser',
        character: {
          name: 'Colonel Mustard',
          colorHex: '#E4A81D',
          textColorHex: '#000000'
        }
      },
      { username: 'player2', character: { name: 'Mrs. White', colorHex: '#FFFFFF', textColorHex: '#000000' } }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the player character badge', () => {
    render(<GameHeader {...defaultProps} />);

    const characterBadge = screen.getByText('Colonel Mustard');
    expect(characterBadge).toBeInTheDocument();
    expect(characterBadge.closest('article')).toHaveStyle({
      backgroundColor: '#E4A81D',
      color: '#000000'
    });
  });

  test('renders the copy button in waiting state', () => {
    render(<GameHeader {...defaultProps} />);

    expect(screen.getByText('Copiar código de partida')).toBeInTheDocument();
    expect(screen.getByTestId('copy-icon')).toBeInTheDocument();
  });

  test('does not render the copy button in playing state', () => {
    render(<GameHeader {...defaultProps} gameState="playing" />);

    expect(screen.queryByText('Copiar código de partida')).not.toBeInTheDocument();
  });

  test('renders leave game button', () => {
    render(<GameHeader {...defaultProps} />);

    expect(screen.getByText('Abandonar partida')).toBeInTheDocument();
  });

  test('renders the correct game status badge', () => {
    const { rerender } = render(<GameHeader {...defaultProps} />);
    expect(screen.getByText('En espera')).toBeInTheDocument();

    rerender(<GameHeader {...defaultProps} gameState="playing" />);
    expect(screen.getByText('En juego')).toBeInTheDocument();
  });

  test('renders the leave game modal', () => {
    render(<GameHeader {...defaultProps} />);

    expect(screen.getByTestId('leave-game-modal')).toBeInTheDocument();
  });
});