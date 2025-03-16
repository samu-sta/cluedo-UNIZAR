import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Jugador from './Jugador.js';
import Carta from './Carta.js';

const JugadorCarta = sequelize.define('JugadorCarta', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Jugador,
      key: 'id'
    }
  },
  idCarta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Carta,
      key: 'id'
    }
  }
}, {
  tableName: 'Jugador_Carta',
  timestamps: false
});

export default JugadorCarta;