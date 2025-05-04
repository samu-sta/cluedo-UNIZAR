/*************************************************
 * Modelo de Puerta
 * 
 * Este modelo representa las puertas de las habitaciones
 * en el tablero del juego Cluedo, definiendo su posición
 * y la habitación a la que pertenecen.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const DoorModel = sequelize.define('Door', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  roomId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Room',
      key: 'id'
    }
  },
  row: {
    type: DataTypes.INTEGER
  },
  column: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'Door',
  timestamps: false,
  sequelize
});

export default DoorModel;