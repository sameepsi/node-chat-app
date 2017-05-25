var expect = require('expect');
var {generateMessage, generateLocationMessage}= require('./message');

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

describe('generateLocationMessage' , () => {
  it('Should generate the correct location message', () => {
    var from = 'Sameep';
    var latitude = '1234';
    var longitude = '56780';
    var expectedURL = `https://www.google.com/maps?q=${latitude},${longitude}`;

    var res= generateLocationMessage(from, latitude, longitude);

    expect(res).toExist();
    expect(res).toBeA('object');
    expect(res.from).toEqual(from);
    expect(res.url).toEqual(expectedURL);
  });
});
