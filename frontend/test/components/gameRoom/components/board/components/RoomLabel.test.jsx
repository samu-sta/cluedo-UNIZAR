import React from 'react';
import { render, screen } from '@testing-library/react';
import RoomLabel from '../../../../../../src/components/gameRoom/components/board/components/RoomLabel';

describe('RoomLabel Component', () => {
  const mockRoom = {
    name: 'Biblioteca',
    walls: [
      { row: 2, column: 2 },
      { row: 2, column: 3 },
      { row: 3, column: 2 },
      { row: 3, column: 3 }
    ]
  };

  test('renders room name correctly', () => {
    render(<RoomLabel room={mockRoom} />);
    expect(screen.getByText('Biblioteca')).toBeInTheDocument();
  });

  test('positions label at the center of the room', () => {
    const { container } = render(<RoomLabel room={mockRoom} />);
    const roomLabel = container.querySelector('.room-label');

    expect(roomLabel).toHaveStyle('grid-row: 2');
    expect(roomLabel).toHaveStyle('grid-column: 2');
  });

  test('calculates center position correctly for complex rooms', () => {
    const complexRoom = {
      name: 'Salón',
      walls: [
        { row: 5, column: 5 },
        { row: 5, column: 6 },
        { row: 5, column: 7 },
        { row: 6, column: 5 },
        { row: 6, column: 6 },
        { row: 6, column: 7 },
        { row: 7, column: 5 },
        { row: 7, column: 6 },
        { row: 7, column: 7 }
      ]
    };

    const { container } = render(<RoomLabel room={complexRoom} />);
    const roomLabel = container.querySelector('.room-label');

    expect(roomLabel).toHaveStyle('grid-row: 6');
    expect(roomLabel).toHaveStyle('grid-column: 6');
  });
});