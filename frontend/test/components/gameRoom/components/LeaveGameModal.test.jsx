import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LeaveGameModal from '../../../../src/components/gameRoom/components/LeaveGameModal';

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node) => node,
}));

describe('LeaveGameModal component', () => {
  const mockClose = jest.fn();
  const mockConfirm = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockClose,
    onConfirm: mockConfirm
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not render when isOpen is false', () => {
    render(<LeaveGameModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText('¿Abandonar partida?')).not.toBeInTheDocument();
  });

  test('renders modal with title and warning message when isOpen is true', () => {
    render(<LeaveGameModal {...defaultProps} />);

    expect(screen.getByText('¿Abandonar partida?')).toBeInTheDocument();
    expect(screen.getByText(/¿Estás seguro de que deseas abandonar la partida/)).toBeInTheDocument();
  });

  test('renders cancel and confirm buttons', () => {
    render(<LeaveGameModal {...defaultProps} />);

    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Abandonar partida')).toBeInTheDocument();
  });

  test('calls onClose when cancel button is clicked', () => {
    render(<LeaveGameModal {...defaultProps} />);

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(mockClose).toHaveBeenCalledTimes(1);
    expect(mockConfirm).not.toHaveBeenCalled();
  });

  test('calls onConfirm when confirm button is clicked', () => {
    render(<LeaveGameModal {...defaultProps} />);

    const confirmButton = screen.getByText('Abandonar partida');
    fireEvent.click(confirmButton);

    expect(mockConfirm).toHaveBeenCalledTimes(1);
    expect(mockClose).not.toHaveBeenCalled();
  });
});