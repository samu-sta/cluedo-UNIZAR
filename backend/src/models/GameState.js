import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const GameState = sequelize.define('GameState', {
  id: {
    type: DataTypes.ENUM('NOT_STARTED', 'IN_PROGRESS', 'FINISHED'),
    primaryKey: true
  }
}, {
  tableName: 'GameState',
  timestamps: false
});

export default GameState;