import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Habitacion from './Habitacion.js';

const Puerta = sequelize.define('Puerta', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  row: {
    type: DataTypes.INTEGER
  },
  colum: {
    type: DataTypes.INTEGER
  },
  idHabitacion: {
    type: DataTypes.INTEGER,
    references: {
      model: Habitacion,
      key: 'id'
    }
  }
}, {
  tableName: 'Puerta',
  timestamps: false
});

export default Puerta;