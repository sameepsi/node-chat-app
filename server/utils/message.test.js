var expect = require('expect');
var {generateMessage}= require('./message');

describe('generateMessage', ()=>{
  it('Should generate the correct message object', () => {
    var from = 'Sameep';
    var text = 'Welcome to the chat app';
    var res = generateMessage(from, text);
    expect(res).toExist();
    expect(res).toBeA('object');
    expect(res.from).toEqual(from);
    expect(res.text).toEqual(text);

  });
});
