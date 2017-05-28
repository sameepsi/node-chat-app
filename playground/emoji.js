var md = require('markdown-it')();
var emoji = require('markdown-it-emoji');
var twemoji = require('twemoji');
// Or for light version
// var emoji = require('markdown-it-emoji/light');

md.use(emoji);
md.renderer.rules.emoji = function(token, idx) {
  return twemoji.parse(token[idx].content);
};
console.log(md.render('I love you :)'));
