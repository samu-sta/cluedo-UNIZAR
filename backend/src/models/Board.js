/*************************************************
 * Modelo de datos para el tablero de juego
 * 
 * Define la estructura de datos para el tablero
 * del juego Cluedo, especificando sus dimensiones
 * y la relación con la partida correspondiente.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const BoardModel = sequelize.define('Board', {
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
  rows: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  columns: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Board',
  timestamps: false,
  sequelize
});

export default BoardModel;