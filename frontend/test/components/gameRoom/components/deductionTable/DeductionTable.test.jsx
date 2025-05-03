/**
 * @fileoverview Tests for DeductionTable component which allows players to track their deductions about the game cards.
 * @author Samuel Felipe
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DeductionTable from '../../../../../src/components/gameRoom/components/deductionTable/DeductionTable';

jest.mock('../../../../../src/components/gameRoom/components/deductionTable/components/DeductionHeader', () => {
  return function MockedDeductionHeader({ isCollapsed, toggleCollapse }) {
    return (
      <header data-testid="mocked-deduction-header">
        <button data-testid="mock-toggle-btn" onClick={toggleCollapse}>
          {isCollapsed ? 'Expandir' : 'Colapsar'}
        </button>
        <div data-testid="header-state">{isCollapsed ? 'collapsed' : 'expanded'}</div>
      </header>
    );
  };
});

jest.mock('../../../../../src/components/gameRoom/components/deductionTable/components/DeductionGrid', () => {
  return function MockedDeductionGrid({ deductions, updateDeduction, isMobile }) {
    return (
      <div data-testid="mocked-deduction-grid">
        <div data-testid="is-mobile">{isMobile.toString()}</div>
        <div data-testid="characters-count">{Object.keys(deductions.characters).length}</div>
        <div data-testid="weapons-count">{Object.keys(deductions.weapons).length}</div>
        <div data-testid="rooms-count">{Object.keys(deductions.rooms).length}</div>
        <button
          data-testid="update-deduction-btn"
          onClick={() => updateDeduction('characters', 'Señora Celeste')}
        >
          Actualizar deducción
        </button>
      </div>
    );
  };
});

jest.mock('../../../../../src/components/gameRoom/components/deductionTable/components/DeductionLegend', () => {
  return function MockedDeductionLegend() {
    return <footer data-testid="mocked-deduction-legend">Leyenda de deducción</footer>;
  };
});

jest.mock('../../../../../src/components/gameRoom/components/deductionTable/hooks/useDeductions', () => {
  return jest.fn((...args) => {
    const gameInfo = args[0];
    const playerCards = args[1] || [];
    const leftoverCards = args[2] || [];
    const cardsShown = args[3] || [];

    const deductions = {
      characters: {},
      weapons: {},
      rooms: {}
    };

    if (gameInfo && gameInfo.cards) {
      gameInfo.cards.forEach(card => {
        if (card.type === 'character') {
          deductions.characters[card.name] = 'unknown';
        } else if (card.type === 'weapon') {
          deductions.weapons[card.name] = 'unknown';
        } else if (card.type === 'room') {
          deductions.rooms[card.name] = 'unknown';
        }
      });
    }

    return {
      deductions,
      updateDeduction: jest.fn(),
      isMobile: false
    };
  });
});

describe('DeductionTable', () => {
  const mockGameInfo = {
    cards: [
      { id: 1, name: 'Señora Celeste', type: 'character' },
      { id: 2, name: 'Coronel Rubio', type: 'character' },
      { id: 3, name: 'Candelabro', type: 'weapon' },
      { id: 4, name: 'Pistola', type: 'weapon' },
      { id: 5, name: 'Cocina', type: 'room' },
      { id: 6, name: 'Salón', type: 'room' },
      { id: 7, name: 'Biblioteca', type: 'room' }
    ]
  };

  const mockPlayerCards = [
    { id: 1, name: 'Señora Celeste', type: 'character' },
    { id: 3, name: 'Candelabro', type: 'weapon' }
  ];

  const mockLeftoverCards = [
    { id: 5, name: 'Cocina', type: 'room' }
  ];

  const mockCardsShown = [
    { id: 2, name: 'Coronel Rubio', type: 'character' }
  ];

  test('should render with collapsed state by default', () => {
    render(
      <DeductionTable
        gameInfo={mockGameInfo}
        playerCards={mockPlayerCards}
        leftoverCards={mockLeftoverCards}
        cardsShown={mockCardsShown}
      />
    );

    expect(screen.getByTestId('header-state').textContent).toBe('collapsed');
    expect(screen.getByTestId('mocked-deduction-header')).toBeInTheDocument();
    expect(screen.getByTestId('mocked-deduction-grid')).toBeInTheDocument();
    expect(screen.getByTestId('mocked-deduction-legend')).toBeInTheDocument();
  });

  test('should toggle between collapsed and expanded state on click', () => {
    render(
      <DeductionTable
        gameInfo={mockGameInfo}
        playerCards={mockPlayerCards}
      />
    );

    expect(screen.getByTestId('header-state').textContent).toBe('collapsed');

    fireEvent.click(screen.getByTestId('mock-toggle-btn'));
    expect(screen.getByTestId('header-state').textContent).toBe('expanded');

    fireEvent.click(screen.getByTestId('mock-toggle-btn'));
    expect(screen.getByTestId('header-state').textContent).toBe('collapsed');
  });

  test('should apply the correct class based on collapse state', () => {
    const { container } = render(
      <DeductionTable
        gameInfo={mockGameInfo}
        playerCards={mockPlayerCards}
      />
    );

    expect(container.querySelector('.deduction-table-container.collapsed')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('mock-toggle-btn'));
    expect(container.querySelector('.deduction-table-container.expanded')).toBeInTheDocument();
  });

  test('should pass the correct props to useDeductions', () => {
    render(
      <DeductionTable
        gameInfo={mockGameInfo}
        playerCards={mockPlayerCards}
        leftoverCards={mockLeftoverCards}
        cardsShown={mockCardsShown}
      />
    );

    expect(screen.getByTestId('characters-count').textContent).toBe('2');
    expect(screen.getByTestId('weapons-count').textContent).toBe('2');
    expect(screen.getByTestId('rooms-count').textContent).toBe('3');
  });
});