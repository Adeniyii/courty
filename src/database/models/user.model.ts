import { Role } from 'src/users/enums/role.enum';
import { BaseModel } from './base.model';

export class UserModel extends BaseModel {
  static tableName = 'users';

  email: string;
  password: string;
  role: Role;

  static jsonSchema = {
    type: 'object',
    required: ['email', 'password', 'role'],

    properties: {
      email: { type: 'string', minLength: 1, maxLength: 255 },
      password: { type: 'string', minLength: 8, maxLength: 255 },
      role: { type: 'string', enum: Object.values(Role) },
    },
  };
}
