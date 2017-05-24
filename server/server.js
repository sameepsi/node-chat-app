const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newMessage',{
    from:'sameepsi@gmail.com',
    text:'Hey what is going on!',
    createdAt:145362736
  });

  socket.on('createMessage', (email)=>{
    console.log('Create Message', email)
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});



server.listen(port, ()=>{
  console.log(`Server started on port ${port}`);
})
