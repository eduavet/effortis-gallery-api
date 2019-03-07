const Joi = require('joi');
const Boom = require('boom');

const joiReusables = {};
module.exports = joiReusables;

joiReusables.token = Joi.string().regex(/\b\w{40}\b/).required();

joiReusables.password = Joi.string().min(8).max(64).required()
  .description('Password');

joiReusables.failAction = async (request, h, err) => Boom.badRequest(err.details[0].message);

joiReusables.message = {
  schema: {
    message: Joi.string().required(),
  },
  failAction: joiReusables.failAction,
};

joiReusables.user = {
  schema: {
    uuid: Joi.string().uuid().required(),
    username: Joi.string().required(),
  },
  failAction: joiReusables.failAction,
};
