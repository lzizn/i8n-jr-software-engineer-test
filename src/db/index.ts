import knex, { Knex } from 'knex';

import path from 'path';

let _knex: Knex | null = null;

const getClient = () => {
  const acquireTimeoutMs = 1 * 25 * 1000;

  if (!_knex) {
    _knex = knex({
      client: 'sqlite3',
      connection: {
        filename: path.join('src', 'db', 'db.sqlite'),
      },
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

      debug: false,
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
