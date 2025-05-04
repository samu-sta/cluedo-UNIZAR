import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import IncorrectAccusationModal from '../../../../src/components/gameRoom/components/IncorrectAccusationModal';

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node) => node,
}));

describe('IncorrectAccusationModal component', () => {
  const mockLeaveGame = jest.fn();

  const defaultProps = {
    isOpen: true,
    onLeaveGame: mockLeaveGame,
    message: 'Tu acusación es incorrecta. Has sido eliminado de la partida.'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not render when isOpen is false', () => {
    render(<IncorrectAccusationModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText('Acusación Incorrecta')).not.toBeInTheDocument();
  });

  test('renders modal with title and default message when isOpen is true', () => {
    render(<IncorrectAccusationModal {...defaultProps} />);

    expect(screen.getByText('Acusación Incorrecta')).toBeInTheDocument();
    expect(screen.getByText('Tu acusación es incorrecta. Has sido eliminado de la partida.')).toBeInTheDocument();
  });

  test('renders modal with custom message when provided', () => {
    const customMessage = 'Mensaje personalizado de acusación incorrecta';

    render(
      <IncorrectAccusationModal
        {...defaultProps}
        message={customMessage}
      />
    );

    expect(screen.getByText('Acusación Incorrecta')).toBeInTheDocument();
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  test('renders the leave game button', () => {
    render(<IncorrectAccusationModal {...defaultProps} />);

    expect(screen.getByText('Abandonar Partida')).toBeInTheDocument();
  });

  test('calls onLeaveGame when button is clicked', () => {
    render(<IncorrectAccusationModal {...defaultProps} />);

    const leaveButton = screen.getByText('Abandonar Partida');
    fireEvent.click(leaveButton);

    expect(mockLeaveGame).toHaveBeenCalledTimes(1);
  });
});