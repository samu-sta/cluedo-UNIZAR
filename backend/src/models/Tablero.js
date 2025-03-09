import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const Tablero = sequelize.define('Tablero', {
  id_tablero: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  filas: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  columnas: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Tablero',
  timestamps: false
});

export default Tablero;