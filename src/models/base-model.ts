import { Model, ModelOptions, QueryContext, raw } from 'objection';
import { v4 as uuidv4 } from 'uuid';

class BaseModel extends Model {
  updatedAt: Date | string | null | undefined;

  $beforeInsert(queryContext: QueryContext) {
    const maybePromise = super.$beforeInsert(queryContext);

    return Promise.resolve(maybePromise).then(() => {
      if (!this.$id()) {
        this.$id(uuidv4());
      }
    });
  }

  $beforeUpdate(opt: ModelOptions, queryContext: QueryContext) {
    const maybePromise = super.$beforeUpdate(opt, queryContext);

    return Promise.resolve(maybePromise).then(() => {
      if (!this.updatedAt) {
        this.updatedAt = new Date().toISOString();
      }
    });
  }

  static get raw() {
    return raw;
  }
}

export { BaseModel };
export default BaseModel;
