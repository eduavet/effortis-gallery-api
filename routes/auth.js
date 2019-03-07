const Joi = require('joi');

const Auth = require('../handlers/auth');
const joiReusables = require('../utils/joiReusables');

const routes = [];

routes.push({
  method: 'GET',
  path: '/auth/user',
  config: {
    auth: {
      strategies: ['session'],
    },
    handler: Auth.user,
    description: 'Auth User',
    tags: ['api', 'auth'],
    response: joiReusables.user,
  },
});

routes.push({
  method: 'POST',
  path: '/auth/login',
  config: {
    auth: {
      mode: 'try',
    },
    validate: {
      payload: {
        username: Joi.string().required(),
        password: Joi.string().required(),
      },
      failAction: joiReusables.failAction,
    },
    response: joiReusables.user,
    description: 'Auth Login',
    tags: ['api', 'auth'],
    handler: Auth.login,
  },
});

routes.push({
  method: 'POST',
  path: '/auth/register',
  config: {
    auth: false,
    validate: {
      payload: Joi.object({
        username: Joi.string().required(),
        password: joiReusables.password,
      }),
      failAction: joiReusables.failAction,
    },
    response: joiReusables.message,
    description: 'Auth Register',
    tags: ['api', 'auth'],
    handler: Auth.register,
  },
});

routes.push({
  method: 'GET',
  path: '/auth/logout',
  config: {
    auth: {
      mode: 'try',
    },
    description: 'Auth Logout',
    tags: ['api', 'auth'],
    handler: Auth.logout,
  },
});

module.exports = routes;
