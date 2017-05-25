//Jan 1st 1970 00:00:00 is our epic..

const moment = require('moment');

var createdAt= 1234;
var date = moment(createdAt);
// date.add(100,'year').subtract(9,'months');
// console.log(date.format('MMM Do, YYYY'));
console.log(date.format('h:mm a'));
//
