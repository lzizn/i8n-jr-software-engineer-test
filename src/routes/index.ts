import express from 'express';
import { initializeModels } from '../models';
import productRoutes from './products';

const routes = express.Router();

routes.use(async (req, _res, next) => {
  const models = initializeModels();

  req.models = models;

  next();
});

routes.use(productRoutes);

export default routes;
