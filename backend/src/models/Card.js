/*************************************************
 * Modelo de datos para cartas del juego
 * 
 * Define la estructura de datos para las cartas
 * del juego Cluedo, incluyendo personajes, armas 
 * y habitaciones con sus características visuales.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const CardModel = sequelize.define('Card', {
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
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('weapon', 'character', 'room'),
    allowNull: false
  },
  colorHex: {
    type: DataTypes.STRING(7),
    allowNull: true
  },
  textColorHex: {
    type: DataTypes.STRING(7),
    allowNull: true,
    defaultValue: '#FFFFFF'
  }
}, {
  tableName: 'Card',
  timestamps: false,
  sequelize
});

export default CardModel;