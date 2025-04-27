import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TurnIndicator from '../../../../src/components/gameRoom/components/TurnIndicator';

describe('TurnIndicator component', () => {
  const mockPassTurn = jest.fn();
  const mockMakeAccusation = jest.fn();
  const mockMakeSuggestion = jest.fn();

  const defaultProps = {
    currentTurn: {
      playerName: 'TestPlayer',
      turnIndex: 0,
      totalPlayers: 4
    },
    isMyTurn: false,
    onPassTurn: mockPassTurn,
    onMakeAccusation: mockMakeAccusation,
    onMakeSuggestion: mockMakeSuggestion,
    canMakeSuggestion: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders turn information correctly', () => {
    render(<TurnIndicator {...defaultProps} />);
    
    expect(screen.getByText('Turno de:')).toBeInTheDocument();
    expect(screen.getByText('TestPlayer')).toBeInTheDocument();
    expect(screen.getByText('Turno 1/4')).toBeInTheDocument();
  });

  test('does not show action buttons when it is not the player\'s turn', () => {
    render(<TurnIndicator {...defaultProps} />);
    
    expect(screen.queryByText('Hacer Sugerencia')).not.toBeInTheDocument();
    expect(screen.queryByText('Hacer Acusación')).not.toBeInTheDocument();
    expect(screen.queryByText('Pasar turno')).not.toBeInTheDocument();
  });

  test('shows action buttons when it is the player\'s turn', () => {
    render(<TurnIndicator {...defaultProps} isMyTurn={true} />);
    
    expect(screen.getByText('Hacer Acusación')).toBeInTheDocument();
    expect(screen.getByText('Pasar turno')).toBeInTheDocument();
  });

  test('shows suggestion button when canMakeSuggestion is true', () => {
    render(
      <TurnIndicator 
        {...defaultProps} 
        isMyTurn={true} 
        canMakeSuggestion={true}
      />
    );
    
    expect(screen.getByText('Hacer Sugerencia')).toBeInTheDocument();
  });

  test('calls onPassTurn when pass turn button is clicked', () => {
    render(<TurnIndicator {...defaultProps} isMyTurn={true} />);
    
    const passButton = screen.getByText('Pasar turno');
    fireEvent.click(passButton);
    
    expect(mockPassTurn).toHaveBeenCalledTimes(1);
  });

  test('calls onMakeAccusation when accusation button is clicked', () => {
    render(<TurnIndicator {...defaultProps} isMyTurn={true} />);
    
    const accusationButton = screen.getByText('Hacer Acusación');
    fireEvent.click(accusationButton);
    
    expect(mockMakeAccusation).toHaveBeenCalledTimes(1);
  });

  test('calls onMakeSuggestion when suggestion button is clicked', () => {
    render(
      <TurnIndicator 
        {...defaultProps} 
        isMyTurn={true} 
        canMakeSuggestion={true}
      />
    );
    
    const suggestionButton = screen.getByText('Hacer Sugerencia');
    fireEvent.click(suggestionButton);
    
    expect(mockMakeSuggestion).toHaveBeenCalledTimes(1);
  });
});