/**
 * @fileoverview Utilidades para el tablero del juego
 * Este archivo contiene funciones para calcular movimientos
 * en el tablero, validar posiciones y encontrar rutas entre
 * diferentes ubicaciones del juego Cluedo.
 * @author SAMUEL FELIPE
 */

export const isWall = (board, row, column) => {
  return board.rooms.some(room =>
    room.walls.some(wall => wall.row === row && wall.column === column)
  );
};

export const createDoorPositionsMap = (board) => {
  const doorPositions = new Map();

  board.rooms.forEach(room => {
    room.doors.forEach(door => {
      const key = `${door.row}-${door.column}`;
      if (!doorPositions.has(key)) {
        doorPositions.set(key, []);
      }
      doorPositions.get(key).push({
        roomName: room.name,
        door: { row: door.row, column: door.column }
      });
    });
  });

  return doorPositions;
};

export const findValidMoves = (position, maxSteps, board, doorPositions) => {
  const queue = [{
    row: position.row,
    column: position.column,
    steps: 0,
    path: []
  }];

  const visited = new Set();
  const validMoves = [];

  while (queue.length > 0) {
    const { row, column, steps, path } = queue.shift();
    const posKey = `${row}-${column}`;

    if (visited.has(posKey)) continue;
    visited.add(posKey);

    if (steps > 0) {
      validMoves.push({
        row,
        column,
        path: [...path, { row, column }]
      });
    }

    if (steps >= maxSteps) continue;

    processDoorMovement(row, column, steps, path, doorPositions, queue, board);

    exploreAdjacentCells(row, column, steps, path, queue, board);
  }

  return validMoves;
};

const processDoorMovement = (row, column, steps, path, doorPositions, queue, board) => {
  const doorKey = `${row}-${column}`;
  if (doorPositions.has(doorKey) && steps > 0) {
    const roomDoors = doorPositions.get(doorKey);
    roomDoors.forEach(roomDoor => {
      board.rooms
        .find(r => r.name === roomDoor.roomName)
        .doors.forEach(door => {
          if (door.row !== row || door.column !== column) {
            queue.push({
              row: door.row,
              column: door.column,
              steps: steps + 1,
              path: [...path, { row, column }]
            });
          }
        });
    });
  }
};

const exploreAdjacentCells = (row, column, steps, path, queue, board) => {
  const directions = [
    { dr: -1, dc: 0 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
    { dr: 0, dc: 1 }
  ];

  for (const { dr, dc } of directions) {
    const newRow = row + dr;
    const newColumn = column + dc;

    if (newRow < 1 || newRow > board.rows ||
      newColumn < 1 || newColumn > board.columns) {
      continue;
    }

    if (isWall(board, newRow, newColumn)) {
      continue;
    }

    queue.push({
      row: newRow,
      column: newColumn,
      steps: steps + 1,
      path: [...path, { row, column }]
    });
  }
};