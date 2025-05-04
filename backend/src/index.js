/*************************************************
 * Punto de Entrada Principal
 * 
 * Este archivo es el punto de entrada principal de
 * la aplicación backend del juego Cluedo, configurando
 * el servidor HTTP/HTTPS, iniciando Socket.IO y conectando
 * con la base de datos.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import app from './app/app.js';
import { Server } from 'socket.io';
import setupSocketServer from './socket/index.js';
import dotenv from 'dotenv';

import { createApp } from './app/app.js';

createApp();

