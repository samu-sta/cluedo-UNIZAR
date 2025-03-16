import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Player from './Player.js';

const PlayerPosition = sequelize.define('PlayerPosition', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Player,
      key: 'id'
    }
  },
  row: {
    type: DataTypes.INTEGER
  },
  column: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'PlayerPosition',
  timestamps: false
});

export default PlayerPosition;