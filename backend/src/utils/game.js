import GameModel from "../models/Game.js";
import CardModel from "../models/Card.js";
import BoardModel from "../models/Board.js";
import RoomModel from "../models/Room.js";
import WallModel from "../models/Wall.js";
import DoorModel from "../models/Door.js";

import setupRelations from '../models/relations.js';
export const getGame = async () => {
  return await GameModel.findOne({
    attributes: {
      exclude: ['id']
    },
    include: [
      {
        model: CardModel,
        as: 'cards',
        attributes: {
          exclude: ['id', 'gameId']
        }
      },
      {
        model: BoardModel,
        as: 'board',
        attributes: {
          exclude: ['id', 'gameId']
        },
        include: [{
          model: RoomModel,
          as: 'rooms',
          attributes: {
            exclude: ['id', 'boardId']
          },
          include: [
            {
              model: WallModel,
              as: 'walls',
              attributes: {
                exclude: ['id', 'roomId']
              }
            },
            {
              model: DoorModel,
              as: 'doors',
              attributes: {
                exclude: ['id', 'roomId']
              }
            }
          ]
        }]
      }]
  });
}

export const getCards = async (gameId = 1) => {
  return await CardModel.findAll({
    where: { gameId },
    attributes: {
      exclude: ['id', 'gameId']
    },
    raw: true
  });
}

export const getBoard = async (gameId = 1) => {
  return await BoardModel.findOne({
    where: { gameId },
    attributes: {
      exclude: ['id', 'gameId']
    },
    include: [{
      model: RoomModel,
      as: 'rooms',
      attributes: {
        exclude: ['id', 'boardId']
      },
      include: [
        {
          model: WallModel,
          as: 'walls',
          attributes: {
            exclude: ['id', 'roomId']
          }
        },
        {
          model: DoorModel,
          as: 'doors',
          attributes: {
            exclude: ['id', 'roomId']
          }
        }
      ]
    }]
  });
}
export const getCharacters = async (gameId = 1) => {
  return await CardModel.findAll({
    where: { gameId, type: 'character' },
    attributes: ['name', 'colorHex', 'textColorHex'],
    raw: true
  });
}