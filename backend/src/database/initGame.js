import GameModel from '../models/Game.js';
import BoardModel from '../models/Board.js';
import RoomModel from '../models/Room.js';
import WallModel from '../models/Wall.js';
import DoorModel from '../models/Door.js';
import CardModel from '../models/Card.js';
import {
  ROOMS_DATA,
  WALLS_CONFIG,
  DOORS_CONFIG,
  CARDS_DATA,
  BOARD_CONFIG
} from '../config/gameConstants.js';

export const initGame = async () => {
  try {

    const game = await GameModel.create({
      name: 'Partida de Prueba'
    });

    const board = await BoardModel.create({
      gameId: game.id,
      rows: BOARD_CONFIG.rows,
      columns: BOARD_CONFIG.columns
    });

    const roomsData = ROOMS_DATA.map(room => ({
      ...room,
      boardId: board.id
    }));

    const rooms = await RoomModel.bulkCreate(roomsData);

    const roomMap = {};
    rooms.forEach(room => {
      roomMap[room.name] = room;
    });

    for (const roomName in WALLS_CONFIG) {
      const room = roomMap[roomName];
      const wallsToCreate = WALLS_CONFIG[roomName].map(wall => ({
        roomId: room.id,
        row: wall.row,
        column: wall.column
      }));

      await WallModel.bulkCreate(wallsToCreate);
    }

    for (const roomName in DOORS_CONFIG) {
      const room = roomMap[roomName];
      const doorPromises = DOORS_CONFIG[roomName].map(door =>
        DoorModel.create({
          roomId: room.id,
          row: door.row,
          column: door.column
        })
      );

      await Promise.all(doorPromises);
    }

    const cardsData = [
      ...CARDS_DATA.characters.map(character => ({
        gameId: game.id,
        name: character.name,
        colorHex: character.color,
        textColorHex: character.textColor,
        type: 'character'
      })),

      ...CARDS_DATA.weapons.map(name => ({
        gameId: game.id,
        name,
        type: 'weapon'
      })),

      ...ROOMS_DATA.map(room => ({
        gameId: game.id,
        name: room.name,
        type: 'room'
      }))
    ];

    await CardModel.bulkCreate(cardsData);

  }
  catch (error) {
    console.error('Error al inicializar la partida de prueba:', error);
    throw error;
  }
};