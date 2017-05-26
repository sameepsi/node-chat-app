function getAllRooms () {
  $.ajax({
    url:'/chat/rooms',
    type:'GET',
    success: function(data){
      var availableRooms = $('#availableRooms');
      availableRooms.on('change', roomSelected);
      data.forEach((room) => {
        var option = $('<option></option>');
        option.attr('value', room).text(room);
        availableRooms.append(option);
      });
    },
    error: function(err){
      console.log(err);
    }
  });
}

function roomSelected() {
  $('input[name=room]').val(this.value);
  console.log(this.value);
}
