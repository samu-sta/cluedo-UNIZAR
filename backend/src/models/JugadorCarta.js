import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Jugador from './Jugador.js';
import Carta from './Carta.js';

const JugadorCarta = sequelize.define('JugadorCarta', {
  idJugador: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Jugador,
      key: 'idJugador'
    }
  },
  idCarta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Carta,
      key: 'idCarta'
    }
  }
}, {
  tableName: 'Jugador_Carta',
  timestamps: false
});

export default JugadorCarta;