const expect = require('expect');

const {Users} = require('./users')



describe('Users test cases', () => {
  var users;
  beforeEach(() => {
    users = new Users();
    users.users = [{
      id:'1',
      name:'sameep',
      room:'node course',
    },{
      id:'2',
      name:'prateek',
      room:'react course',
    },{
      id:'3',
      name:'jagdeep',
      room:'node course',
    }];
  });

  it('Should add new user', () => {
    var user= new Users();
    var res=user.addUser('123', 'sameep', 'node');

    expect(res).toBeA('object');
    expect(res).toInclude({
      id:'123',
      name:'sameep',
      room:'node'
    });
    expect(user.users).toEqual([{
      id:'123',
      name:'sameep',
      room:'node'
    }])
  });

  it('Should return names for users in node course', () => {
    var userList = users.getUserList('node course');
    expect(userList).toEqual(['sameep','jagdeep']);
  });

  it('Should return user with id 1', () => {
    var res = users.getUser('1');
    expect(res).toInclude({
      id:'1'
    });
  });

  it('Should remove user with id 1', ()=>{
    var res = users.removeUser('1');
    expect(res).toInclude({
      id:'1'
    });
    expect(users.users.length).toEqual(2)
  });

});
