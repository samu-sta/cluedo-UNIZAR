/**
 * @fileoverview Tests for AccusationModal component which allows players to make final accusations about the crime elements.
 * @author Samuel Felipe
 */
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import AccusationModal from '../../../../src/components/gameRoom/components/AccusationModal';

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node) => node,
}));

describe('AccusationModal component', () => {
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
        { name: 'Dagger', type: 'weapon' },
        { name: 'Kitchen', type: 'room' },
        { name: 'Ballroom', type: 'room' }
      ]
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the modal when isOpen is true', () => {
    render(<AccusationModal {...defaultProps} />);

    expect(screen.getByRole('heading', { name: 'Hacer Acusación Final' })).toBeInTheDocument();
    expect(screen.getByText(/Atención: Si tu acusación es incorrecta/)).toBeInTheDocument();
  });

  test('does not render when isOpen is false', () => {
    render(<AccusationModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText('Hacer Acusación Final')).not.toBeInTheDocument();
  });

  test('renders character, weapon and room dropdown menus with options', () => {
    render(<AccusationModal {...defaultProps} />);

    const characterSection = screen.getByText('Personaje').closest('section');
    const weaponSection = screen.getByText('Arma').closest('section');
    const roomSection = screen.getByText('Habitación').closest('section');

    const characterSelect = within(characterSection).getByRole('combobox');
    const weaponSelect = within(weaponSection).getByRole('combobox');
    const roomSelect = within(roomSection).getByRole('combobox');

    expect(characterSelect).toBeInTheDocument();
    expect(weaponSelect).toBeInTheDocument();
    expect(roomSelect).toBeInTheDocument();

    expect(screen.getByText('Selecciona un personaje')).toBeInTheDocument();
    expect(screen.getByText('Colonel Mustard')).toBeInTheDocument();
    expect(screen.getByText('Professor Plum')).toBeInTheDocument();

    expect(screen.getByText('Selecciona un arma')).toBeInTheDocument();
    expect(screen.getByText('Revolver')).toBeInTheDocument();
    expect(screen.getByText('Dagger')).toBeInTheDocument();

    expect(screen.getByText('Selecciona una habitación')).toBeInTheDocument();
    expect(screen.getByText('Kitchen')).toBeInTheDocument();
    expect(screen.getByText('Ballroom')).toBeInTheDocument();
  });

  test('accusation button is disabled until all selections are made', () => {
    render(<AccusationModal {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: 'Hacer Acusación' });
    expect(submitButton).toBeDisabled();

    const characterSection = screen.getByText('Personaje').closest('section');
    const weaponSection = screen.getByText('Arma').closest('section');
    const roomSection = screen.getByText('Habitación').closest('section');

    const characterSelect = within(characterSection).getByRole('combobox');
    const weaponSelect = within(weaponSection).getByRole('combobox');
    const roomSelect = within(roomSection).getByRole('combobox');

    fireEvent.change(characterSelect, { target: { value: 'Colonel Mustard' } });
    expect(submitButton).toBeDisabled();

    fireEvent.change(weaponSelect, { target: { value: 'Revolver' } });
    expect(submitButton).toBeDisabled();

    fireEvent.change(roomSelect, { target: { value: 'Kitchen' } });
    expect(submitButton).not.toBeDisabled();
  });

  test('calls onClose when cancel button is clicked', () => {
    render(<AccusationModal {...defaultProps} />);

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  test('calls onSubmit with selected values when submit button is clicked', () => {
    render(<AccusationModal {...defaultProps} />);

    const characterSection = screen.getByText('Personaje').closest('section');
    const weaponSection = screen.getByText('Arma').closest('section');
    const roomSection = screen.getByText('Habitación').closest('section');

    const characterSelect = within(characterSection).getByRole('combobox');
    const weaponSelect = within(weaponSection).getByRole('combobox');
    const roomSelect = within(roomSection).getByRole('combobox');

    fireEvent.change(characterSelect, { target: { value: 'Colonel Mustard' } });
    fireEvent.change(weaponSelect, { target: { value: 'Dagger' } });
    fireEvent.change(roomSelect, { target: { value: 'Ballroom' } });

    const submitButton = screen.getByRole('button', { name: 'Hacer Acusación' });
    fireEvent.click(submitButton);

    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith({
      character: 'Colonel Mustard',
      weapon: 'Dagger',
      room: 'Ballroom'
    });
  });
});