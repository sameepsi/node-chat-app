var socket = io();

function scrollToBottom() {
  //selectors
  var messages = $('#messageList');
  var newMessage = messages.children('li:last-child');
  //heights
  var scrollHeight = messages.prop('scrollHeight');
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(scrollTop+clientHeight+newMessageHeight+lastMessageHeight >= scrollHeight){
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function() {
  console.log('Connected to the server');
  var params = $.deparam(window.location.search);

  socket.emit('join', params, function (err) {
      if (err) {
        alert(err);
        window.location.href = '/';
      }else {

      }
  });
});

socket.on('disconnect', function () {
  console.log('Disconnected from the server');
});

socket.on('updateUserList', function (users) {

    var ol = $('<ol></ol>');

    users.forEach((user) => {
      ol.append($('<li></li>').text(user));
    });
    $('#users').html(ol);
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
  scrollToBottom();
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
  scrollToBottom();
});

$('#message-form').on('submit', function(e){
  e.preventDefault();
  var messageTextBox=$('[name=message]');
  socket.emit('createMessage', {
      text:messageTextBox.val()
  }, function(ack){
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
      }, function(ack){
        if(ack.status==='failure'){
          alert('Failed to send location');
        }
      });
      locButton.removeAttr('disabled');
      locButton.text('Send location');
  }, function(err){
    locButton.removeAttr('disabled');
    locButton.text('Send location');
    alert('Failed to fetch location');
  });
});

//Make chat room case-insensitive
//Make user names unique
//List of active chat rooms
//Chatting in multiple rooms at the same time










//
