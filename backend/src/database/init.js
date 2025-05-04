/*************************************************
 * Inicialización de la Base de Datos
 * 
 * Este archivo se encarga de inicializar la base de datos
 * del juego Cluedo, eliminando y recreando la base de datos
 * completa, estableciendo las relaciones entre modelos e
 * inicializando los datos de juego necesarios.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import { Sequelize } from 'sequelize';
import setupRelations from '../models/relations.js';
import sequelize from './database.js';
import { initGame } from './initGame.js';

const initDatabase = async () => {
  try {
    const tempSequelize = new Sequelize({
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      dialect: 'mysql'
    });

    await tempSequelize.query(`DROP DATABASE IF EXISTS \`${process.env.DB_NAME}\`;`);
    await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    await tempSequelize.close();
    console.log('Connection has been established successfully.');

    await sequelize.sync({ force: true });
    setupRelations();
    await initGame();

    console.log('Database initialized successfully');

  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

initDatabase();