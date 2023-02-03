'use strict';

import * as db from '../../src/db';

const knex = db.getClient();

console.log('Upgrading migrations');

knex.migrate.up().then(() => {
  return knex.destroy();
});
