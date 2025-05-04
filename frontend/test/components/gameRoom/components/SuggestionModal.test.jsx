/**
 * @fileoverview Tests for SuggestionModal component which allows players to make a suggestion about the crime elements.
 * @author Samuel Felipe
 */
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import SuggestionModal from '../../../../src/components/gameRoom/components/SuggestionModal';

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node) => node,
}));

describe('SuggestionModal component', () => {
  const mockClose = jest.fn();
  const mockSubmit = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockClose,
    onSubmit: mockSubmit,
    gameInfo: {
      cards: [
        { name: 'Colonel Mustard', type: 'character' },
        { name: 'Professor Plum', type: 'character' },
        { name: 'Revolver', type: 'weapon' },
        { name: 'Dagger', type: 'weapon' }
      ]
    },
    currentRoom: 'Kitchen'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the modal when isOpen is true', () => {
    render(<SuggestionModal {...defaultProps} />);

    expect(screen.getByRole('heading', { name: 'Hacer Sugerencia' })).toBeInTheDocument();
    expect(screen.getByText(/Estás sugiriendo que el crimen ocurrió en la habitación/)).toBeInTheDocument();
    expect(screen.getByText('Kitchen')).toBeInTheDocument();
  });

  test('does not render when isOpen is false', () => {
    render(<SuggestionModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText('Hacer Sugerencia')).not.toBeInTheDocument();
  });

  test('renders character and weapon dropdown menus with options', () => {
    render(<SuggestionModal {...defaultProps} />);

    const characterSection = screen.getByText('Personaje').closest('section');
    const weaponSection = screen.getByText('Arma').closest('section');

    const characterSelect = within(characterSection).getByRole('combobox');
    const weaponSelect = within(weaponSection).getByRole('combobox');

    expect(characterSelect).toBeInTheDocument();
    expect(weaponSelect).toBeInTheDocument();

    expect(screen.getByText('Selecciona un personaje')).toBeInTheDocument();
    expect(screen.getByText('Colonel Mustard')).toBeInTheDocument();
    expect(screen.getByText('Professor Plum')).toBeInTheDocument();

    expect(screen.getByText('Selecciona un arma')).toBeInTheDocument();
    expect(screen.getByText('Revolver')).toBeInTheDocument();
    expect(screen.getByText('Dagger')).toBeInTheDocument();
  });

  test('make suggestion button is disabled until selections are made', () => {
    render(<SuggestionModal {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: 'Hacer Sugerencia' });
    expect(submitButton).toBeDisabled();
  });

  test('calls onClose when cancel button is clicked', () => {
    render(<SuggestionModal {...defaultProps} />);

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  test('enables submit button and calls onSubmit when selections are made', () => {
    render(<SuggestionModal {...defaultProps} />);

    const characterSection = screen.getByText('Personaje').closest('section');
    const weaponSection = screen.getByText('Arma').closest('section');

    const characterSelect = within(characterSection).getByRole('combobox');
    const weaponSelect = within(weaponSection).getByRole('combobox');

    fireEvent.change(characterSelect, { target: { value: 'Colonel Mustard' } });
    fireEvent.change(weaponSelect, { target: { value: 'Revolver' } });

    const submitButton = screen.getByRole('button', { name: 'Hacer Sugerencia' });
    expect(submitButton).not.toBeDisabled();

    fireEvent.click(submitButton);

    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith({
      character: 'Colonel Mustard',
      weapon: 'Revolver',
      room: 'Kitchen'
    });
  });
});