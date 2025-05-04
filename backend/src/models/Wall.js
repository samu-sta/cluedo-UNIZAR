/*************************************************
 * Modelo de datos para paredes del tablero
 * 
 * Define la estructura de datos para las paredes
 * del tablero de juego, incluyendo su posición y
 * la habitación a la que pertenecen.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

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