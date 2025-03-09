import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Jugador from './Jugador.js';
import Carta from './Carta.js';

const Acusacion = sequelize.define('Acusacion', {
  id_acusacion: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_jugador: {
    type: DataTypes.INTEGER,
    references: {
      model: Jugador,
      key: 'id_jugador'
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
  },
  final: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Acusacion',
  timestamps: false
});

export default Acusacion;