import React, { useState, useEffect } from 'react';
import BoardCell from './components/BoardCell';
import RoomLabel from './components/RoomLabel';
import LoadingBoard from './components/LoadingBoard';
import WaitingRoom from './components/WaitingRoom';
import './styles/Board.css';

export const Board = ({ countdown, gameState, gameInfo }) => {
  const [boardData, setBoardData] = useState(null);

  useEffect(() => {
    if (gameInfo && gameInfo.board) {
      setBoardData(gameInfo.board);
    }
  }, [gameInfo]);

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

            return (
              <BoardCell
                key={`cell-${row}-${column}`}
                row={row}
                column={column}
                boardData={boardData}
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