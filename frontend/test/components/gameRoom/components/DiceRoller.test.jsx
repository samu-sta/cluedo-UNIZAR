/*************************************************
 * Pruebas para el componente DiceRoller
 * 
 * Verifica el funcionamiento del componente que muestra
 * y gestiona los dados del juego, incluyendo la animación
 * de tirada y la visualización del resultado.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import DiceRoller from '../../../../src/components/gameRoom/components/DiceRoller';

jest.mock('../../../../src/components/gameRoom/components/Die', () => {
  return function MockedDie({ value }) {
    return <div data-testid={`die-${value}`}>Die with value {value}</div>;
  };
});

jest.useFakeTimers();

describe('DiceRoller component', () => {
  const mockRollDice = jest.fn();
  const mockSetCanRoll = jest.fn();

  const defaultProps = {
    diceResult: null,
    rollDice: mockRollDice,
    isMyTurn: true,
    canRoll: true,
    setCanRoll: mockSetCanRoll
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders roll button when it\'s the player\'s turn', () => {
    render(<DiceRoller {...defaultProps} />);

    const rollButton = screen.getByText('Tirar dados');
    expect(rollButton).toBeInTheDocument();
    expect(rollButton).not.toBeDisabled();
  });

  test('does not render roll button when it\'s not the player\'s turn', () => {
    render(<DiceRoller {...defaultProps} isMyTurn={false} />);

    expect(screen.queryByText('Tirar dados')).not.toBeInTheDocument();
  });

  test('disables roll button when canRoll is false', () => {
    render(<DiceRoller {...defaultProps} canRoll={false} />);

    const rollButton = screen.getByText('Tirar dados');
    expect(rollButton).toBeDisabled();
  });

  test('calls rollDice when button is clicked', () => {
    render(<DiceRoller {...defaultProps} />);

    const rollButton = screen.getByText('Tirar dados');
    fireEvent.click(rollButton);

    expect(mockRollDice).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Tirando...')).toBeInTheDocument();
  });

  test('shows dice with correct values when diceResult is provided', () => {
    render(<DiceRoller {...defaultProps} diceResult={[3, 5]} />);

    expect(screen.getByTestId('die-3')).toBeInTheDocument();
    expect(screen.getByTestId('die-5')).toBeInTheDocument();
  });

  test('does not show dice when diceResult is null', () => {
    render(<DiceRoller {...defaultProps} />);

    expect(screen.queryByTestId(/die-/)).not.toBeInTheDocument();
  });

  test('sets canRoll to false after dice are rolled', () => {
    const { rerender } = render(<DiceRoller {...defaultProps} />);

    const rollButton = screen.getByText('Tirar dados');
    fireEvent.click(rollButton);

    rerender(<DiceRoller {...defaultProps} diceResult={[2, 4]} />);

    act(() => {
      jest.advanceTimersByTime(800);
    });

    expect(mockSetCanRoll).toHaveBeenCalledWith(false);
  });
});