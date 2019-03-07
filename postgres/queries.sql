CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  uuid uuid primary key default uuid_generate_v4(),
  username text unique,
  password text
);

CREATE TABLE images (
  uuid uuid primary key,
  owner uuid references users not null,
  title text not null,
  location text not null,
  date timestamp not null default date_trunc('second'::text, now()),
  is_active boolean not null
);
