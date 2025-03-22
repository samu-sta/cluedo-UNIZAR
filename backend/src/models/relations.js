import Game from './Game.js';
import Board from './Board.js';
import Room from './Room.js';
import Wall from './Wall.js';
import Door from './Door.js';
import Card from './Card.js';
import Account from './Account.js';
import User from './User.js';
import Admin from './Admin.js';

export const setupRelations = () => {
  // Relaciones Account -> User/Admin (one-to-one)
  Account.hasOne(User, { foreignKey: 'accountId' });
  User.belongsTo(Account, { foreignKey: 'accountId' });

  Account.hasOne(Admin, { foreignKey: 'accountId' });
  Admin.belongsTo(Account, { foreignKey: 'accountId' });

  // Relaciones Game -> Board (one-to-many)
  Game.hasOne(Board, { foreignKey: 'gameId' });
  Board.belongsTo(Game, { foreignKey: 'gameId' });

  // Relaciones Game -> Card (one-to-many)
  Game.hasMany(Card, { foreignKey: 'gameId' });
  Card.belongsTo(Game, { foreignKey: 'gameId' });

  // Relaciones Board -> Room (one-to-many)
  Board.hasMany(Room, { foreignKey: 'boardId' });
  Room.belongsTo(Board, { foreignKey: 'boardId' });

  // Relaciones Room -> Wall (one-to-many)
  Room.hasMany(Wall, { foreignKey: 'roomId' });
  Wall.belongsTo(Room, { foreignKey: 'roomId' });

  // Relaciones Room -> Door (one-to-many)
  Room.hasMany(Door, { foreignKey: 'roomId' });
  Door.belongsTo(Room, { foreignKey: 'roomId' });

  console.log('Relaciones de base de datos configuradas correctamente');
};

export default setupRelations;