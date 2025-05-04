/*************************************************
 * Modelo de Usuario de Juego
 * 
 * Este modelo representa a los usuarios del juego,
 * estableciendo la vinculación con su cuenta de acceso
 * y otros datos específicos para la partida.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import AccountModel from './Account.js';

const UserModel = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  accountId: {
    type: DataTypes.INTEGER,
    unique: true,
    references: {
      model: AccountModel,
      key: 'id'
    }
  }
}, {
  tableName: 'User',
  timestamps: false,
  sequelize
});

export default UserModel;