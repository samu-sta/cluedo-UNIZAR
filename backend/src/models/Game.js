import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Board from './Board.js';

const Game = sequelize.define('Game', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  state: {
    type: DataTypes.ENUM('NOT_STARTED', 'IN_PROGRESS', 'FINISHED'),
    defaultValue: 'NOT_STARTED'
  },
  turn: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  boardId: {
    type: DataTypes.INTEGER,
    references: {
      model: Board,
      key: 'id'
    }
  }
}, {
  tableName: 'Game',
  timestamps: false
});

export default Game;