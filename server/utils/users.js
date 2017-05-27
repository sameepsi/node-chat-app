// [{
//   id:'socket_id',
//   name:'username',
//   room:'roomname'
// }]
const _ = require('lodash');

class Users {
  constructor () {
    this.users=[];
  }

  addUser(id, name, room){
    var user={id, name, room};
    this.users.push(user);
    return user;
  }

  getUser(id) {
    var user = _.find(this.users, (user) => {
        return user.id===id;
    });
    return user;
  }


  removeUser(id) {
    var user = this.getUser(id);
    if(user){
        this.users = this.users.filter((user) => {
          return user.id!==id;
        });
    }

    return user;
  }


  getUserList(room) {
    var users = this.users.filter((user) => {
        return user.room===room;
    });
    var namesArray = users.map((user) => {
      return user.name;
    });
    return namesArray;
  }

  // Will return list of all currently available rooms
  getAllRooms() {
    var users = _.uniqBy(this.users, 'room');
    var roomNames = users.map((user) => {
      return user.room;
    });
    return roomNames;
  }

  checkIfRoomEmpyt(room) {
    var users = this.users.filter((user) => {
        return user.room===room;
    });
    console.log(users);
    if(Object.keys(users).length>0){
      return false;
    }
    return true;
  }


  //this method will check if user already exists. It will return boolean
  userExists(name) {
    var user = _.find(this.users, (user) => {
        return user.name===name;
    });
    if(user){
      return true;
    }
    return false;
  }
  //Will return array of rooms which user has joined or currently part of
  getUserRooms(user) {

  }
}

module.exports={Users};
