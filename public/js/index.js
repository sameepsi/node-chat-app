var socket = io();
socket.on('connect', function() {
  console.log('Connected to the server');

  socket.emit('createMessage', {
    from:'sameepsi@gmail.com',
    text:'hey I am doing good!!'
  });
});

socket.on('disconnect', function () {
  console.log('Disconnected from the server');
});

socket.on('newMessage', function (data) {
  console.log('New Message', data);
});
