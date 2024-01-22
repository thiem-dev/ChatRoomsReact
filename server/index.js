const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// middleware
app.use(cors());

// socket.io requires an http server even if express can do it
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

//connection event
io.on('connection', (socket) => {
  console.log(`User Connected ${socket.id}`);

  socket.on('join_room', (data) => {
    socket.join(data.room);
    console.log(`user:${data.name} joined room ${data.room}`);
  });

  // broadcast all active connections
  socket.on('send_message_all', (data) => {
    socket.broadcast.emit('receive_message', data);
    console.log(`user:${data.name} room:${data.room} BROADCAST: ${data.msg}`);
  });

  //message to room only
  socket.on('send_rm_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
    console.log(`user:${data.name} room:${data.room} LOBBY CHAT: ${data.msg}`);
  });
});

server.listen(3000, () => {
  console.log('webserver listening on: 3000');
});
