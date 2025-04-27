import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Board } from '../../../../../src/components/gameRoom/components/board/Board';

jest.mock('../../../../../src/components/gameRoom/components/board/components/BoardCell', () => {
  return function MockedBoardCell({ row, column, isHighlighted, onClick }) {
    return (
      <button
        data-testid={`cell-${row}-${column}`}
        className={`mocked-board-cell ${isHighlighted ? 'highlighted' : ''}`}
        onClick={onClick}
      >
        Cell {row}-{column}
      </button>
    );
  };
});

jest.mock('../../../../../src/components/gameRoom/components/board/components/WaitingRoom', () => {
  return function MockedWaitingRoom({ gameState, countdown }) {
    return (
      <div data-testid="mocked-waiting-room">
        <p>Game state: {gameState}</p>
        <p>Countdown: {countdown !== null ? countdown : 'null'}</p>
      </div>
    );
  };
});

jest.mock('../../../../../src/components/gameRoom/components/board/components/LoadingBoard', () => {
  return function MockedLoadingBoard() {
    return <div data-testid="mocked-loading-board">Loading...</div>;
  };
});

jest.mock('../../../../../src/components/gameRoom/components/board/components/RoomLabel', () => {
  return function MockedRoomLabel({ room }) {
    return <div data-testid={`room-${room.name}`}>{room.name}</div>;
  };
});

describe('Board component (Integration)', () => {
  const mockMovePlayer = jest.fn();
  const defaultProps = {
    gameState: 'playing',
    gameInfo: {
      board: {
        rows: 5,
        columns: 5,
        rooms: [
          { name: 'Kitchen', row: 1, column: 1, width: 2, height: 2 },
          { name: 'Ballroom', row: 4, column: 3, width: 2, height: 2 }
        ]
      }
    },
    players: [],
    validMoves: [],
    isMyTurn: false,
    isMoving: false,
    hasRolled: false,
    movePlayer: mockMovePlayer,
    currentPath: null
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders WaitingRoom when gameState is not playing', () => {
    render(<Board {...defaultProps} gameState="waiting" countdown={10} />);

    expect(screen.getByTestId('mocked-waiting-room')).toBeInTheDocument();
    expect(screen.getByText('Game state: waiting')).toBeInTheDocument();
    expect(screen.getByText('Countdown: 10')).toBeInTheDocument();
  });

  test('renders LoadingBoard when in playing state but board data is not available', () => {
    render(<Board {...defaultProps} gameInfo={null} />);

    expect(screen.getByTestId('mocked-loading-board')).toBeInTheDocument();
  });

  test('renders board grid with correct dimensions when data is available', () => {
    render(<Board {...defaultProps} />);

    const cells = screen.getAllByTestId(/cell-\d+-\d+/);
    expect(cells.length).toBe(25);
  });

  test('renders room labels correctly', () => {
    render(<Board {...defaultProps} />);

    expect(screen.getByTestId('room-Kitchen')).toBeInTheDocument();
    expect(screen.getByTestId('room-Ballroom')).toBeInTheDocument();
  });

  test('highlights valid moves when it\'s player\'s turn and dice have been rolled', () => {
    const validMoves = [
      { row: 1, column: 3 },
      { row: 2, column: 2 }
    ];

    render(
      <Board
        {...defaultProps}
        validMoves={validMoves}
        isMyTurn={true}
        hasRolled={true}
      />
    );

    expect(screen.getByTestId('cell-1-3').className).toContain('highlighted');
    expect(screen.getByTestId('cell-2-2').className).toContain('highlighted');

    expect(screen.getByTestId('cell-1-1').className).not.toContain('highlighted');
  });

  test('does not highlight cells when it\'s not player\'s turn', () => {
    const validMoves = [
      { row: 1, column: 3 },
      { row: 2, column: 2 }
    ];

    render(
      <Board
        {...defaultProps}
        validMoves={validMoves}
        isMyTurn={false}
        hasRolled={true}
      />
    );

    expect(screen.getByTestId('cell-1-3').className).not.toContain('highlighted');
    expect(screen.getByTestId('cell-2-2').className).not.toContain('highlighted');
  });

  test('does not highlight cells when dice have not been rolled', () => {
    const validMoves = [
      { row: 1, column: 3 },
      { row: 2, column: 2 }
    ];

    render(
      <Board
        {...defaultProps}
        validMoves={validMoves}
        isMyTurn={true}
        hasRolled={false}
      />
    );

    expect(screen.getByTestId('cell-1-3').className).not.toContain('highlighted');
    expect(screen.getByTestId('cell-2-2').className).not.toContain('highlighted');
  });

  test('calls movePlayer when clicking on a valid move cell', () => {
    const validMoves = [
      { row: 1, column: 3 },
      { row: 2, column: 2 }
    ];

    render(
      <Board
        {...defaultProps}
        validMoves={validMoves}
        isMyTurn={true}
        hasRolled={true}
      />
    );

    fireEvent.click(screen.getByTestId('cell-1-3'));

    expect(mockMovePlayer).toHaveBeenCalledTimes(1);
    expect(mockMovePlayer).toHaveBeenCalledWith({ row: 1, column: 3 });
  });

  test('does not call movePlayer when clicking on an invalid move cell', () => {
    const validMoves = [
      { row: 1, column: 3 },
      { row: 2, column: 2 }
    ];

    render(
      <Board
        {...defaultProps}
        validMoves={validMoves}
        isMyTurn={true}
        hasRolled={true}
      />
    );

    fireEvent.click(screen.getByTestId('cell-3-3'));

    expect(mockMovePlayer).not.toHaveBeenCalled();
  });

  test('does not call movePlayer when it\'s not player\'s turn', () => {
    const validMoves = [
      { row: 1, column: 3 },
      { row: 2, column: 2 }
    ];

    render(
      <Board
        {...defaultProps}
        validMoves={validMoves}
        isMyTurn={false}
        hasRolled={true}
      />
    );

    fireEvent.click(screen.getByTestId('cell-1-3'));

    expect(mockMovePlayer).not.toHaveBeenCalled();
  });

  test('does not call movePlayer when dice have not been rolled', () => {
    const validMoves = [
      { row: 1, column: 3 },
      { row: 2, column: 2 }
    ];

    render(
      <Board
        {...defaultProps}
        validMoves={validMoves}
        isMyTurn={true}
        hasRolled={false}
      />
    );

    fireEvent.click(screen.getByTestId('cell-1-3'));

    expect(mockMovePlayer).not.toHaveBeenCalled();
  });

  test('does not call movePlayer when player is already moving', () => {
    const validMoves = [
      { row: 1, column: 3 },
      { row: 2, column: 2 }
    ];

    render(
      <Board
        {...defaultProps}
        validMoves={validMoves}
        isMyTurn={true}
        hasRolled={true}
        isMoving={true}
      />
    );

    fireEvent.click(screen.getByTestId('cell-1-3'));

    expect(mockMovePlayer).not.toHaveBeenCalled();
  });
});

