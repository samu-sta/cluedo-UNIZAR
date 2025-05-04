import { jest } from '@jest/globals';
import { BOARD_CONFIG, ROOMS } from '../../../src/config/gameConstants.js';

class BoardService {
  constructor() {
    this.boardSize = BOARD_CONFIG.BOARD_SIZE;
    this.rooms = ROOMS;
    this.board = this._createEmptyBoard();
    
    // Player starting positions for testing
    this.startingPositions = {
      MISS_SCARLETT: { x: 1, y: 6 },
      COLONEL_MUSTARD: { x: 8, y: 1 },
      MRS_WHITE: { x: 15, y: 10 },
      MR_GREEN: { x: 10, y: 15 },
      MRS_PEACOCK: { x: 1, y: 11 },
      PROFESSOR_PLUM: { x: 5, y: 19 }
    };
    
    // Room mapping for testing
    this.roomPositions = {
      KITCHEN: [{ x: 1, y: 1 }, { x: 2, y: 2 }],
      BALLROOM: [{ x: 8, y: 3 }, { x: 9, y: 4 }],
      CONSERVATORY: [{ x: 18, y: 1 }, { x: 19, y: 4 }],
      BILLIARD_ROOM: [{ x: 18, y: 8 }, { x: 19, y: 10 }],
      LIBRARY: [{ x: 17, y: 14 }, { x: 18, y: 15 }],
      STUDY: [{ x: 17, y: 21 }, { x: 18, y: 23 }],
      HALL: [{ x: 9, y: 18 }, { x: 10, y: 22 }],
      LOUNGE: [{ x: 1, y: 18 }, { x: 2, y: 19 }],
      DINING_ROOM: [{ x: 2, y: 10 }, { x: 5, y: 13 }]
    };
    
    // Room to door mapping for testing
    this.roomDoors = {
      KITCHEN: [{ x: 4, y: 7 }],
      BALLROOM: [{ x: 8, y: 5 }, { x: 15, y: 8 }],
      CONSERVATORY: [{ x: 17, y: 5 }],
      BILLIARD_ROOM: [{ x: 15, y: 12 }],
      LIBRARY: [{ x: 14, y: 17 }],
      STUDY: [{ x: 12, y: 21 }],
      HALL: [{ x: 12, y: 15 }, { x: 13, y: 18 }],
      LOUNGE: [{ x: 6, y: 19 }],
      DINING_ROOM: [{ x: 6, y: 12 }]
    };
  }

  // Create an empty board for testing
  _createEmptyBoard() {
    const board = [];
    for (let i = 0; i < this.boardSize; i++) {
      board[i] = [];
      for (let j = 0; j < this.boardSize; j++) {
        board[i][j] = null; // Empty space
      }
    }
    return board;
  }

  // Get the board
  getBoard() {
    return this.board;
  }
  
  // Get room by position
  getRoomByPosition(x, y) {
    for (const [roomName, positions] of Object.entries(this.roomPositions)) {
      for (const pos of positions) {
        if (pos.x === x && pos.y === y) {
          return roomName;
        }
      }
    }
    return null;
  }
  
  // Check if position is inside a room
  isInsideRoom(x, y) {
    return this.getRoomByPosition(x, y) !== null;
  }
  
  // Check if position is a door
  isDoor(x, y) {
    for (const doors of Object.values(this.roomDoors)) {
      for (const door of doors) {
        if (door.x === x && door.y === y) {
          return true;
        }
      }
    }
    return false;
  }
  
  // Get all doors for a room
  getRoomDoors(roomName) {
    return this.roomDoors[roomName] || [];
  }
  
  // Check if a position is a wall
  isWall(x, y) {
    // Simplified wall detection for testing
    // Walls are typically on the perimeter of the board
    if (x === 0 || y === 0 || x === this.boardSize - 1 || y === this.boardSize - 1) {
      return true;
    }
    
    // Some internal walls between rooms (simplified for testing)
    if ((x === 5 && y === 5) || 
        (x === 10 && y === 10) || 
        (x === 15 && y === 15)) {
      return true;
    }
    
    return false;
  }
  
  // Validate move - check if move is legal given starting position and dice roll
  validateMove(startX, startY, endX, endY, diceRoll) {
    // If starting in a room, check if ending at a door or in the same room
    const startRoom = this.getRoomByPosition(startX, startY);
    const endRoom = this.getRoomByPosition(endX, endY);
    
    if (startRoom) {
      // If leaving room through a door
      if (this.isDoor(endX, endY)) {
        return true;
      }
      
      // If staying in the same room
      if (startRoom === endRoom) {
        return true;
      }
      
      // If secret passage exists between rooms
      if (this._hasSecretPassage(startRoom, endRoom)) {
        return true;
      }
      
      return false;
    }
    
    // If not in a room, check if the path is valid with the dice roll
    const distance = this._calculateShortestPath(startX, startY, endX, endY);
    
    // If ending in a room through a door, distance is calculated to the door
    if (endRoom && this.isDoor(endX, endY)) {
      return distance <= diceRoll;
    }
    
    // Normal movement on the board
    return distance <= diceRoll && !this.isWall(endX, endY) && !this.isInsideRoom(endX, endY);
  }
  
  // Roll dice for movement
  rollDice() {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    return {
      dice1,
      dice2,
      total: dice1 + dice2
    };
  }
  
  // Get available moves from a position with a dice roll
  getAvailableMoves(x, y, diceRoll) {
    const moves = [];
    
    // If in a room, can move to any door or use secret passage
    const room = this.getRoomByPosition(x, y);
    if (room) {
      // Add doors as available moves
      const doors = this.getRoomDoors(room);
      doors.forEach(door => {
        moves.push({ x: door.x, y: door.y });
      });
      
      // Add secret passage destination if exists
      const secretPassageDest = this._getSecretPassageDestination(room);
      if (secretPassageDest) {
        moves.push({ x: secretPassageDest.x, y: secretPassageDest.y });
      }
      
      return moves;
    }
    
    // If not in a room, calculate possible moves within dice roll
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        // Skip same position
        if (i === x && j === y) continue;
        
        if (this.validateMove(x, y, i, j, diceRoll)) {
          moves.push({ x: i, y: j });
        }
      }
    }
    
    return moves;
  }
  
  // Helper method to check if there's a secret passage between rooms
  _hasSecretPassage(fromRoom, toRoom) {
    const secretPassages = {
      KITCHEN: 'STUDY',
      STUDY: 'KITCHEN',
      CONSERVATORY: 'LOUNGE',
      LOUNGE: 'CONSERVATORY'
    };
    
    return secretPassages[fromRoom] === toRoom;
  }
  
  // Get destination room coordinates for a secret passage
  _getSecretPassageDestination(fromRoom) {
    const secretPassages = {
      KITCHEN: 'STUDY',
      STUDY: 'KITCHEN',
      CONSERVATORY: 'LOUNGE',
      LOUNGE: 'CONSERVATORY'
    };
    
    const toRoom = secretPassages[fromRoom];
    if (!toRoom) return null;
    
    // Return first position of destination room as example
    return this.roomPositions[toRoom][0];
  }
  
  // Helper to calculate shortest path distance (simplified for testing)
  _calculateShortestPath(startX, startY, endX, endY) {
    // Manhattan distance as simplified shortest path
    return Math.abs(endX - startX) + Math.abs(endY - startY);
  }
  
  // Initialize player positions
  initializePlayerPositions(players) {
    const positions = {};
    const characters = Object.keys(this.startingPositions);
    
    players.forEach((player, index) => {
      if (index < characters.length) {
        const character = characters[index];
        positions[player.id] = {
          ...this.startingPositions[character],
          character
        };
      }
    });
    
    return positions;
  }
  
  // Get starting position for a specific character
  getStartingPosition(character) {
    return this.startingPositions[character] || null;
  }
  
  // Reset any stored state for testing
  __resetMockState() {
    this.board = this._createEmptyBoard();
  }
}

// Create instance
const boardService = new BoardService();

// Mock all methods with Jest
Object.getOwnPropertyNames(BoardService.prototype).forEach(method => {
  if (method !== 'constructor') {
    boardService[method] = jest.fn(boardService[method]);
  }
});

export default boardService;