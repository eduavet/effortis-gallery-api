const auth = require('./auth');
const images = require('./images');

const _routes = [auth, images];

const routes = [];
module.exports = routes;

_routes.forEach((_route) => {
  if (typeof _route === 'object' && _route.length) {
    _route.forEach((_r) => {
      routes.push(_r);
    });
  } else if (typeof _route === 'object') { routes.push(_route); }
});
