/**
 * @fileoverview Tests for CardDrawer component which displays the player's cards in a collapsible drawer.
 * @author Samuel Felipe
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CardDrawer from '../../../../../src/components/gameRoom/components/playerCards/components/CardDrawer';

// Mock dependencies
jest.mock('react-icons/io', () => ({
  IoIosArrowDown: () => <div data-testid="mock-arrow-icon" />
}));

jest.mock('../../../../../src/components/gameRoom/components/playerCards/components/CardSection', () => {
  return function MockedCardSection({ title, cardsData, isLeftover, className }) {
    return (
      <div
        data-testid={`mocked-card-section${isLeftover ? '-leftover' : ''}`}
        className={className}
      >
        {title && <h3>{title}</h3>}
        <div>Card Section Content</div>
      </div>
    );
  };
});

describe('CardDrawer Component', () => {
  const mockToggleCollapse = jest.fn();
  const mockCardsData = {
    characters: [{ name: 'Character 1' }],
    weapons: [{ name: 'Weapon 1' }],
    rooms: [{ name: 'Room 1' }]
  };
  const mockLeftoverCards = {
    characters: [{ name: 'Leftover Character' }],
    weapons: [],
    rooms: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render collapsed when isCollapsed is true', () => {
    const { container } = render(
      <CardDrawer
        isCollapsed={true}
        toggleCollapse={mockToggleCollapse}
        totalCards={3}
        cardsData={mockCardsData}
      />
    );
    expect(container.firstChild).toHaveClass('player-cards-drawer');
    expect(container.firstChild).toHaveClass('collapsed');
  });

  test('should render expanded when isCollapsed is false', () => {
    const { container } = render(
      <CardDrawer
        isCollapsed={false}
        toggleCollapse={mockToggleCollapse}
        totalCards={3}
        cardsData={mockCardsData}
      />
    );
    expect(container.firstChild).toHaveClass('expanded');
  });

  test('should display correct total cards count', () => {
    render(
      <CardDrawer
        isCollapsed={true}
        toggleCollapse={mockToggleCollapse}
        totalCards={5}
        cardsData={mockCardsData}
      />
    );
    expect(screen.getByText('Tus Cartas (5)')).toBeInTheDocument();
  });

  test('should call toggleCollapse when header is clicked', () => {
    render(
      <CardDrawer
        isCollapsed={true}
        toggleCollapse={mockToggleCollapse}
        totalCards={3}
        cardsData={mockCardsData}
      />
    );
    const header = screen.getByText('Tus Cartas (3)').closest('header');
    fireEvent.click(header);
    expect(mockToggleCollapse).toHaveBeenCalledTimes(1);
  });

  test('should render regular cards section', () => {
    render(
      <CardDrawer
        isCollapsed={false}
        toggleCollapse={mockToggleCollapse}
        totalCards={3}
        cardsData={mockCardsData}
      />
    );
    expect(screen.getByTestId('mocked-card-section')).toBeInTheDocument();
  });

  test('should render leftover cards section with title', () => {
    render(
      <CardDrawer
        isCollapsed={false}
        toggleCollapse={mockToggleCollapse}
        totalCards={3}
        cardsData={mockCardsData}
        leftoverCards={mockLeftoverCards}
      />
    );
    expect(screen.getByTestId('mocked-card-section-leftover')).toBeInTheDocument();
    expect(screen.getByText('Cartas Sobrantes')).toBeInTheDocument();
  });

  test('should render arrow icon in toggle button', () => {
    render(
      <CardDrawer
        isCollapsed={true}
        toggleCollapse={mockToggleCollapse}
        totalCards={3}
        cardsData={mockCardsData}
      />
    );
    expect(screen.getByTestId('mock-arrow-icon')).toBeInTheDocument();
  });
});