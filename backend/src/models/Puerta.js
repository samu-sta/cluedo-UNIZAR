import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Habitacion from './Habitacion.js';

const Puerta = sequelize.define('Puerta', {
  idPuerta: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  fila: {
    type: DataTypes.INTEGER
  },
  columna: {
    type: DataTypes.INTEGER
  },
  idHabitacion: {
    type: DataTypes.INTEGER,
    references: {
      model: Habitacion,
      key: 'idHabitacion'
    }
  }
}, {
  tableName: 'Puerta',
  timestamps: false
});

export default Puerta;