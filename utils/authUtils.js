const bcrypt = require('bcrypt-nodejs');
const Promise = require('promise');

const db = require('../db');

const bcryptGenSalt = Promise.denodeify(bcrypt.genSalt);
const bcryptHash = Promise.denodeify(bcrypt.hash, 3);
const bcryptCompare = Promise.denodeify(bcrypt.compare);

const SALT_FACTOR = 5;

const Utils = {};
module.exports = Utils;

Utils.generateHash = password => bcryptGenSalt(SALT_FACTOR)
  .then(salt => bcryptHash(password, salt))
  .catch(console.error);

Utils.passwordCompare = (password, testPassword) => bcryptCompare(testPassword, password)
  .catch(console.error);

Utils.userCreate = user => db.pg.one(`
  INSERT INTO users
    (username, password)
  VALUES
    ($<username>, $<password>)
  RETURNING
    username
  `, user)
  .catch(console.error);

Utils.userFindByUsername = username => db.pg.oneOrNone(`
  SELECT
    uuid, username, password
  FROM users
  WHERE username = $1
  LIMIT 1
  `, username)
  .then(result => (result === null ? null : result))
  .catch(console.error);

Utils.usernameExists = username => db.pg.any(`
  SELECT uuid
  FROM users
  WHERE username = $1
`, username)
  .then((rows) => {
    if (rows.length > 0) return true;
    return false;
  })
  .catch(console.error);
