import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Cuenta from './Cuenta.js';
import Usuario from './Usuario.js';

const Administrador = sequelize.define('Administrador', {
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
  tableName: 'Administrador',
  timestamps: false
});

export default Administrador;