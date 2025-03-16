import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Board from './Board.js';

const Room = sequelize.define('Room', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  boardId: {
    type: DataTypes.INTEGER,
    references: {
      model: Board,
      key: 'id'
    }
  }
}, {
  tableName: 'Room',
  timestamps: false
});

export default Room;