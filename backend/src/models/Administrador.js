import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import CuentaModel from './Cuenta.js';

const Administrador = sequelize.define('Administrador', {
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
  tableName: 'Administrador',
  timestamps: false
});

Administrador.belongsTo(CuentaModel, { foreignKey: 'idCuenta' });

export default Administrador;