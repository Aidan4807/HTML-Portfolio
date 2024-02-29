// app.js

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const messages = [];

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send existing messages to the new user
  socket.emit('loadMessages', messages);

  // Listen for new messages from clients
  socket.on('postMessage', (message) => {
    messages.push(message);
    // Broadcast the new message to all connected clients
    io.emit('updateMessages', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
