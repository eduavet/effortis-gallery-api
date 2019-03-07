const path = require('path');
const fs = require('fs');

const db = require('../db');

const Utils = {};
module.exports = Utils;


Utils.add = params => db.pg.none(`
  INSERT INTO images
    (uuid, owner, title, location, is_active)
  VALUES
    ($<uuid>, $<owner>, $<title>, $<location>, TRUE)
`, { ...params })
  .catch(console.error);

Utils.get = owner => db.pg.any(`
  SELECT uuid
  FROM images
  WHERE owner = $1
    AND is_active = TRUE
`, owner)
  .catch(console.error);

Utils.ensureDirectoryExists = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  Utils.ensureDirectoryExists(dirname);
  return fs.mkdirSync(dirname);
};

Utils.update = (uuid, owner, title, location) => db.pg.one(`
  UPDATE images
  SET
    title = $<title>,
    location = $<location>
  WHERE
    uuid = $<uuid> AND
    owner = $<owner> AND
    is_active = TRUE
  RETURNING uuid
`, {
  uuid, owner, title, location,
});

Utils.delete = (uuid, owner) => db.pg.one(`
  UPDATE images
  SET is_active = false
  WHERE
    uuid = $<uuid> AND
    owner = $<owner> AND
    is_active = TRUE
  RETURNING uuid
`, { uuid, owner });
