import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Tablero from './Tablero.js';

const Partida = sequelize.define('Partida', {
  idPartida: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('NO_EMPEZADA', 'EN_JUEGO', 'FINALIZADA'),
    defaultValue: 'NO_EMPEZADA'
  },
  turno: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  idTablero: {
    type: DataTypes.INTEGER,
    references: {
      model: Tablero,
      key: 'idTablero'
    }
  }
}, {
  tableName: 'Partida',
  timestamps: false
});

export default Partida;