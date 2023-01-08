import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { BrandModel } from 'src/database/models/brand.model';
import { AddonsService } from './addons/addons.service';
import { CreateAddonDto } from './addons/dto/create-addon.dto';
import { AddonCategoriesService } from './addon_categories/addon_categories.service';
import { CreateAddonCategoryDto } from './addon_categories/dto/create-addon_category.dto';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(
    @Inject('BrandModel') private readonly modelClass: ModelClass<BrandModel>,
    private readonly addonService: AddonsService,
    private readonly addonCategoryService: AddonCategoriesService,
  ) {}

  create(createBrandDto: CreateBrandDto) {
    return this.modelClass.query().insert(createBrandDto).returning('*');
  }

  findAll() {
    return this.modelClass.query();
  }

  findOne(brandId: number) {
    return this.modelClass.query().findById(brandId);
  }

  update(brandId: number, updateBrandDto: UpdateBrandDto) {
    return this.modelClass
      .query()
      .patch(updateBrandDto)
      .where({ id: brandId })
      .returning('*')
      .first();
  }

  remove(brandId: number) {
    return this.modelClass.query().deleteById(brandId);
  }

  createAddon(brandId: number, createAddonDto: CreateAddonDto) {
    return this.addonService.create(createAddonDto, brandId);
  }

  findAddons(brandId: number) {
    return this.addonService.findAll(brandId);
  }

  findOneAddon(addonId: number, brandId: number) {
    return this.addonService.findOne(addonId, brandId);
  }

  updateAddon(
    addonId: number,
    brandId: number,
    updateAddonDto: UpdateBrandDto,
  ) {
    return this.addonService.update(addonId, brandId, updateAddonDto);
  }

  removeAddon(addonId: number, brandId: number) {
    return this.addonService.remove(addonId, brandId);
  }

  createAddonCategory(
    brandId: number,
    createAddonCategoryDto: CreateAddonCategoryDto,
  ) {
    return this.addonCategoryService.create(brandId, createAddonCategoryDto);
  }
}
