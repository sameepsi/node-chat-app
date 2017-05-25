var socket = io();
socket.on('connect', function() {
  console.log('Connected to the server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from the server');
});

socket.on('newMessage', function (message) {

  var formattedTime = moment(message.createdAt).format('h:mm a');
  var messageTemplate = $('#messageTemplate').html();
  var html = Mustache.render(messageTemplate,{
    text:message.text,
    from:message.from,
    createdAt:formattedTime
  });
  $('#messageList').append(html);
});

socket.on('newLocationMessage', function (locMessage) {
  var formattedTime = moment(locMessage.createdAt).format('h:mm a');
  var messageTemplate = $('#locationMessageTemplate').html();
  var html = Mustache.render(messageTemplate, {
    from:locMessage.from,
    createdAt:formattedTime,
    url:locMessage.url
  });

  $('#messageList').append(html);
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
