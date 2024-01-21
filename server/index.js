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

  socket.on('send_message', (data) => {
    socket.broadcast.emit('receive_message', data);
  });
});

server.listen(3000, () => {
  console.log('webserver listening on: 3000');
});
