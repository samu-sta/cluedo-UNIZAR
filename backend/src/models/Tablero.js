import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const Tablero = sequelize.define('Tablero', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  row: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  colum: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Tablero',
  timestamps: false
});

export default Tablero;