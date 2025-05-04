/**
 * @fileoverview Servicio para la gestión de conexiones vía WebSocket
 * @author Samuel Felipe
 */

import { io } from 'socket.io-client';

import { API_URL } from "../utils/constants";

let socket = null;
let currentGameId = null;

export const initSocket = (socketToken) => {
  const tokenData = JSON.parse(atob(socketToken.split('.')[1]));
  const gameId = tokenData.gameId;

  if (socket && currentGameId === gameId) {
    return socket;
  }

  if (socket) {
    closeSocket();
  }

  currentGameId = gameId;

  socket = io(`${API_URL}`, {
    auth: { token: socketToken },
    autoConnect: true,
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });

  socket.on('connect_error', (error) => {
    console.error('Error de conexión socket:', error.message);
  });

  socket.on('disconnect', (reason) => {

    if (reason === 'io server disconnect') {
      socket.connect();
    }
  });

  return socket;
};

export const getSocket = () => socket;

export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentGameId = null;
  }
};