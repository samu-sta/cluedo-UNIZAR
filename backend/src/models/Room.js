/*************************************************
 * Modelo de Habitación
 * 
 * Este modelo representa las habitaciones en el tablero
 * del juego Cluedo, con su nombre identificativo y la
 * relación con el tablero al que pertenece.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Board from './Board.js';

const RoomModel = sequelize.define('Room', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  boardId: {
    type: DataTypes.INTEGER,
    references: {
      model: Board,
      key: 'id'
    }
  }
}, {
  tableName: 'Room',
  timestamps: false,
  sequelize
});

export default RoomModel;