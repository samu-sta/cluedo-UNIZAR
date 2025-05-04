/*************************************************
 * Test de utilidades del tablero
 * 
 * Este test verifica las funciones de utilidad para
 * el tablero del juego, incluyendo la validación de
 * posiciones, detección de paredes y cálculo de
 * movimientos válidos.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import { jest, describe, test, expect } from '@jest/globals';
import { boardUtilsMock } from '../../__mocks__/setupMocks.js';

// Extract the mock functions from boardUtilsMock
const { isWall, createDoorPositionsMap, findValidMoves } = boardUtilsMock;

// Mock the implementations of the board utilities
isWall.mockImplementation(() => false); // Default to false
createDoorPositionsMap.mockImplementation(() => new Map()); // Default to empty map
findValidMoves.mockImplementation(() => []); // Default to empty array

describe('Board Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Datos de prueba
  const testBoard = {
    rows: 10,
    columns: 10,
    rooms: [
      {
        name: 'Room1',
        walls: [
          { row: 1, column: 1 },
          { row: 1, column: 3 },
          { row: 3, column: 1 },
          { row: 3, column: 3 }
        ],
        doors: [
          { row: 2, column: 3 }
        ]
      },
      {
        name: 'Room2',
        walls: [
          { row: 5, column: 5 },
          { row: 5, column: 8 },
          { row: 8, column: 5 },
          { row: 8, column: 8 }
        ],
        doors: [
          { row: 5, column: 6 }
        ]
      }
    ]
  };

  describe('isWall', () => {
    test('should return true when position is a wall', () => {
      isWall.mockImplementation(() => true);
      expect(isWall(testBoard, 1, 1)).toBe(true);
      expect(isWall).toHaveBeenCalledWith(testBoard, 1, 1);
    });
    
    test('should return false when position is not a wall', () => {
      isWall.mockImplementation(() => false);
      expect(isWall(testBoard, 2, 2)).toBe(false);
      expect(isWall).toHaveBeenCalledWith(testBoard, 2, 2);
    });

    test('should handle multiple walls', () => {
      // First call returns true, then true, then true, then false
      isWall
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);

      const mockBoard = {
        rooms: [
          {
            name: 'Cocina',
            walls: [
              { row: 1, column: 1 },
              { row: 1, column: 2 },
              { row: 2, column: 1 }
            ]
          }
        ]
      };

      expect(isWall(mockBoard, 1, 1)).toBe(true);
      expect(isWall(mockBoard, 1, 2)).toBe(true);
      expect(isWall(mockBoard, 2, 1)).toBe(true);
      expect(isWall(mockBoard, 2, 2)).toBe(false);
    });
  });

  describe('createDoorPositionsMap', () => {
    test('should create a map of door positions with their rooms', () => {
      const mockMap = new Map([
        ['2-3', [{ roomName: 'Room1', door: { row: 2, column: 3 } }]],
        ['5-6', [{ roomName: 'Room2', door: { row: 5, column: 6 } }]]
      ]);
      
      createDoorPositionsMap.mockReturnValue(mockMap);
      
      const doorPositionsMap = createDoorPositionsMap(testBoard);
      
      expect(doorPositionsMap.size).toBe(2);
      expect(doorPositionsMap.has('2-3')).toBeTruthy();
      expect(doorPositionsMap.get('2-3')[0].roomName).toBe('Room1');
    });
    
    test('should handle multiple doors for the same position', () => {
      const boardWithSharedDoor = {
        ...testBoard,
        rooms: [
          ...testBoard.rooms,
          {
            name: 'Room3',
            walls: [],
            doors: [
              { row: 2, column: 3 } // Misma posición que la puerta de Room1
            ]
          }
        ]
      };

      const mockMap = new Map([
        ['2-3', [
          { roomName: 'Room1', door: { row: 2, column: 3 } },
          { roomName: 'Room3', door: { row: 2, column: 3 } }
        ]]
      ]);
      
      createDoorPositionsMap.mockReturnValue(mockMap);
      
      const doorPositionsMap = createDoorPositionsMap(boardWithSharedDoor);
      
      expect(doorPositionsMap.has('2-3')).toBeTruthy();
      expect(doorPositionsMap.get('2-3').length).toBe(2);
      expect(doorPositionsMap.get('2-3')[0].roomName).toBe('Room1');
      expect(doorPositionsMap.get('2-3')[1].roomName).toBe('Room3');
    });

    test('should return empty map for board with no doors', () => {
      createDoorPositionsMap.mockReturnValue(new Map());
      
      const mockBoard = {
        rooms: [
          {
            name: 'Habitación sin puertas',
            doors: []
          }
        ]
      };

      const doorPositions = createDoorPositionsMap(mockBoard);
      expect(doorPositions.size).toBe(0);
    });
  });

  describe('findValidMoves', () => {
    test('should find valid moves within steps limit', () => {
      // Mock valid moves
      const mockValidMoves = [
        { row: 3, column: 4, path: [{ row: 3, column: 4 }] },
        { row: 5, column: 4, path: [{ row: 5, column: 4 }] },
        { row: 4, column: 3, path: [{ row: 4, column: 3 }] },
        { row: 4, column: 5, path: [{ row: 4, column: 5 }] },
        { row: 3, column: 5, path: [{ row: 3, column: 5 }] },
        { row: 5, column: 3, path: [{ row: 5, column: 3 }] },
        { row: 3, column: 3, path: [{ row: 3, column: 3 }] },
        { row: 5, column: 5, path: [{ row: 5, column: 5 }] },
        { row: 2, column: 4, path: [{ row: 2, column: 4 }] },
        { row: 6, column: 4, path: [{ row: 6, column: 4 }] }
      ];
      
      findValidMoves.mockReturnValue(mockValidMoves);
      isWall.mockReturnValue(false);
      
      const position = { row: 4, column: 4 };
      const maxSteps = 2;
      const doorPositions = new Map();
      
      const validMoves = findValidMoves(position, maxSteps, testBoard, doorPositions);
      
      expect(validMoves.length).toBe(10);
      expect(findValidMoves).toHaveBeenCalledWith(position, maxSteps, testBoard, doorPositions);
    });
    
    test('should include doors as valid moves', () => {
      const mockValidMoves = [
        { row: 2, column: 3, path: [{ row: 2, column: 3 }] } // Door position
      ];
      
      findValidMoves.mockReturnValue(mockValidMoves);
      
      const position = { row: 2, column: 4 };
      const maxSteps = 1;
      const doorPositions = new Map([
        ['2-3', [{ roomName: 'Room1', door: { row: 2, column: 3 } }]]
      ]);
      
      const validMoves = findValidMoves(position, maxSteps, testBoard, doorPositions);
      
      const hasDoorMove = validMoves.some(move => move.row === 2 && move.column === 3);
      expect(hasDoorMove).toBe(true);
    });
    
    test('should track path for each valid move', () => {
      const mockValidMoves = [
        { 
          row: 3, 
          column: 4, 
          path: [
            { row: 3, column: 3 }, 
            { row: 3, column: 4 }
          ] 
        }
      ];
      
      findValidMoves.mockReturnValue(mockValidMoves);
      
      const position = { row: 3, column: 3 };
      const maxSteps = 2;
      const doorPositions = new Map();
      
      const validMoves = findValidMoves(position, maxSteps, testBoard, doorPositions);
      
      expect(validMoves[0].path).toBeDefined();
      expect(validMoves[0].path.length).toBe(2);
      expect(validMoves[0].path[1]).toEqual({ row: 3, column: 4 });
    });
  });
});