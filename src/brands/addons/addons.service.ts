import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ModelClass, NotFoundError, UniqueViolationError } from 'objection';
import { AddonModel } from 'src/database/models/addon.model';
import { CreateAddonDto } from './dto/create-addon.dto';
import { UpdateAddonDto } from './dto/update-addon.dto';

@Injectable()
export class AddonsService {
  constructor(
    @Inject('AddonModel') private readonly modelClass: ModelClass<AddonModel>,
  ) {}

  /**
   * Create an addon and return the created addon
   */
  async create(createAddonDto: CreateAddonDto, brandId: number) {
    try {
      const payload = { ...createAddonDto, brandId };
      return await this.modelClass.query().insertAndFetch(payload);
    } catch (err) {
      if (err instanceof UniqueViolationError) {
        throw new ConflictException('Brand has an addon with the same name');
      }
      throw err;
    }
  }

  /**
   * Find all addons for a brand by brandId
   */
  async findAll(brandId: number) {
    try {
      return await this.modelClass.query().where({ brandId }).throwIfNotFound();
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new NotFoundException('No addons found for this brand');
      }
      throw err;
    }
  }

  /**
   * Find an addon by addonId and brandId
   */
  async findOne(addonId: number, brandId: number) {
    try {
      return await this.modelClass
        .query()
        .where({ id: addonId, brandId })
        .throwIfNotFound()
        .first();
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new NotFoundException('No addon found for this brand');
      }
      throw err;
    }
  }

  /**
   * Update an addon by addonId and brandId. Returns the updated addon
   */
  async update(
    addonId: number,
    brandId: number,
    updateAddonDto: UpdateAddonDto,
  ) {
    try {
      return await this.modelClass
        .query()
        .patchAndFetchById(addonId, {
          ...updateAddonDto,
          brandId,
        })
        .throwIfNotFound();
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new NotFoundException('No addon found for this brand');
      }
      throw err;
    }
  }

  /**
   * Delete an addon by addonId and brandId
   */
  async remove(addonId: number, brandId: number) {
    try {
      return await this.modelClass
        .query()
        .delete()
        .where({ id: addonId, brandId })
        .throwIfNotFound();
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new NotFoundException('No addon found for this brand');
      }
      throw err;
    }
  }
}
