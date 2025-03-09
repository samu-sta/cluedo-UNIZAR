import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Habitacion from './Habitacion.js';

const Carta = sequelize.define('Carta', {
  idCarta: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  tipo: {
    type: DataTypes.ENUM('arma', 'personaje', 'habitacion'),
    allowNull: false
  },
  idHabitacion: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Habitacion,
      key: 'idHabitacion'
    }
  }
}, {
  tableName: 'Carta',
  timestamps: false
});

export default Carta;