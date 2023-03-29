import { IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  readonly tokenId: string;

  @IsNotEmpty()
  @MinLength(8)
  readonly newPassword: string;
}
