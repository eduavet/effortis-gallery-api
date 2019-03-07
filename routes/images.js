const Joi = require('joi');

const Images = require('../handlers/images');
const joiReusables = require('../utils/joiReusables');

const routes = [];

routes.push({
  method: 'POST',
  path: '/images/add',
  config: {
    auth: false,
    validate: {
      payload: {
        title: Joi.string().required(),
        location: Joi.string().required(),
        file: Joi.any().meta({ swaggerType: 'file' }),
        owner: Joi.string().uuid().required(),
      },
      failAction: joiReusables.failAction,
    },
    handler: Images.add,
    description: 'Add image',
    notes: 'Upload a new image.',
    tags: ['api', 'images'],
  },
});

routes.push({
  method: 'GET',
  path: '/images/get',
  config: {
    auth: false,
    validate: {
      query: {
        owner: Joi.string().uuid().required(),
      },
      failAction: joiReusables.failAction,
    },
    handler: Images.get,
    description: 'Get images',
    notes: 'Get all images of the logged in user',
    tags: ['api', 'images'],
  },
});

routes.push({
  method: 'PUT',
  path: '/images/update',
  config: {
    auth: false,
    validate: {
      payload: {
        uuid: Joi.string().uuid().required(),
        title: Joi.string().required(),
        location: Joi.string().required(),
        owner: Joi.string().uuid().required(),
      },
      failAction: joiReusables.failAction,
    },
    handler: Images.update,
    description: 'Update image',
    notes: 'Update image title and location',
    tags: ['api', 'images'],
  },
});

routes.push({
  method: 'DELETE',
  path: '/images/delete',
  config: {
    auth: false,
    validate: {
      payload: {
        uuid: Joi.string().uuid().required(),
        owner: Joi.string().uuid().required(),
      },
      failAction: joiReusables.failAction,
    },
    handler: Images.delete,
    description: 'Delete image',
    notes: 'Delete image',
    tags: ['api', 'images'],
  },
});

module.exports = routes;
