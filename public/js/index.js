
if(typeof(Storage) !=='undefined'){
  localStorage.removeItem("name");
  localStorage.removeItem("room");
}

function isValidString(str){
  return typeof str==='string' && str.trim().length > 0;
}

function submitForm() {
  var name = $('#name').val();
  var room = $('#room').val();
  if(isValidString(name) && isValidString(room)){
    if (typeof(Storage) !== "undefined") {
    localStorage.setItem('name', name);
    localStorage.setItem('room', room);
    window.location.href='/chat.html';
} else {
    window.location.href='/chat.html?name='+name+'&room='+room;
}
  }
  else{
    alert('Please enter valid name and room!!');
  }
}
function getAllRooms () {
  $.ajax({
    url:'/chat/rooms',
    type:'GET',
    success: function(data){
      var availableRooms = $('#availableRooms');
      availableRooms.on('change', roomSelected(this.value));
      data.forEach((room) => {

        var option = $('<option></option>');
        option.attr('value', room).text(room);
        availableRooms.append(option);
        if(data[0]===room){

          roomSelected(room);
        }
      });

    },
    error: function(err){
      console.log(err);
    }
  });
}

function roomSelected(room) {
  $('input[name=room]').val(room);
}
