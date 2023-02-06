import { BaseModel } from './base-model';

class User extends BaseModel {
  static get tableName() {
    return 'user';
  }
}

export { User };
