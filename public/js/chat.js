var socket = io();
var name;
var inFocus = true;
var audio= new Audio("/notifications/notification.mp3");
$(window).on('focus', function(e){
  inFocus = true;
  blinkTitleStop("Chatty");
});

$(window).on('blur', function(e){
  inFocus = false;
  blinkTitleStop("Chatty");
});

function setNotification(text){
  if(!inFocus){
    audio.play();
    blinkTitle(text,"Chatty",1000);
  }
}

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
  if(params===undefined || Object.keys(params).length===0){
    params={};
    params.room=localStorage.room;
    params.name=localStorage.name;
  }
  name = params.name;
  socket.emit('join', params, function (err) {
      if (err) {
        alert(err.reason);
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
  setNotification(message.from);
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
  setNotification(locMessage.from);
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

function getSignedRequest(file){
    socket.emit('initiateFileUpload', {
    fileName: file.name,
    fileType:file.type
  },(data)=>{
    if(data.status==='failure'){
    return  alert('Failed to upload file');
    }
    uploadFile(file, data.data.signedRequest, data.data.url);
  });

}

function generateUniqueId(){
  return new Date().getTime();
}

function checkIfImageFile(fileType){
  var validImageTypes = ["image/gif", "image/jpeg", "image/png"];
if ($.inArray(fileType, validImageTypes) < 0) {
     return false;
}
return true;
}
socket.on("attachmentMessage", function(message){
    var id=generateUniqueId();
    var fileName = message.fileName;
    var fileType = message.fileType;
    var from = message.from;
    var url = message.url;

    var formattedTime = moment().format('h:mm a');
    var html;
    var id = generateUniqueId();
    if(checkIfImageFile(fileType)){
    var style = "background-image: url('"+url+"'); width: 154px; height: 158px;";
    var messageTemplate = $('#imageMessageTemplate').html();
     html = Mustache.render(messageTemplate, {
      from,
      createdAt:formattedTime,
      class:'image-div',
      id,
      style
    });

  }
  else{
    var messageTemplate = $('#otherAttachmentMessageTemplate').html();

      html = Mustache.render(messageTemplate, {
      from,
      createdAt:formattedTime,
      class:'loader-small',
      divStyle:'display:none',

      fileName,
      url,
      id
    });

  }

  $('#messageList').append(html);
  scrollToBottom();
  setNotification(from);
});

function uploadFile(file, signedRequest, url){

  var formattedTime = moment().format('h:mm a');
  var html;
  var id = generateUniqueId();
  if(checkIfImageFile(file.type)){
  var messageTemplate = $('#imageMessageTemplate').html();
   html = Mustache.render(messageTemplate, {
    from:name,
    createdAt:formattedTime,
    class:'loader-large',
    id
  });

}
else{
  var messageTemplate = $('#otherAttachmentMessageTemplate').html();

    html = Mustache.render(messageTemplate, {
    from:name,
    createdAt:formattedTime,
    class:'loader-small',
    pStyle:'display:none',
    id
  });

}

$('#messageList').append(html);
scrollToBottom();

  const xhr = new XMLHttpRequest();
  xhr.open('PUT', signedRequest);
  console.log(signedRequest);
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        console.log(url);
        if(checkIfImageFile(file.type)){
        $(`#${id}`).removeAttr('class');
        var style = "background-image: url('"+url+"'); width: 154px; height: 158px;";
        $(`#${id}`).attr('style', style);
        $(`#${id}`).attr('class', 'image-div');
      }
      else {
        $(`#${id}`).empty();
        $(`#${id}`).append($('<p></p>').append($('<a target="_blank"></a>').attr('href',url).text(file.name)));
      }
        console.log(file.type);
        socket.emit('fileUploadedSuccessfully', {
          url,
          fileName:file.name,
          fileType:file.type
        });

      }
      else{
        alert('Unable to upload file..');
      }
    }
  };
  xhr.send(file);
}

$('#file-input').change(function(e) {
  var file = e.target.files[0];
  if(file == null){
       return alert('No file selected.');
     }
     getSignedRequest(file);
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
