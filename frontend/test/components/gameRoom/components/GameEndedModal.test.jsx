/*************************************************
 * Pruebas para el componente GameEndedModal
 * 
 * Verifica el comportamiento del modal de fin de partida,
 * mostrando el resultado final, el ganador, la solución
 * y proporcionando opciones para volver al menú.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import GameEndedModal from '../../../../src/components/gameRoom/components/GameEndedModal';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));

jest.mock('../../../../src/components/gameRoom/hooks/useGameEndedModal', () => ({
  __esModule: true,
  default: (gameState) => ({
    showEndedModal: gameState === 'ended',
    toogleEndedModal: jest.fn()
  })
}));

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node) => node,
}));

describe('GameEndedModal component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('does not render when game state is not ended', () => {
    render(
      <GameEndedModal
        winner="Player 1"
        reason="Game ended due to winner"
        solution={{ character: { name: 'Colonel Mustard' }, weapon: { name: 'Rope' }, room: { name: 'Kitchen' } }}
        gameState="playing"
      />
    );

    expect(screen.queryByText('Partida finalizada')).not.toBeInTheDocument();
  });

  test('renders modal with winner when game state is ended and winner provided', () => {
    render(
      <GameEndedModal
        winner="Player 1"
        reason="Game ended due to winner"
        solution={{ character: { name: 'Colonel Mustard' }, weapon: { name: 'Rope' }, room: { name: 'Kitchen' } }}
        gameState="ended"
      />
    );

    expect(screen.getByText('Partida finalizada')).toBeInTheDocument();
    expect(screen.getByText('Ganador:')).toBeInTheDocument();
    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.queryByText('Game ended due to winner')).not.toBeInTheDocument();
  });

  test('renders modal with reason when game state is ended and no winner provided', () => {
    render(
      <GameEndedModal
        winner=""
        reason="Game ended due to timeout"
        solution={{ character: { name: 'Colonel Mustard' }, weapon: { name: 'Rope' }, room: { name: 'Kitchen' } }}
        gameState="ended"
      />
    );

    expect(screen.getByText('Partida finalizada')).toBeInTheDocument();
    expect(screen.queryByText('Ganador:')).not.toBeInTheDocument();
    expect(screen.getByText('Game ended due to timeout')).toBeInTheDocument();
  });

  test('displays the solution when provided', () => {
    render(
      <GameEndedModal
        winner="Player 1"
        solution={{ character: { name: 'Colonel Mustard' }, weapon: { name: 'Rope' }, room: { name: 'Kitchen' } }}
        gameState="ended"
      />
    );

    expect(screen.getByText('La solución era:')).toBeInTheDocument();
    expect(screen.getByText('Colonel Mustard')).toBeInTheDocument();
    expect(screen.getByText('Rope')).toBeInTheDocument();
    expect(screen.getByText('Kitchen')).toBeInTheDocument();
  });

  test('navigates to lobby when "Volver al lobby" button is clicked', () => {
    render(
      <GameEndedModal
        winner="Player 1"
        solution={{ character: { name: 'Colonel Mustard' }, weapon: { name: 'Rope' }, room: { name: 'Kitchen' } }}
        gameState="ended"
      />
    );

    const lobbyButton = screen.getByText('Volver al lobby');
    fireEvent.click(lobbyButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('navigates to games page when "Crear nueva partida" button is clicked', () => {
    render(
      <GameEndedModal
        winner="Player 1"
        solution={{ character: { name: 'Colonel Mustard' }, weapon: { name: 'Rope' }, room: { name: 'Kitchen' } }}
        gameState="ended"
      />
    );

    const newGameButton = screen.getByText('Crear nueva partida');
    fireEvent.click(newGameButton);

    expect(mockNavigate).toHaveBeenCalledWith('/games');
  });
});