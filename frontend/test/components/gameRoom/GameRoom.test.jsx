/*************************************************
 * Pruebas para el componente GameRoom
 * 
 * Verifica el funcionamiento correcto de la sala de
 * juego principal, incluyendo la integración de sus
 * componentes y el manejo de estados del juego.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import GameRoom from '../../../src/components/gameRoom/GameRoom';
import useGameSocket from '../../../src/components/gameRoom/hooks/useGameSocket';

jest.mock('../../../src/components/gameRoom/hooks/useGameSocket');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ gameId: 'test-game-123' }),
  useNavigate: () => jest.fn()
}));

const mockLocalStorage = {
  getItem: jest.fn().mockImplementation(() => JSON.stringify({ username: 'testuser', id: 1 })),
  setItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

const renderGameRoom = (user = { username: 'testuser', id: 1 }) => {
  return render(
    <MemoryRouter initialEntries={['/game/test-game-123']}>
      <Routes>
        <Route path="/game/:gameId" element={<GameRoom user={user} />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('GameRoom Component', () => {
  const defaultMockReturn = {
    players: [
      { username: 'testuser', character: { name: 'Colonel Mustard', colorHex: '#FFBB00', textColorHex: '#000000' } },
      { username: 'player2', character: { name: 'Miss Scarlet', colorHex: '#FF0000', textColorHex: '#FFFFFF' } }
    ],
    loading: false,
    error: null,
    countdown: null,
    gameState: 'playing',
    gameInfo: {
      id: 'test-game-123',
      board: {
        rows: 24,
        columns: 24,
        rooms: [
          {
            name: 'Kitchen',
            walls: [{ row: 1, column: 1 }, { row: 1, column: 5 }],
            doors: [{ row: 1, column: 3 }]
          }
        ]
      },
      turnNumber: 1,
      maxTurns: 10
    },
    winner: null,
    endReason: null,
    playerCards: [],
    leftoverCards: [],
    currentTurn: 'testuser',
    isMyTurn: true,
    passTurn: jest.fn(),
    rollDice: jest.fn(),
    diceResult: [3, 4],
    sendReady: jest.fn(),
    leaveGame: jest.fn(),
    validMoves: [{ row: 2, column: 2 }],
    isMoving: false,
    hasRolled: true,
    makeAccusation: jest.fn(),
    showAccusationModal: false,
    setShowAccusationModal: jest.fn(),
    solution: null,
    incorrectAccusation: false,
    incorrectAccusationMessage: '',
    resetIncorrectAccusation: jest.fn(),
    movePlayer: jest.fn(),
    currentPath: [],
    makeSuggestion: jest.fn(),
    showSuggestionModal: false,
    setShowSuggestionModal: jest.fn(),
    canMakeSuggestion: true,
    currentRoom: 'Kitchen',
    hasSuggested: false,
    currentSuggestion: null,
    showCardModal: false,
    setShowCardModal: jest.fn(),
    showCard: jest.fn(),
    cardsShown: [],
    suggestionResponses: [],
    setSuggestionResponses: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useGameSocket.mockReturnValue(defaultMockReturn);
  });

  test('renders loading state correctly', () => {
    useGameSocket.mockReturnValue({
      ...defaultMockReturn,
      loading: true
    });

    renderGameRoom();

    expect(screen.getByText('Conectando a la partida...')).toBeInTheDocument();
    expect(screen.getByRole('figure', { name: '' })).toHaveClass('loading-spinner');
  });

  test('renders error state correctly', () => {
    useGameSocket.mockReturnValue({
      ...defaultMockReturn,
      loading: false,
      error: 'Error al conectar a la partida'
    });

    renderGameRoom();

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Error al conectar a la partida')).toBeInTheDocument();
    expect(screen.getByText('Volver a partidas')).toBeInTheDocument();
  });

  test('renders game room with proper components when playing', () => {
    renderGameRoom();

    expect(screen.getByText('Colonel Mustard')).toBeInTheDocument();

    expect(screen.getByText('En juego')).toBeInTheDocument();

    expect(screen.getByText('Turno de:')).toBeInTheDocument();
    expect(screen.getByText('Turno NaN/')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Tirar dados/i })).toBeInTheDocument();
  });

  test('allows rolling dice when it is player turn', async () => {
    renderGameRoom();

    const rollDiceButton = screen.getByRole('button', { name: /Tirar dados/i });
    fireEvent.click(rollDiceButton);

    expect(defaultMockReturn.rollDice).toHaveBeenCalled();
  });

  test('does not show leave game confirmation when clicking the button', async () => {
    renderGameRoom();

    const leaveGameButton = screen.getByRole('button', { name: /Abandonar partida/i });
    fireEvent.click(leaveGameButton);

    await waitFor(() => {
      expect(screen.getByText(/¿Estás seguro/i)).toBeInTheDocument();
    });
  });

  test('renders game ended modal when game is over', () => {
    useGameSocket.mockReturnValue({
      ...defaultMockReturn,
      gameState: 'ended',
      winner: 'testuser',
      solution: {
        character: { name: 'Colonel Mustard' },
        weapon: { name: 'Candlestick' },
        room: { name: 'Kitchen' }
      }
    });

    renderGameRoom();

    expect(screen.getByText('Partida finalizada')).toBeInTheDocument();
    expect(screen.getByText('Ganador:')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('La solución era:')).toBeInTheDocument();
  });

  test('allows making a suggestion when in a room', async () => {
    renderGameRoom();

    const makeSuggestionButton = screen.getByRole('button', { name: /Hacer sugerencia/i });
    fireEvent.click(makeSuggestionButton);

    expect(defaultMockReturn.setShowSuggestionModal).toHaveBeenCalledWith(true);
  });

  test('allows making an accusation', async () => {
    renderGameRoom();

    const makeAccusationButton = screen.getByRole('button', { name: /Hacer acusación/i });
    fireEvent.click(makeAccusationButton);

    expect(defaultMockReturn.setShowAccusationModal).toHaveBeenCalledWith(true);
  });

  test('redirects to login if no user', () => {
    const navigateMock = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigateMock);

    renderGameRoom(null);

    expect(navigateMock).toHaveBeenCalledWith('/login', { replace: true });
  });
});