import { PartialType } from '@nestjs/mapped-types';
import { CreateAddonDto } from './create-addon.dto';

export class UpdateAddonDto extends PartialType(CreateAddonDto) {}
