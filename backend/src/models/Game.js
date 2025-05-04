/*************************************************
 * Modelo de Partida
 * 
 * Este modelo representa una partida del juego Cluedo,
 * almacenando su identificador único y nombre. Es la
 * entidad principal que conecta todos los elementos
 * del juego.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const GameModel = sequelize.define('Game', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'Game',
  timestamps: false,
  sequelize
});

export default GameModel;