import express, { NextFunction, Request, Response } from 'express';
import { BaseError } from '../error';

interface RoutesHandler {
  [fnName: string]: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<unknown> | void;
}

const productRoutesHandler: RoutesHandler = {
  getAll: async (req, res) => {
    const { models } = req;

    const products = await models?.product.Product.query()
      .withGraphJoined('department')
      .withGraphJoined('material');

    res.json(products);
  },

  search: async (req, res) => {
    const { models } = req;

    const { pattern: searchPattern } = req.params;

    const _searchPattern = String(searchPattern);

    if (!_searchPattern) {
      throw new BaseError(400, 'search param is required');
    }

    // TODO: better validation on this.. 'null', 'undefined', '[]', '{}', sql-statements...
    if (typeof _searchPattern !== 'string') {
      throw new BaseError(400, 'search param needs to be string');
    }

    // TODO: fix this by overriding objection-js TYPES
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const productsQuery = models.product.Product.query().where(
      'name',
      'ilike',
      `%${_searchPattern}%`,
    );

    const products = await productsQuery;

    res.json(products);
  },
};

const productRoutes = express.Router();

productRoutes.use('/products', (req, res, next) =>
  productRoutesHandler.getAll(req, res, next),
);

productRoutes.use('/products/search/:pattern', (req, res, next) =>
  productRoutesHandler.search(req, res, next),
);
export default productRoutes;
