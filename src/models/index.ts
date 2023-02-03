'use strict';

import {
  fn,
  raw,
  ref,
  Model,
  UniqueViolationError,
  NotNullViolationError,
} from 'objection';

import path from 'path';

import * as db from '../db';

import * as userSchema from './user';
import * as orderSchema from './order';
import * as productSchema from './product';

const _knownSchemas = {
  user: userSchema,
  order: orderSchema,
  product: productSchema,
};

type ModelPath = 'user' | 'order' | 'product' | 'department' | 'material';

function getModelLazily(schemaAndModelName: ModelPath) {
  const [schemaName, modelName] = schemaAndModelName.split('.');
  const schemaPath = path.resolve(path.join(__dirname, schemaName));

  return import(schemaPath).then(
    (schema) => schema[modelName],
  ) as unknown as keyof typeof _knownSchemas;
  // this function works and it is an old-known objection.js trick, but typescript is crying
}

function initializeModels() {
  const knex = db.getClient();

  Model.knex(knex);

  return {
    ..._knownSchemas,
    schemas: _knownSchemas,

    Model: Model,

    fn: fn,
    raw: raw,
    ref: ref,

    UniqueViolationError,
    NotNullViolationError,

    _getDb() {
      return knex;
    },

    destroy() {
      return knex.destroy();
    },
  };
}

export { getModelLazily, initializeModels };
