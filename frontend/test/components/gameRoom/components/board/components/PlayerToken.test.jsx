/*************************************************
 * Pruebas para el componente PlayerToken
 * 
 * Verifica el comportamiento del token que representa
 * a un jugador en el tablero, mostrando su color
 * característico y gestionando su posición.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import React from 'react';
import { render, screen } from '@testing-library/react';
import PlayerToken from '../../../../../../src/components/gameRoom/components/board/components/PlayerToken';

describe('PlayerToken Component', () => {
  const mockPlayer = {
    character: {
      name: 'Colonel Mustard',
      colorHex: '#E4A81D',
      textColorHex: '#000000'
    },
    username: 'player1'
  };

  test('renders player token with correct initials', () => {
    render(<PlayerToken player={mockPlayer} />);
    const tokenText = screen.getByText('CM');
    expect(tokenText).toBeInTheDocument();
    expect(tokenText).toHaveClass('player-token-text');
  });

  test('applies correct background color and text color', () => {
    render(<PlayerToken player={mockPlayer} />);
    const token = screen.getByTitle('player1 (Colonel Mustard)');

    expect(token).toHaveStyle({
      backgroundColor: '#E4A81D',
      color: '#000000'
    });
  });

  test('uses default colors when color props are missing', () => {
    const playerWithoutColors = {
      character: {
        name: 'Miss Scarlet'
      },
      username: 'player2'
    };

    render(<PlayerToken player={playerWithoutColors} />);
    const token = screen.getByTitle('player2 (Miss Scarlet)');

    expect(token).toHaveStyle({
      backgroundColor: '#888888',
      color: '#FFFFFF'
    });
  });

  test('creates correct title with username and character name', () => {
    render(<PlayerToken player={mockPlayer} />);
    expect(screen.getByTitle('player1 (Colonel Mustard)')).toBeInTheDocument();
  });

  test('displays single-word name initials correctly', () => {
    const singleNamePlayer = {
      character: {
        name: 'Plum',
        colorHex: '#5E3577',
        textColorHex: '#FFFFFF'
      },
      username: 'player3'
    };

    render(<PlayerToken player={singleNamePlayer} />);
    expect(screen.getByText('PL')).toBeInTheDocument();
  });

  test('handles empty name correctly', () => {
    const noNamePlayer = {
      character: {
        name: '',
        colorHex: '#5E3577',
        textColorHex: '#FFFFFF'
      },
      username: 'player4'
    };

    render(<PlayerToken player={noNamePlayer} />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });
});