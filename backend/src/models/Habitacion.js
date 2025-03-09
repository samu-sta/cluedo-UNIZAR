import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Tablero from './Tablero.js';

const Habitacion = sequelize.define('Habitacion', {
  idHabitacion: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  idTablero: {
    type: DataTypes.INTEGER,
    references: {
      model: Tablero,
      key: 'idTablero'
    }
  }
}, {
  tableName: 'Habitacion',
  timestamps: false
});

export default Habitacion;