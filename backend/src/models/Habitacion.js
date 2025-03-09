import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Tablero from './Tablero.js';

const Habitacion = sequelize.define('Habitacion', {
  id_habitacion: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  id_tablero: {
    type: DataTypes.INTEGER,
    references: {
      model: Tablero,
      key: 'id_tablero'
    }
  }
}, {
  tableName: 'Habitacion',
  timestamps: false
});

export default Habitacion;