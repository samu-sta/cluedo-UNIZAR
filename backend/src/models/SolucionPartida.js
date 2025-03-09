import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Partida from './Partida.js';
import Carta from './Carta.js';

const SolucionPartida = sequelize.define('SolucionPartida', {
  id_partida: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Partida,
      key: 'id_partida'
    }
  },
  id_carta_arma: {
    type: DataTypes.INTEGER,
    references: {
      model: Carta,
      key: 'id_carta'
    }
  },
  id_carta_personaje: {
    type: DataTypes.INTEGER,
    references: {
      model: Carta,
      key: 'id_carta'
    }
  },
  id_carta_habitacion: {
    type: DataTypes.INTEGER,
    references: {
      model: Carta,
      key: 'id_carta'
    }
  }
}, {
  tableName: 'SolucionPartida',
  timestamps: false
});

export default SolucionPartida;