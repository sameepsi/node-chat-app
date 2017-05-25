const expect = require ('expect') ;

const {isRealString}=require('./validation');
describe('isRealString', () => {
  it('Should correctly verify if provided data is string or not', () => {
    var str='My name is sameep singhania';
    var res= isRealString(str);
    expect(res).toBeA('boolean');
    expect(res).toBe(true);
  });

  it('Should correctly verify that the given input is not string', () => {
    var str=1234;
    var res=isRealString(str);
    expect(res).toBeA('boolean');
    expect(res).toBe(false);
  });

  it('Should correctlt verfiy that empty/whitespaces only string are invalid', () => {
    var str='    ';
    var res = isRealString(str);
    expect(res).toBeA('boolean');
    expect(res).toBe(false);
  });
});
