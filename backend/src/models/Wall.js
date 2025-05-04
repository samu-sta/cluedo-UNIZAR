import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const WallModel = sequelize.define('Wall', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  roomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Room',
      key: 'id'
    }
  },
  row: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  column: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  tableName: 'Wall',
  timestamps: false,
  sequelize
});

export default WallModel;