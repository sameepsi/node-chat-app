const expect = require('expect');

const {Users} = require('./users')

describe('addUser', () => {
  it('Should return valid user', () => {
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
});
