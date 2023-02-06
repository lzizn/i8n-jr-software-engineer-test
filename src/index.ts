import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import http from 'http';

import config from './config';

import routes from './routes';
import { initializeModels } from './models';

import { seedDbHandler } from './seeds';

const app = express();
const server = http.createServer();
const seedFiles = process.argv.slice(2) || [];

// Required, to stop nodeJS inside of Docker env
process.on('SIGINT', async () => {
  await seedDbHandler(seedFiles, 'clean');

  server.close();
});
server.on('close', () => {
  // eslint-disable-next-line no-console
  console.info('Server Interrupted');
  throw new Error('Server Interrupted');
});

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
app.options('*', cors());

app.listen('4000', async () => {
  const models = initializeModels();
  const knex = models._getDb();
  await knex.migrate.up();

  if (config.NODE_ENV === 'dev') {
    await seedDbHandler(seedFiles, 'clean');
  }
  await seedDbHandler(seedFiles, 'seed');

  console.log('Listening to port 4000');
});

app.use(routes);

module.exports = app;
