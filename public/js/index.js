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

socket.on('newLocationMessage', function (locMessage) {
  var li = $('<li></li>');
  var a=$('<a target="_blank">My current location</a>');

  li.text(`${locMessage.from}: `)
  a.attr('href',locMessage.url);
  li.append(a);
  $('#messageList').append(li);
});

$('#message-form').on('submit', function(e){
  e.preventDefault();
  var messageTextBox=$('[name=message]');
  socket.emit('createMessage', {
    from:'Sameep',
    text:messageTextBox.val()
  }, function(){
      messageTextBox.val('');
  });
});

var locButton = $('#sendLocation');
locButton.on('click', function (e) {

  if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser!!');
  }
  locButton.attr('disabled', 'disabled');
  locButton.text('Sending location...');
  navigator.geolocation.getCurrentPosition(function (location){
      console.log(location);
      socket.emit('createLocationMessage', {
        latitude: location.coords.latitude,
        longitude:location.coords.longitude
      });
      locButton.removeAttr('disabled');
      locButton.text('Send location');
  }, function(err){
    locButton.removeAttr('disabled');
    locButton.text('Send location');
    alert('Failed to fetch location');
  });
});
