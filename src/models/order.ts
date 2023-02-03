import { Model } from 'objection';
import { getModelLazily } from '.';

class Order extends Model {
  static get tableName() {
    return 'order';
  }

  static get relationMappings() {
    return {
      product: {
        relation: Model.HasOneRelation,
        modelClass: getModelLazily('product'),
        join: {
          from: 'order.productId',
          to: 'product.id',
        },
      },

      user: {
        relation: Model.HasOneRelation,
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
