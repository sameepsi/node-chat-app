var socket = io();
socket.on('connect', function() {
  console.log('Connected to the server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from the server');
});

socket.on('newMessage', function (message) {

  console.log('New Message', message);

  var li = $('<li></li>');
  li.text(`${message.from}: ${message.text}`)

  $('#messageList').append(li);
});


$('#message-form').on('submit', function(e){
  e.preventDefault();

  socket.emit('createMessage', {
    from:'Sameep',
    text:$('[name=message]').val()
  }, function(){

  });

});
