import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Player from './Player.js';
import Card from './Card.js';

const PlayerCard = sequelize.define('PlayerCard', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Player,
      key: 'id'
    }
  },
  cardId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Card,
      key: 'id'
    }
  }
}, {
  tableName: 'Player_Card',
  timestamps: false
});

export default PlayerCard;