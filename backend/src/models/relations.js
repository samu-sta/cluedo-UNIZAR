/*************************************************
 * Relaciones entre Modelos
 * 
 * Este archivo configura las relaciones entre los
 * diferentes modelos de la base de datos, estableciendo
 * las conexiones one-to-one y one-to-many necesarias
 * para representar la estructura del juego.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import GameModel from './Game.js';
import BoardModel from './Board.js';
import RoomModel from './Room.js';
import WallModel from './Wall.js';
import DoorModel from './Door.js';
import CardModel from './Card.js';
import AccountModel from './Account.js';
import UserModel from './User.js';

export const setupRelations = () => {
  // Relaciones Account -> User (one-to-one)
  AccountModel.hasOne(UserModel, { foreignKey: 'accountId' });
  UserModel.belongsTo(AccountModel, { foreignKey: 'accountId' });

  // Relaciones Game -> Board (one-to-one)
  GameModel.hasOne(BoardModel, { foreignKey: 'gameId', as: 'board' });
  BoardModel.belongsTo(GameModel, { foreignKey: 'gameId' });

  // Relaciones Game -> Card (one-to-many)
  GameModel.hasMany(CardModel, { foreignKey: 'gameId', as: 'cards' });
  CardModel.belongsTo(GameModel, { foreignKey: 'gameId' });

  // Relaciones Board -> Room (one-to-many)
  BoardModel.hasMany(RoomModel, { foreignKey: 'boardId', as: 'rooms' });
  RoomModel.belongsTo(BoardModel, { foreignKey: 'boardId' });

  // Relaciones Room -> Wall (one-to-many)
  RoomModel.hasMany(WallModel, { foreignKey: 'roomId', as: 'walls' });
  WallModel.belongsTo(RoomModel, { foreignKey: 'roomId' });

  // Relaciones Room -> Door (one-to-many)
  RoomModel.hasMany(DoorModel, { foreignKey: 'roomId', as: 'doors' });
  DoorModel.belongsTo(RoomModel, { foreignKey: 'roomId' });

  console.log('Relaciones de base de datos configuradas correctamente');
};

export default setupRelations;