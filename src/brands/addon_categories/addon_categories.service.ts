import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { AddonCategoryModel } from 'src/database/models/addon_category.model';
import { CreateAddonCategoryDto } from './dto/create-addon_category.dto';

@Injectable()
export class AddonCategoriesService {
  constructor(
    @Inject('AddonCategoryModel')
    private readonly modelClass: ModelClass<AddonCategoryModel>,
  ) {}

  create(brandId: number, createAddonCategoriesDto: CreateAddonCategoryDto) {
    const payload = { ...createAddonCategoriesDto, brandId };
    return this.modelClass.query().insert(payload).returning('*');
  }
}
