import sequelize from './database.js';
import { Sequelize } from 'sequelize';
import EstadoPartida from '../models/EstadoPartida.js';
import Cuenta from '../models/Cuenta.js';
import Usuario from '../models/Usuario.js';
import Administrador from '../models/Administrador.js';
import Tablero from '../models/Tablero.js';
import Habitacion from '../models/Habitacion.js';
import Puerta from '../models/Puerta.js';
import Carta from '../models/Carta.js';
import Partida from '../models/Partida.js';
import SolucionPartida from '../models/SolucionPartida.js';
import Jugador from '../models/Jugador.js';
import PosicionJugador from '../models/PosicionJugador.js';
import JugadorCarta from '../models/JugadorCarta.js';
import Acusacion from '../models/Acusacion.js';

const initDatabase = async () => {
  try {
    const tempSequelize = new Sequelize({
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      dialect: 'mysql'
    });

    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await EstadoPartida.sync();
    await Cuenta.sync();
    await Usuario.sync();
    await Administrador.sync();
    await Tablero.sync();
    await Habitacion.sync();
    await Puerta.sync();
    await Carta.sync();
    await Partida.sync();
    await SolucionPartida.sync();
    await Jugador.sync();
    await PosicionJugador.sync();
    await JugadorCarta.sync();
    await Acusacion.sync();

    await sequelize.sync({ force: true });
    console.log('Database initialized successfully');

  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

initDatabase();