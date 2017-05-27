const moment = require('moment');

var generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: moment.valueOf()
  };
};

var generateLocationMessage = (from, latitude, longitude) => {
  var url = `https://www.google.com/maps?q=${latitude},${longitude}`

  return {
    from,
    url,
    createAt: moment.valueOf()
  };
};

var generateAttachmentMessage = (from, fileName, fileType, url) => {
  return {
    from,
    fileName,
    fileType,
    url
  };
};
module.exports = {generateMessage, generateLocationMessage, generateAttachmentMessage};
