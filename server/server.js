const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const{isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  //welcome to the chat app

  //socket.broadcast.emit from admin text new user joined

  socket.on('join', (params, callback) => {
    var name = params.name;
    var room = params.room;
    console.log(name,room);
    if(!isRealString(name) || !isRealString(room)){
      return callback('Name and room name are required');
    }

      //io.emit -> io.to(room).emit
      //socket.broadcast.emit -> socket.braodcast.to(room).emit
      //socket.emit

      socket.join(room);

      users.removeUser(socket.id);
      users.addUser(socket.id, name, room);

      io.to(room).emit('updateUserList', users.getUserList(room));
      socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app, You are now connected!!'));
      socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `New user- ${name} joined`));
      callback();

  });

  socket.on('createMessage', (message, callback)=>{
    console.log('Create Message', message)
    //emits an event to every single connection
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback({status:'success'});
  });

  socket.on('createLocationMessage', (coords) => {
      io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if(user){
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} left the room`));
    }
  });
});



server.listen(port, ()=>{
  console.log(`Server started on port ${port}`);
})
