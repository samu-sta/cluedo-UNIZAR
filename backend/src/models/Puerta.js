import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Habitacion from './Habitacion.js';

const Puerta = sequelize.define('Puerta', {
  id_puerta: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  fila: {
    type: DataTypes.INTEGER
  },
  columna: {
    type: DataTypes.INTEGER
  },
  id_habitacion: {
    type: DataTypes.INTEGER,
    references: {
      model: Habitacion,
      key: 'id_habitacion'
    }
  }
}, {
  tableName: 'Puerta',
  timestamps: false
});

export default Puerta;