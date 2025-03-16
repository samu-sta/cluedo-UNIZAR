import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Cuenta from './Cuenta.js';

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idCuenta: {
    type: DataTypes.INTEGER,
    unique: true,
    references: {
      model: Cuenta,
      key: 'id'
    }
  }
}, {
  tableName: 'Usuario',
  timestamps: false
});

export default Usuario;