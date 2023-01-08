import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { BrandModel } from 'src/database/models/brand.model';
import { AddonsService } from './addons/addons.service';
import { CreateAddonDto } from './addons/dto/create-addon.dto';
import { UpdateAddonDto } from './addons/dto/update-addon.dto';
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
    return this.modelClass.query().withGraphFetched({
      addons: true,
      addon_categories: true
    });
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

  async createAddon(brandId: number, createAddonDto: CreateAddonDto) {
    const addonCategory = await this.addonCategoryService.findByBrandIdAndName(brandId, createAddonDto.category);
    console.log('addonCategory', addonCategory);

    // If the addon category doesn't exist, create it
    if (!addonCategory) {
      await this.addonCategoryService.create(brandId, { name: createAddonDto.category });
    }
    return this.addonService.create(createAddonDto, brandId);
  }

  findAddons(brandId: number) {
    return this.addonService.findAll(brandId);
  }

  findOneAddon(addonId: number, brandId: number) {
    return this.addonService.findOne(addonId, brandId);
  }

  async updateAddon(
    addonId: number,
    brandId: number,
    updateAddonDto: UpdateAddonDto,
  ) {
    if (updateAddonDto.name) {
      const addonCategory = await this.addonCategoryService.findByBrandIdAndName(brandId, updateAddonDto.category);

      // If the addon category doesn't exist, create it
      if (!addonCategory) {
        this.addonCategoryService.create(brandId, { name: updateAddonDto.category });
      }
    }
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
