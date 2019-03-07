const Promise = require('promise');
const Pg = require('pg-promise');
const Redis = require('redis');

const { env } = process;

const config = {
  redis: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
  },
  postgres: {
    user: env.POSTGRES_USER,
    pass: env.POSTGRES_PASS,
    host: env.POSTGRES_HOST,
    db: env.POSTGRES_DB,
  },
  session: {
    secret: env.SESSION_SECRET,
  },
};

const db = { config };

db.pg = Pg({ promiseLib: Promise })(`postgres://${config.postgres.user}:${config.postgres.pass}@${config.postgres.host}/${config.postgres.db}`);

db.pub = Redis.createClient(config.redis.port, config.redis.host);
db.sub = Redis.createClient(config.redis.port, config.redis.host);

db.pub.setMaxListeners(0);
db.sub.setMaxListeners(0);

module.exports = db;
