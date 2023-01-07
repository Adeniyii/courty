import { Model } from 'objection';
import { AddonModel } from './addon.model';
import { BaseModel } from './base.model';

export class BrandModel extends BaseModel {
  static tableName = 'brands';

  name: string;
  addons?: AddonModel[];
  addon_categories?: string[];

  static jsonSchema = {
    type: 'object',
    required: ['name'],

    properties: {
      name: { type: 'string', minLength: 2, maxLength: 255 },
      addon_categories: { type: 'array', items: { type: 'string' } },
    },
  };

  static relationMappings = {
    addons: {
      relation: Model.HasManyRelation,
      modelClass: `${__dirname}/addon.model`,
      join: {
        from: 'brands.id',
        to: 'addon.brandId',
      },
    },
  };
}
