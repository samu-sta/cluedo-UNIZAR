import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idCuenta: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false
  }
}, {
  tableName: 'Usuario',
  timestamps: false
});

export default Usuario;