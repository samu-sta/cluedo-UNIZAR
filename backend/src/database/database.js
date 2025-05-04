/*************************************************
 * Configuración de Base de Datos
 * 
 * Este archivo configura la conexión con la base de datos
 * utilizando Sequelize para gestionar la comunicación con
 * MySQL. Carga las variables de entorno necesarias para
 * la conexión.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialect: 'mysql',
  logging: false
});

export default sequelize;