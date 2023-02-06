import { BaseModel } from './base-model';

import { getModelLazily } from '.';

class Product extends BaseModel {
  static get tableName() {
    return 'product';
  }

  static get relationMappings() {
    return {
      department: {
        relation: BaseModel.HasOneRelation,
        modelClass: Department,
        join: {
          from: 'product.departmentId',
          to: 'department.id',
        },
      },

      material: {
        relation: BaseModel.HasOneRelation,
        modelClass: Material,
        join: {
          from: 'product.materialId',
          to: 'material.id',
        },
      },

      orders: {
        relation: BaseModel.HasManyRelation,
        modelClass: getModelLazily('order'),
        join: {
          from: 'product.id',
          to: 'order.productId',
        },
      },
    };
  }
}

class Material extends BaseModel {
  static get tableName() {
    return 'material';
  }
}

class Department extends BaseModel {
  id = '';
  name = '';

  static get tableName() {
    return 'department';
  }
}

export { Product, Material, Department };
