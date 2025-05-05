/*************************************************
 * Configuración principal de la aplicación
 * 
 * Inicializa y configura la aplicación Express,
 * estableciendo middleware, rutas, y servicios
 * necesarios para el funcionamiento del backend.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { UserRoutes } from '../routes/User.Routes.js';
import { GameRoutes } from '../routes/Game.Routes.js';
import cors from 'cors';
import http from 'http';
import { configureSocket } from '../socket/index.js';
import setupRelations from '../models/relations.js';
const DEFAULT_PORT = 3000;

dotenv.config();
const PORT = process.env.PORT || DEFAULT_PORT;

export const createApp = () => {
  setupRelations();
  const app = express();
  const server = http.createServer(app);

  configureSocket(server);

  app.use(morgan('dev'));
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(express.json());
  app.use(cookieParser());

  app.use('/api/user', UserRoutes());
  app.use('/api/game', GameRoutes());

  app.get('/', (req, res) => {
    res.send('Hello World');
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  return app;
};