import { IsEmail, MinLength } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  readonly email: string;

  @MinLength(8)
  readonly password: string;
}
