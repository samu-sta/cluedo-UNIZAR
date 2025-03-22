import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const CardModel = sequelize.define('Card', {
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
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('weapon', 'character', 'room'),
    allowNull: false
  }
}, {
  tableName: 'Card',
  timestamps: false,
  sequelize
});

export default CardModel;