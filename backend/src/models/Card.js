import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Room from './Room.js';

const Card = sequelize.define('Card', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('weapon', 'character', 'room'),
    allowNull: false
  },
  roomId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Room,
      key: 'id'
    }
  }
}, {
  tableName: 'Card',
  timestamps: false
});

export default Card;