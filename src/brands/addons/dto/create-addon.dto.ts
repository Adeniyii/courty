import { IsInt, IsOptional, IsString, Length } from 'class-validator';

export class CreateAddonDto {
  @IsString()
  @Length(2, 255)
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsInt()
  readonly price: number;

  @IsString()
  @Length(1, 255)
  @IsOptional()
  readonly category?: string;
}
