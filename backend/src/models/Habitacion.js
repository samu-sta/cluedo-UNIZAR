import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Tablero from './Tablero.js';

const Habitacion = sequelize.define('Habitacion', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  idTablero: {
    type: DataTypes.INTEGER,
    references: {
      model: Tablero,
      key: 'id'
    }
  }
}, {
  tableName: 'Habitacion',
  timestamps: false
});

export default Habitacion;