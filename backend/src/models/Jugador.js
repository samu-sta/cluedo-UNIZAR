import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Usuario from './Usuario.js';
import Partida from './Partida.js';

const Jugador = sequelize.define('Jugador', {
  id_jugador: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario,
      key: 'id_usuario'
    }
  },
  id_partida: {
    type: DataTypes.INTEGER,
    references: {
      model: Partida,
      key: 'id_partida'
    }
  },
  id_estado: {
    type: DataTypes.ENUM('JUGANDO', 'EXPULSADO_POR_ACUSACION', 'EXPULSADO_POR_ADMIN'),
    defaultValue: 'JUGANDO'
  }
}, {
  tableName: 'Jugador',
  timestamps: false
});

export default Jugador;