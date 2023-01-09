import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ModelClass, NotFoundError, UniqueViolationError } from 'objection';
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

  /**
   * Create a brand and return the created brand
   */
  async create(createBrandDto: CreateBrandDto) {
    try {
      return await this.modelClass.query().insertAndFetch(createBrandDto);
    } catch (err) {
      if (err instanceof UniqueViolationError) {
        throw new ConflictException('Brand name is taken');
      }
      throw err;
    }
  }

  /**
   * Find all brands with their addons and addon categories
   */
  async findAll() {
    try {
      return await this.modelClass.query().throwIfNotFound().withGraphFetched({
        addons: true,
        addon_categories: true,
      });
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new NotFoundException('No brands found');
      }
      throw err;
    }
  }

  /**
   * Find a brand by brandId
   */
  async findOne(brandId: number) {
    try {
      return await this.modelClass.query().findById(brandId).throwIfNotFound();
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new NotFoundException('No brands found');
      }
      throw err;
    }
  }

  /**
   * Update a brand by brandId
   */
  async update(brandId: number, updateBrandDto: UpdateBrandDto) {
    try {
      return await this.modelClass
        .query()
        .patchAndFetchById(brandId, updateBrandDto)
        .throwIfNotFound();
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new NotFoundException('No brand found');
      }
      throw err;
    }
  }

  /**
   * Remove a brand by brandId
   */
  async remove(brandId: number) {
    try {
      return await this.modelClass.query().deleteById(brandId);
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new NotFoundException('No brand found');
      }
      throw err;
    }
  }

  /**
   * Create an addon for a brand by brandId.
   * If the addon category doesn't exist, throw an error.
   */
  async createAddon(brandId: number, createAddonDto: CreateAddonDto) {
    const addonCategory = await this.addonCategoryService.findByBrandIdAndName(
      brandId,
      createAddonDto.category,
    );

    // If the addon category doesn't exist, throw an error
    if (!addonCategory) {
      throw new NotFoundException('Addon category not found');
    }

    return await this.addonService.create(createAddonDto, brandId);
  }

  /**
   * Find all addons for a brand by brandId
   */
  async findAddons(brandId: number) {
    return await this.addonService.findAll(brandId);
  }

  /**
   * Find an addon for a brand by addonId and brandId
   */
  async findOneAddon(addonId: number, brandId: number) {
    return await this.addonService.findOne(addonId, brandId);
  }

  /**
   * Update an addon for a brand by addonId and brandId
   */
  async updateAddon(
    addonId: number,
    brandId: number,
    updateAddonDto: UpdateAddonDto,
  ) {
    if (updateAddonDto.category) {
      const addonCategory =
        await this.addonCategoryService.findByBrandIdAndName(
          brandId,
          updateAddonDto.category,
        );

      // If the addon category doesn't exist, throw an error
      if (!addonCategory) {
        throw new NotFoundException('Addon category not found');
      }
    }
    return await this.addonService.update(addonId, brandId, updateAddonDto);
  }

  /**
   * Remove an addon from a brand by addonId and brandId
   */
  async removeAddon(addonId: number, brandId: number) {
    return await this.addonService.remove(addonId, brandId);
  }

  /**
   * Create an addon category for a brand by brandId
   */
  async createAddonCategory(
    brandId: number,
    createAddonCategoryDto: CreateAddonCategoryDto,
  ) {
    return await this.addonCategoryService.create(
      brandId,
      createAddonCategoryDto,
    );
  }
}
