const fs = require('fs');
const uuidv4 = require('uuid/v4');
const Boom = require('boom');

const Utils = require('../utils/imageUtils.js');
const MESSAGE = require('../utils/message.js');

const Images = {};
module.exports = Images;

Images.add = req => new Promise((resolve, reject) => {
  const uuid = uuidv4();
  const {
    title, location, file, owner,
  } = req.payload;
  const path = `./uploads/${owner}/${uuid}.png`;
  Utils.ensureDirectoryExists(path);

  fs.writeFile(path, file, (err) => {
    if (err) {
      reject(err);
    }
    resolve({ message: MESSAGE.IMAGE_UPLOADED });
    return Utils.add({
      uuid, owner, title, location,
    })
      .catch(console.error);
  });
});

Images.get = (req) => {
  const { owner } = req.query;
  return Utils.get(owner)
    .then(images => images.map(image => ({
      uuid: image.uuid,
      path: `/uploads/${owner}/${image.uuid}.png`,
    })));
};

Images.update = (req) => {
  const {
    owner, uuid, title, location,
  } = req.payload;
  return Utils.update(uuid, owner, title, location)
    .then(() => ({ message: MESSAGE.IMAGE_UPDATED }))
    .catch((e) => {
      switch (e.message || e) {
        case 'No data returned from the query.':
          return Boom.notFound(MESSAGE.IMAGE_NOT_FOUND);
        default:
          console.error('Images.update', e);
          return Boom.internal();
      }
    });
};

Images.delete = (req) => {
  const { owner, uuid } = req.payload;
  return Utils.delete(uuid, owner)
    .then(console.log)
    .then(() => ({ message: MESSAGE.IMAGE_DELETED }))
    .catch((e) => {
      switch (e.message || e) {
        case 'No data returned from the query.':
          return Boom.notFound(MESSAGE.IMAGE_NOT_FOUND);
        default:
          console.error('Images.delete', e);
          return Boom.internal();
      }
    });
};
