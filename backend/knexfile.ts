import type { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: process.env.DB_CLIENT || 'pg',
    connection: {
      host: process.env.DB_HOST || 'ep-quiet-hat-26341948.eu-central-1.aws.neon.tech',
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'balance',
      user: process.env.DB_USER || 'Evcat6',
      password: process.env.DB_PASSWORD || '8DZ4dbHtkLyl',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/config/migrations',
    },
    seeds: {
      directory: './src/config/seeds',
    },
  },

  production: {
    client: process.env.DB_CLIENT || 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/config/migrations',
    },
  },
};

export default config;
