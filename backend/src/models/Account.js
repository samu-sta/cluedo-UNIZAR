/*************************************************
 * Modelo de Cuenta de Usuario
 * 
 * Este modelo representa la información de las cuentas 
 * de usuarios en el sistema, almacenando datos como 
 * nombre de usuario, correo electrónico y contraseña.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const AccountModel = sequelize.define('Account', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'Account',
  timestamps: false,
  sequelize
});

export default AccountModel;