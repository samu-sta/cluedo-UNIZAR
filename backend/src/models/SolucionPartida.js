import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Partida from './Partida.js';
import Carta from './Carta.js';

const SolucionPartida = sequelize.define('SolucionPartida', {
  idPartida: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Partida,
      key: 'id'
    }
  },
  idCartaarma: {
    type: DataTypes.INTEGER,
    references: {
      model: Carta,
      key: 'id'
    }
  },
  idCartapersonaje: {
    type: DataTypes.INTEGER,
    references: {
      model: Carta,
      key: 'id'
    }
  },
  idCartahabitacion: {
    type: DataTypes.INTEGER,
    references: {
      model: Carta,
      key: 'id'
    }
  }
}, {
  tableName: 'SolucionPartida',
  timestamps: false
});

export default SolucionPartida;