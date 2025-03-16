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
    unique: true
  }
}, {
  tableName: 'Usuario',
  timestamps: false
});

Usuario.belongsTo(Cuenta, { foreignKey: 'idCuenta' });

export default Usuario;