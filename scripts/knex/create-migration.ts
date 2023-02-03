'use strict';

import * as db from '../../src/db';

const name = process.argv[1];
const cmdArgs = process.argv.slice(2);
const migrationName = cmdArgs[0];

const knex = db.getClient();

const USAGE = `
USAGE:
	${name} <MIGRATION NAME>
EXAMPLE:
	${name} user-schema-create
`;

if (typeof migrationName !== 'string') {
  throw new Error(USAGE);
}

console.log('Creating new migration', migrationName);

knex.migrate.make(migrationName).then(() => {
  return knex.destroy();
});
