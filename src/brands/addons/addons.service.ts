import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { AddonModel } from 'src/database/models/addon.model';
import { CreateAddonDto } from './dto/create-addon.dto';
import { UpdateAddonDto } from './dto/update-addon.dto';

@Injectable()
export class AddonsService {
  constructor(
    @Inject('AddonModel') private readonly modelClass: ModelClass<AddonModel>,
  ) {}

  create(createAddonDto: CreateAddonDto, brandId: number) {
    const payload = { ...createAddonDto, brandId };
    return this.modelClass.query().insert(payload).returning('*');
  }

  findAll(brandId: number) {
    return this.modelClass.query().where({ brandId });
  }

  findOne(addonId: number, brandId: number) {
    return this.modelClass.query().where({ id: addonId, brandId }).first();
  }

  update(addonId: number, brandId: number, updateAddonDto: UpdateAddonDto) {
    return this.modelClass
      .query()
      .patch(updateAddonDto)
      .where({ id: addonId, brandId })
      .returning('*')
      .first();
  }

  remove(addonId: number, brandId: number) {
    return this.modelClass.query().delete().where({ id: addonId, brandId });
  }
}
