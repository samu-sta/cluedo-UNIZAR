import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Habitacion from './Habitacion.js';

const Carta = sequelize.define('Carta', {
  id_carta: {
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
  id_habitacion: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Habitacion,
      key: 'id_habitacion'
    }
  }
}, {
  tableName: 'Carta',
  timestamps: false
});

export default Carta;