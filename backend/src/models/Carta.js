import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Habitacion from './Habitacion.js';

const Carta = sequelize.define('Carta', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('arma', 'personaje', 'habitacion'),
    allowNull: false
  },
  idHabitacion: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Habitacion,
      key: 'id'
    }
  }
}, {
  tableName: 'Carta',
  timestamps: false
});

export default Carta;