import { SetMetadata } from '@nestjs/common';
import { AuthType } from '../enums/auth-types.enum';

export const AUTH_TYPE_KEY = 'authType';

export const Auth = (...authTypes: AuthType[]) =>
  SetMetadata(AUTH_TYPE_KEY, authTypes);
