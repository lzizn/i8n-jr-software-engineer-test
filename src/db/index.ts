import knex, { Knex } from 'knex';

import path from 'path';

let _knex: Knex | null = null;

const dbConnectionSettings = {
  host: process.env.DB_CONNECTION_HOST,
  port: Number(process.env.DB_CONNECTION_PORT),
  user: process.env.DB_CONNECTION_USERNAME,
  database: process.env.DB_CONNECTION_DATABASE,
  password: process.env.DB_CONNECTION_PASSWORD,

  debug: Boolean(process.env.KNEX_DEBUG),
};

const getClient = () => {
  const acquireTimeoutMs = 1 * 25 * 1000;

  if (!_knex) {
    _knex = knex({
      client: 'pg',
      connection: dbConnectionSettings,
      searchPath: ['knex', 'public'],
      migrations: {
        // schemaName: 'sys',
        tableName: '_migrations_',
        directory: ['2023-02'].map((dn) =>
          path.join('src', 'db', 'migrations', dn),
        ),
        extension: 'knex.js',
        sortDirsSeparately: true,

        stub: path.join('src', 'db', 'knex.migration.stub'),
      },

      acquireConnectionTimeout: acquireTimeoutMs,

      debug: Boolean(process.env.KNEX_DEBUG),
    });
  }

  return _knex;
};

const destroyClient = () => {
  if (_knex) {
    _knex.destroy();
  }
};

export { getClient, destroyClient };
