import BaseModel from './base-model';

import { getModelLazily } from '.';

class Order extends BaseModel {
  static get tableName() {
    return 'order';
  }

  static get relationMappings() {
    return {
      product: {
        relation: BaseModel.HasOneRelation,
        modelClass: getModelLazily('product'),
        join: {
          from: 'order.productId',
          to: 'product.id',
        },
      },

      user: {
        relation: BaseModel.HasOneRelation,
        modelClass: getModelLazily('user'),
        join: {
          from: 'order.userId',
          to: 'user.id',
        },
      },
    };
  }
}

export { Order };
