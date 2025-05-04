/*************************************************
 * Pruebas para el componente WaitingRoom
 * 
 * Verifica la visualización de la sala de espera
 * que se muestra antes de iniciar la partida, incluido
 * el contador regresivo y la lista de jugadores.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import React from 'react';
import { render, screen } from '@testing-library/react';
import WaitingRoom from '../../../../../../src/components/gameRoom/components/board/components/WaitingRoom';

describe('WaitingRoom Component', () => {
  test('renders title correctly', () => {
    render(<WaitingRoom gameState="waiting" countdown={null} />);
    expect(screen.getByText('Sala de espera')).toBeInTheDocument();
  });

  test('renders waiting message when gameState is waiting', () => {
    render(<WaitingRoom gameState="waiting" countdown={null} />);
    expect(screen.getByText('Se necesitan al menos 2 jugadores para comenzar.')).toBeInTheDocument();
  });

  test('renders countdown message when gameState is countdown', () => {
    render(<WaitingRoom gameState="countdown" countdown={5} />);
    expect(screen.getByText('La partida comienza en:')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Prepárate, el juego está por comenzar...')).toBeInTheDocument();
  });

  test('does not render countdown when gameState is countdown but countdown is null', () => {
    render(<WaitingRoom gameState="countdown" countdown={null} />);
    expect(screen.queryByText('La partida comienza en:')).not.toBeInTheDocument();
  });
});