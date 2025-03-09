import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Cuenta from './Cuenta.js';

const Usuario = sequelize.define('Usuario', {
  id_usuario: {
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
  }
}, {
  tableName: 'Usuario',
  timestamps: false
});

export default Usuario;