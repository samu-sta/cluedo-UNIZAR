import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Jugador from './Jugador.js';

const PosicionJugador = sequelize.define('PosicionJugador', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Jugador,
      key: 'id'
    }
  },
  row: {
    type: DataTypes.INTEGER
  },
  colum: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'PosicionJugador',
  timestamps: false
});

export default PosicionJugador;