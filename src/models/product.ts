import { Model } from 'objection';
import { getModelLazily } from '.';

class Product extends Model {
  static get tableName() {
    return 'product';
  }

  static get relationMappings() {
    return {
      department: {
        relation: Model.HasOneRelation,
        modelClass: Department,
        join: {
          from: 'product.departmentId',
          to: 'department.id',
        },
      },

      material: {
        relation: Model.HasOneRelation,
        modelClass: Material,
        join: {
          from: 'product.materialId',
          to: 'material.id',
        },
      },

      orders: {
        relation: Model.HasManyRelation,
        modelClass: getModelLazily('order'),
        join: {
          from: 'product.id',
          to: 'order.productId',
        },
      },
    };
  }
}

class Material extends Model {
  static get tableName() {
    return 'material';
  }
}

class Department extends Model {
  static get tableName() {
    return 'department';
  }
}

export { Product, Material, Department };
