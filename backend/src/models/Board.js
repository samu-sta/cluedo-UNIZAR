import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const BoardModel = sequelize.define('Board', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  gameId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Game',
      key: 'id'
    }
  },
  rows: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  columns: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Board',
  timestamps: false,
  sequelize
});

export default BoardModel;