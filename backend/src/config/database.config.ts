import { knex, Knex } from 'knex';
import { Model } from 'objection';
import dotenv from 'dotenv';

dotenv.config();

const knexConfig: Knex.Config = {
  client: process.env.DB_CLIENT || 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'transport_system',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    ssl: true,
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
};

const db = knex(knexConfig);

Model.knex(db);

export { db, knexConfig };
