import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ModelClass, NotFoundError, UniqueViolationError } from 'objection';
import { AddonCategoryModel } from 'src/database/models/addon_category.model';
import { CreateAddonCategoryDto } from './dto/create-addon_category.dto';

@Injectable()
export class AddonCategoriesService {
  constructor(
    @Inject('AddonCategoryModel')
    private readonly modelClass: ModelClass<AddonCategoryModel>,
  ) {}

  /**
   * Create an addon-category and return the created addon-category
   */
  async create(
    brandId: number,
    createAddonCategoriesDto: CreateAddonCategoryDto,
  ) {
    const payload = { ...createAddonCategoriesDto, brandId };
    try {
      return await this.modelClass.query().insertAndFetch(payload);
    } catch (err) {
      if (err instanceof UniqueViolationError) {
        throw new ConflictException(
          'Brand has an addon-category with the same name',
        );
      }
      throw err;
    }
  }

  /**
   * Find all addon-categories for a brand by brandId
   */
  async findAll(brandId: number) {
    try {
      return await this.modelClass.query().where({ brandId });
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new NotFoundException('Addon-categories not found for this brand');
      }
      throw err;
    }
  }

  /**
   * Find an addon-category by addon-category name and brandId
   */
  async findByBrandIdAndName(brandId: number, name: string) {
    try {
      return await this.modelClass
        .query()
        .where({ brandId, name })
        .throwIfNotFound()
        .first();
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new NotFoundException('Addon-category not found for this brand');
      }
      throw err;
    }
  }
}
