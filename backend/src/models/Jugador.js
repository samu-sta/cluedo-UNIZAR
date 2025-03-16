import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Usuario from './Usuario.js';
import Partida from './Partida.js';

const Jugador = sequelize.define('Jugador', {
  idUsuario: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario,
      key: 'id'
    }
  },
  idPartida: {
    type: DataTypes.INTEGER,
    references: {
      model: Partida,
      key: 'id'
    }
  },
  turn: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  playerState: {
    type: DataTypes.ENUM('JUGANDO', 'EXPULSADO_POR_ACUSACION', 'EXPULSADO_POR_ADMIN'),
    defaultValue: 'JUGANDO'
  }
}, {
  tableName: 'Jugador',
  timestamps: false
});

export default Jugador;