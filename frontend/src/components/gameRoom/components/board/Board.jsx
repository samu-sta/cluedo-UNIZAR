/**
 * @fileoverview Componente que muestra el tablero de juego donde se mueven los jugadores
 * @author Samuel Felipe
 */
import React, { useState, useEffect } from 'react';
import BoardCell from './components/BoardCell';
import RoomLabel from './components/RoomLabel';
import LoadingBoard from './components/LoadingBoard';
import WaitingRoom from './components/WaitingRoom';
import './styles/Board.css';

export const Board = ({
  countdown,
  gameState,
  gameInfo,
  players,
  validMoves = [],
  isMyTurn = false,
  isMoving = false,
  hasRolled,
  movePlayer,
  currentPath
}) => {
  const [boardData, setBoardData] = useState(null);
  const [highlightedCells, setHighlightedCells] = useState([]);

  useEffect(() => {
    if (gameInfo && gameInfo.board) {
      setBoardData(gameInfo.board);
    }
  }, [gameInfo]);

  useEffect(() => {
    if (validMoves && validMoves.length > 0 && isMyTurn && hasRolled) {
      setHighlightedCells(validMoves.map(move => `${move.row}-${move.column}`));
    } else {
      setHighlightedCells([]);
    }
  }, [validMoves]);

  const handleCellClick = (row, column) => {
    if (!isMyTurn || isMoving || !hasRolled) return;

    const isValidMove = validMoves.some(move =>
      move.row === row && move.column === column
    );

    if (isValidMove) {
      movePlayer({ row, column });
    }
  };

  if (gameState !== 'playing') {
    return <WaitingRoom gameState={gameState} countdown={countdown} />;
  }

  return (
    <section className="game-board-container">
      {!boardData ? (
        <LoadingBoard />
      ) : (
        <main
          className="game-board-grid"
          style={{
            gridTemplateRows: `repeat(${boardData.rows}, 1fr)`,
            gridTemplateColumns: `repeat(${boardData.columns}, 1fr)`
          }}
        >
          {Array.from({ length: boardData.rows * boardData.columns }).map((_, index) => {
            const row = Math.floor(index / boardData.columns) + 1;
            const column = (index % boardData.columns) + 1;

            const isHighlighted = highlightedCells.includes(`${row}-${column}`) && isMyTurn && hasRolled;
            const isInCurrentPath = currentPath?.some(pos => pos.row === row && pos.column === column);

            return (
              <BoardCell
                key={`cell-${row}-${column}`}
                row={row}
                column={column}
                boardData={boardData}
                players={players}
                isHighlighted={isHighlighted}
                isInPath={isInCurrentPath}
                onClick={() => handleCellClick(row, column)}
              />
            );
          })}

          {boardData.rooms.map(room => (
            <RoomLabel key={`room-${room.name}`} room={room} />
          ))}
        </main>
      )}
    </section>
  );
};

export default Board;