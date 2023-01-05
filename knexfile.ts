import type { Knex } from 'knex';
import { knexSnakeCaseMappers } from 'objection';

// Update with your config settings.
module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: './src/database/migrations',
    stub: './src/database/migration.stub',
  },
  seeds: {
    directory: './src/database/seeds',
    stub: './src/database/seed.stub',
  },
  ...knexSnakeCaseMappers(),
} as Knex.Config;
