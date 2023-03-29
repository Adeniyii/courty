export enum Role {
  Admin = 'admin',
  Regular = 'regular',
}

export class CreateUserDto {
  email: string;
  password: string;
  role?: Role;
}
