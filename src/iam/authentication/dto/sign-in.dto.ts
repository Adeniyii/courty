import { IsEmail, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail()
  readonly email: string;

  @MinLength(8)
  readonly password: string;
}
