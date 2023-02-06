'use strict';

import {
  fn,
  raw,
  ref,
  UniqueViolationError,
  NotNullViolationError,
} from 'objection';

import path from 'path';

import * as db from '../db';

import BaseModel from './base-model';

import * as userSchema from './user';
import * as orderSchema from './order';
import * as productSchema from './product';

import type { ModelPath, Models } from './types';

export const _knownSchemas = {
  user: userSchema,
  order: orderSchema,
  product: productSchema,
};

function getModelLazily(schemaAndModelName: ModelPath) {
  const [schemaName, modelName] = schemaAndModelName.split('.');
  const schemaPath = path.resolve(path.join(__dirname, schemaName));

  return import(schemaPath).then(
    (schema) => schema[modelName],
  ) as unknown as keyof typeof _knownSchemas;
  // this function works and it is an old-known objection.js trick, but typescript is crying
}

function initializeModels(): Models {
  const knex = db.getClient();

  BaseModel.knex(knex);

  return {
    ..._knownSchemas,
    schemas: _knownSchemas,

    Model: BaseModel,

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
