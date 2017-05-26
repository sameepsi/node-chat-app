const _ = require('lodash');

var array = [
  {
    name:'sameep',
    room:'abc'
  },
  {
    name:'sameep1',
    room:'abc'
  },
  {
    name:'sameep2',
    room:'abc1'
  },
];

console.log(_.uniqBy(array, 'room'));
