import type { Knex } from "knex";
import type { Model, UniqueViolationError, NotNullViolationError} from "objection";
import { _knownSchemas } from ".";
import BaseModel from "./base-model";

type KnownSchemas = typeof _knownSchemas;

export interface Models extends KnownSchemas {
  schemas: KnownSchemas;
  Model: typeof BaseModel;
  fn: typeof Model.fn;
  raw: typeof Model.raw;
  ref: typeof Model.ref;

  UniqueViolationError: typeof UniqueViolationError;
  NotNullViolationError: typeof NotNullViolationError;

  _getDb: () => Knex<any, any>;
  destroy: () => Promise<void>;
}
export type ModelPath = 'user' | 'order' | 'product' | 'department' | 'material';
