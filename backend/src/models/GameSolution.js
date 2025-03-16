import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Game from './Game.js';
import Card from './Card.js';

const GameSolution = sequelize.define('GameSolution', {
  gameId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Game,
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
  }
}, {
  tableName: 'GameSolution',
  timestamps: false
});

export default GameSolution;