import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

const app = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
app.options('*', cors());

app.use('/', (_req, res) => {
  res.send('Hello world');
});

app.listen('3000', () => {
  console.log('Listening to port 3000');
});

module.exports = app;
