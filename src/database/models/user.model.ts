import { BaseModel } from './base.model';

export class UserModel extends BaseModel {
  static tableName = 'users';

  email: string;
  password: string;
}
