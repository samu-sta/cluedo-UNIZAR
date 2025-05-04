/*************************************************
 * Inicialización de la base de datos
 * 
 * Este archivo se encarga de inicializar la base de
 * datos, recreando las tablas y añadiendo los datos
 * iniciales necesarios para el juego.
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