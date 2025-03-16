import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const Board = sequelize.define('Board', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  row: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  column: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Board',
  timestamps: false
});

export default Board;