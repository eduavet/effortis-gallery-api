const Pack = require('../package.json');

module.exports = {
  documentationPath: '/',
  auth: false,
  cors: true,
  jsonEditor: true,
  schemes: ['http', 'https'],
  info: {
    title: 'API documentation',
    description: Pack.description,
    version: Pack.version,
  },
};
