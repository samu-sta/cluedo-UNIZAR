import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import User from './User.js';
import Game from './Game.js';

const Player = sequelize.define('Player', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  gameId: {
    type: DataTypes.INTEGER,
    references: {
      model: Game,
      key: 'id'
    }
  },
  turn: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  playerState: {
    type: DataTypes.ENUM('PLAYING', 'KICKED_BY_ACCUSATION', 'KICKED_BY_ADMIN'),
    defaultValue: 'PLAYING'
  }
}, {
  tableName: 'Player',
  timestamps: false
});

export default Player;