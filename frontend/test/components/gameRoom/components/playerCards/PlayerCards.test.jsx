/**
 * @fileoverview Tests for PlayerCards component which is the main container for displaying all player's cards.
 * @author Samuel Felipe
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PlayerCards from '../../../../../src/components/gameRoom/components/playerCards/PlayerCards';

jest.mock('../../../../../src/components/gameRoom/components/playerCards/components/CardDrawer', () => {
  return function MockedCardDrawer({
    isCollapsed,
    toggleCollapse,
    totalCards,
    cardsData,
    leftoverCards
  }) {
    return (
      <div data-testid="mocked-card-drawer">
        <button data-testid="mock-toggle-btn" onClick={toggleCollapse}>
          {isCollapsed ? 'Expand' : 'Collapse'}
        </button>
        <div data-testid="drawer-state">{isCollapsed ? 'collapsed' : 'expanded'}</div>
        <div data-testid="total-cards">{totalCards}</div>
        <div data-testid="character-cards">{cardsData.characters.length}</div>
        <div data-testid="weapon-cards">{cardsData.weapons.length}</div>
        <div data-testid="room-cards">{cardsData.rooms.length}</div>
        <div data-testid="leftover-character-cards">{leftoverCards.characters.length}</div>
        <div data-testid="leftover-weapon-cards">{leftoverCards.weapons.length}</div>
        <div data-testid="leftover-room-cards">{leftoverCards.rooms.length}</div>
      </div>
    );
  };
});

describe('PlayerCards Integration', () => {
  const mockCards = [
    { id: 1, name: 'Character 1', type: 'character' },
    { id: 2, name: 'Character 2', type: 'character' },
    { id: 3, name: 'Weapon 1', type: 'weapon' },
    { id: 4, name: 'Weapon 2', type: 'weapon' },
    { id: 5, name: 'Room 1', type: 'room' },
    { id: 6, name: 'Room 2', type: 'room' },
    { id: 7, name: 'Room 3', type: 'room' },
  ];

  const mockLeftoverCards = [
    { id: 8, name: 'Leftover Character', type: 'character' },
    { id: 9, name: 'Leftover Weapon', type: 'weapon' },
    { id: 10, name: 'Leftover Room', type: 'room' },
  ];

  test('should organize cards by type and pass them to CardDrawer', () => {
    render(<PlayerCards cards={mockCards} leftoverCards={mockLeftoverCards} />);

    expect(screen.getByTestId('total-cards').textContent).toBe('7');
    expect(screen.getByTestId('character-cards').textContent).toBe('2');
    expect(screen.getByTestId('weapon-cards').textContent).toBe('2');
    expect(screen.getByTestId('room-cards').textContent).toBe('3');

    expect(screen.getByTestId('leftover-character-cards').textContent).toBe('1');
    expect(screen.getByTestId('leftover-weapon-cards').textContent).toBe('1');
    expect(screen.getByTestId('leftover-room-cards').textContent).toBe('1');
  });

  test('should initially render in collapsed state', () => {
    render(<PlayerCards cards={mockCards} leftoverCards={mockLeftoverCards} />);
    expect(screen.getByTestId('drawer-state').textContent).toBe('collapsed');
  });

  test('should toggle collapse state when clicking toggle button', () => {
    render(<PlayerCards cards={mockCards} leftoverCards={mockLeftoverCards} />);

    expect(screen.getByTestId('drawer-state').textContent).toBe('collapsed');

    fireEvent.click(screen.getByTestId('mock-toggle-btn'));
    expect(screen.getByTestId('drawer-state').textContent).toBe('expanded');

    fireEvent.click(screen.getByTestId('mock-toggle-btn'));
    expect(screen.getByTestId('drawer-state').textContent).toBe('collapsed');
  });

  test('should not render anything when no cards are provided', () => {
    const { container } = render(<PlayerCards cards={[]} />);
    expect(container.firstChild).toBeNull();
  });

  test('should handle leftoverCards being undefined', () => {
    render(<PlayerCards cards={mockCards} />);

    expect(screen.getByTestId('leftover-character-cards').textContent).toBe('0');
    expect(screen.getByTestId('leftover-weapon-cards').textContent).toBe('0');
    expect(screen.getByTestId('leftover-room-cards').textContent).toBe('0');
  });
});