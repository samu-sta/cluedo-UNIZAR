import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Cuenta from './Cuenta.js';
import Usuario from './Usuario.js';

const Administrador = sequelize.define('Administrador', {
  id_admin: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_cuenta: {
    type: DataTypes.INTEGER,
    unique: true,
    references: {
      model: Cuenta,
      key: 'id_cuenta'
    }
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    unique: true,
    references: {
      model: Usuario,
      key: 'id_usuario'
    }
  }
}, {
  tableName: 'Administrador',
  timestamps: false
});

export default Administrador;