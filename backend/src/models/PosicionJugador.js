import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Jugador from './Jugador.js';

const PosicionJugador = sequelize.define('PosicionJugador', {
  id_jugador: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Jugador,
      key: 'id_jugador'
    }
  },
  fila: {
    type: DataTypes.INTEGER
  },
  columna: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'PosicionJugador',
  timestamps: false
});

export default PosicionJugador;