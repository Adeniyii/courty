import { IsString, Length } from 'class-validator';

export class CreateAddonCategoryDto {
  @IsString()
  @Length(2, 20)
  readonly name: string;
}
