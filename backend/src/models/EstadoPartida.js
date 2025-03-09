import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const EstadoPartida = sequelize.define('EstadoPartida', {
  idEstado: {
    type: DataTypes.ENUM('NO_EMPEZADA', 'EN_JUEGO', 'FINALIZADA'),
    primaryKey: true
  }
}, {
  tableName: 'EstadoPartida',
  timestamps: false
});

export default EstadoPartida;