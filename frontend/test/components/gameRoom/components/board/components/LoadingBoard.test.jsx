/**
 * @fileoverview Tests for LoadingBoard component which displays a loading spinner and text while the game board is loading.
 * @author Samuel Felipe
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingBoard from '../../../../../../src/components/gameRoom/components/board/components/LoadingBoard';

describe('LoadingBoard Component', () => {
  test('renders loading spinner', () => {
    const { container } = render(<LoadingBoard />);
    expect(container.querySelector('.loading-spinner')).toBeInTheDocument();
  });

  test('renders loading text', () => {
    render(<LoadingBoard />);
    expect(screen.getByText('Cargando tablero...')).toBeInTheDocument();
  });
});