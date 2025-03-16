import { io } from 'socket.io-client';

let socket = null;

export const initSocket = (socketToken) => {

  if (socket) {
    closeSocket();
  }

  socket = io('http://localhost:3000', {
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
    console.log('Conexión socket cerrada');
  }
};