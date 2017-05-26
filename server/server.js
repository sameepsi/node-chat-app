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

app.get('/chat/rooms', (req, res) => {
  res.send(users.getAllRooms());
});

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
    var upperCaseRoom = room.toUpperCase();

    var userExists = users.userExists(name);
    if(userExists){
      return callback({status:'failure', reason:'User already exists'});
    }
      //io.emit -> io.to(room).emit
      //socket.broadcast.emit -> socket.braodcast.to(room).emit
      //socket.emit

      socket.join(upperCaseRoom);

      users.removeUser(socket.id);
      users.addUser(socket.id, name, upperCaseRoom);

      io.to(upperCaseRoom).emit('updateUserList', users.getUserList(upperCaseRoom));
      socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app, You are now connected!!'));
      socket.broadcast.to(upperCaseRoom).emit('newMessage', generateMessage('Admin', `New user- ${name} joined`));

      callback();

  });

  socket.on('createMessage', (message, callback)=>{
    //emits an event to every single connection
    var user = users.getUser(socket.id);
    if(user && isRealString(message.text)){
    io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    return callback({status:'success'});
  }
  callback({status:'failure', reason:'Enter valid text'});
  });

  socket.on('createLocationMessage', (coords, callback) => {
    var user = users.getUser(socket.id);
    if(user){
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
      return callback({
        status:'success'
      });
    }
    callback({
    });
      status:'failure'

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
