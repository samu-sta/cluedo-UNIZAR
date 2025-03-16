import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Player from './Player.js';
import Card from './Card.js';

const Accusation = sequelize.define('Accusation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  playerId: {
    type: DataTypes.INTEGER,
    references: {
      model: Player,
      key: 'id'
    }
  },
  weaponCardId: {
    type: DataTypes.INTEGER,
    references: {
      model: Card,
      key: 'id'
    }
  },
  characterCardId: {
    type: DataTypes.INTEGER,
    references: {
      model: Card,
      key: 'id'
    }
  },
  roomCardId: {
    type: DataTypes.INTEGER,
    references: {
      model: Card,
      key: 'id'
    }
  },
  isFinal: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Accusation',
  timestamps: false
});

export default Accusation;