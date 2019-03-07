const Boom = require('boom');
const crypto = require('crypto');

const Utils = require('../utils/authUtils.js');
const MESSAGE = require('../utils/message.js');

const Auth = {};
module.exports = Auth;

Auth.register = (req) => {
  let user;
  let userAccount;

  return Utils.usernameExists(req.payload.username)
    .then((exists) => {
      if (exists) throw Boom.conflict(MESSAGE.USERNAME_EXISTS);
      user = req.payload;
    })
    .then(() => Utils.generateHash(req.payload.password))
    .then((hash) => {
      user.password = hash;
      user.userToken = crypto.randomBytes(32).toString('hex');
      return Utils.userCreate(user);
    })
    .then(() => Utils.userFindByUsername(req.payload.username))
    .then((account) => {
      if (account === null) throw Boom.unauthorized(MESSAGE.WRONG_COMBINATION);
      userAccount = account;
    })
    .then(() => crypto.randomBytes(32).toString('hex'))
    .then(async (sid) => {
      await req.server.app.cache.set(sid, { account: userAccount }, 0);
      req.cookieAuth.set({ sid });
      return { message: MESSAGE.SIGNUP_SUCCESS };
    })
    .catch((e) => {
      switch (e.message || e) {
        case MESSAGE.USERNAME_EXISTS:
          return Boom.conflict(MESSAGE.USERNAME_EXISTS);
        default:
          console.error('Auth.register', e, e.stack);
          return Boom.internal();
      }
    });
};

Auth.login = (req) => {
  let userAccount;
  return Utils.userFindByUsername(req.payload.username)
    .then((user) => {
      if (user === null) throw Boom.unauthorized(MESSAGE.WRONG_COMBINATION);
      userAccount = user;
    })
    .then(() => Utils.passwordCompare(userAccount.password, req.payload.password))
    .then((correct) => { if (!correct) throw Boom.unauthorized(MESSAGE.WRONG_COMBINATION); })
    .then(() => crypto.randomBytes(32).toString('hex'))
    .then(async (sid) => {
      await req.server.app.cache.set(sid, { account: userAccount }, 0);
      req.cookieAuth.set({ sid });
      delete userAccount.password;
      return userAccount;
    })
    .catch((e) => {
      switch (e.message || e) {
        case MESSAGE.WRONG_COMBINATION:
          return Boom.unauthorized(MESSAGE.WRONG_COMBINATION);
        default:
          console.error('Auth.login', e, e.stack);
          return Boom.internal();
      }
    });
};

Auth.user = (req) => {
  const { credentials } = req.auth;
  return Utils.userFindByUsername(credentials.username)
    .then((res) => {
      const user = res;
      delete user.password;
      return user;
    })
    .catch((e) => {
      console.error('Auth.user', e, e.stack);
      return Boom.internal();
    });
};

Auth.logout = (req, h) => h.response({ message: MESSAGE.LOGGED_OUT }).unstate('session');
