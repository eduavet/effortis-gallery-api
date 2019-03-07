require('dotenv').config();
const Hapi = require('hapi');
const HapiAuthCookie = require('hapi-auth-cookie');
const HapiAuthBasic = require('hapi-auth-basic');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const Vision = require('vision');
const catboxRedis = require('catbox-redis');

const db = require('./db');
const routes = require('./routes');
const swaggerOptions = require('./utils/swaggerOptions');

const serverInit = async () => {
  const server = new Hapi.Server({
    port: process.env.PORT || 3000,
    routes: {
      cors: {
        credentials: true,
      },
    },
    // cache: [
    //   {
    //     name: 'redisCache',
    //     engine: catboxRedis,
    //     host: 'localhost',
    //     port: 6379,
    //     password: undefined,
    //     database: undefined,
    //     partition: 'cache',
    //   },
    // ],
  });

  const cache = server.cache({
    // cache: 'redisCache',
    segment: 'sessions',
    expiresIn: 3 * 24 * 60 * 60 * 1000, // 3 days
  });
  server.app.cache = cache;

  await server.register([
    Inert,
    Vision,
    HapiAuthCookie,
    HapiAuthBasic,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  server.auth.strategy('session', 'cookie', {
    password: db.config.session.secret,
    cookie: 'session',
    redirectTo: false,
    isSecure: false,
    validateFunc: async (request, session) => {
      const cached = await cache.get(session.sid);
      const out = {
        valid: !!cached,
      };

      if (out.valid) {
        out.credentials = cached.account;
      }

      return out;
    },
  });

  server.auth.default('session');

  server.route(routes);
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

serverInit();
