import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Jugador from './Jugador.js';
import Carta from './Carta.js';

const JugadorCarta = sequelize.define('JugadorCarta', {
  id_jugador: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Jugador,
      key: 'id_jugador'
    }
  },
  id_carta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Carta,
      key: 'id_carta'
    }
  }
}, {
  tableName: 'Jugador_Carta',
  timestamps: false
});

export default JugadorCarta;