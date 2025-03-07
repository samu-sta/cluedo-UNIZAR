export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.username} (${socket.userId})`);

    socket.join(socket.gameId);

    io.to(socket.gameId).emit('playerJoined', {
      username: socket.username
    });

    const players = [];
    const socketsInRoom = io.sockets.adapter.rooms.get(socket.gameId) || new Set();

    for (const socketId of socketsInRoom) {
      const playerSocket = io.sockets.sockets.get(socketId);
      if (playerSocket) {
        players.push({
          username: playerSocket.username
        });
      }
    }

    socket.emit('playerList', { players });

    socket.on('disconnect', () => {
      console.log(`Usuario desconectado: ${socket.username}`);
      io.to(socket.gameId).emit('playerLeft', {
        username: socket.username
      });
    });

  });
};