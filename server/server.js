const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  //welcome to the chat app
  socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app, You are now connected!!'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user- Sameep joined'));
  //socket.broadcast.emit from admin text new user joined


  socket.on('createMessage', (message, callback)=>{
    console.log('Create Message', message)
    //emits an event to every single connection
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback({
      status:'success'
    });
    //it will fire event to all but this particular socket
    // socket.broadcast.emit('newMessage', {
    //   from:message.from,
    //   text:message.text,
    //   createdAt:new Date().getTime()
    // });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});



server.listen(port, ()=>{
  console.log(`Server started on port ${port}`);
})
