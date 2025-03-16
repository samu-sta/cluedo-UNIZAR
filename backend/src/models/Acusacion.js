import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Jugador from './Jugador.js';
import Carta from './Carta.js';

const Acusacion = sequelize.define('Acusacion', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idJugador: {
    type: DataTypes.INTEGER,
    references: {
      model: Jugador,
      key: 'id'
    }
  },
  idCartaarma: {
    type: DataTypes.INTEGER,
    references: {
      model: Carta,
      key: 'idCarta'
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
  },
  final: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Acusacion',
  timestamps: false
});

export default Acusacion;