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
