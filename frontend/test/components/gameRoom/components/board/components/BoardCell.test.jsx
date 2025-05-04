import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BoardCell from '../../../../../../src/components/gameRoom/components/board/components/BoardCell';

// Mock PlayerToken component used in BoardCell
jest.mock('../../../../../../src/components/gameRoom/components/board/components/PlayerToken', () => {
  return function MockedPlayerToken({ player }) {
    return <div data-testid={`player-token-${player.id}`} className="mock-player-token">{player.name}</div>;
  };
});

describe('BoardCell Component', () => {
  const mockBoardData = {
    rooms: [
      {
        name: 'Biblioteca',
        walls: [
          { row: 5, column: 5 },
          { row: 5, column: 6 }
        ],
        doors: [
          { row: 6, column: 5 }
        ]
      }
    ]
  };

  const mockPlayers = [
    { id: 1, name: 'Player 1', position: { row: 1, column: 1 } },
    { id: 2, name: 'Player 2', position: { row: 2, column: 2 } }
  ];

  const mockOnClick = jest.fn();

  test('renders standard cell correctly', () => {
    const { container } = render(
      <BoardCell
        row={1}
        column={1}
        boardData={mockBoardData}
        players={mockPlayers}
        onClick={mockOnClick}
      />
    );

    const cellElement = container.querySelector('.board-cell');
    expect(cellElement).toBeInTheDocument();
    expect(cellElement.classList.contains('wall')).toBe(false);
    expect(cellElement.classList.contains('door')).toBe(false);
  });

  test('renders wall cell correctly', () => {
    const { container } = render(
      <BoardCell
        row={5}
        column={5}
        boardData={mockBoardData}
        players={mockPlayers}
        onClick={mockOnClick}
      />
    );

    const cellElement = container.querySelector('.board-cell');
    expect(cellElement).toBeInTheDocument();
    expect(cellElement.classList.contains('wall')).toBe(true);
  });

  test('renders door cell correctly', () => {
    const { container } = render(
      <BoardCell
        row={6}
        column={5}
        boardData={mockBoardData}
        players={mockPlayers}
        onClick={mockOnClick}
      />
    );

    const cellElement = container.querySelector('.board-cell');
    expect(cellElement).toBeInTheDocument();
    expect(cellElement.classList.contains('door')).toBe(true);
  });

  test('renders highlighted cell correctly', () => {
    const { container } = render(
      <BoardCell
        row={1}
        column={1}
        boardData={mockBoardData}
        players={mockPlayers}
        isHighlighted={true}
        onClick={mockOnClick}
      />
    );

    const cellElement = container.querySelector('.board-cell');
    expect(cellElement.classList.contains('valid-move')).toBe(true);
  });

  test('renders path cell correctly', () => {
    const { container } = render(
      <BoardCell
        row={1}
        column={1}
        boardData={mockBoardData}
        players={mockPlayers}
        isInPath={true}
        onClick={mockOnClick}
      />
    );

    const cellElement = container.querySelector('.board-cell');
    expect(cellElement.classList.contains('in-path')).toBe(true);
  });

  test('renders player token when player is on the cell', () => {
    render(
      <BoardCell
        row={1}
        column={1}
        boardData={mockBoardData}
        players={mockPlayers}
        onClick={mockOnClick}
      />
    );

    expect(screen.getByTestId('player-token-1')).toBeInTheDocument();
    expect(screen.queryByTestId('player-token-2')).not.toBeInTheDocument();
  });

  test('calls onClick when cell is clicked', () => {
    render(
      <BoardCell
        row={1}
        column={1}
        boardData={mockBoardData}
        players={mockPlayers}
        onClick={mockOnClick}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});