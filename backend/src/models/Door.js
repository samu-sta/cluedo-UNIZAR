import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Room from './Room.js';

const Door = sequelize.define('Door', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  row: {
    type: DataTypes.INTEGER
  },
  column: {
    type: DataTypes.INTEGER
  },
  roomId: {
    type: DataTypes.INTEGER,
    references: {
      model: Room,
      key: 'id'
    }
  }
}, {
  tableName: 'Door',
  timestamps: false
});

export default Door;