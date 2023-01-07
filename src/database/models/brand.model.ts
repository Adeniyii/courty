import { Model } from 'objection';
import { AddonModel } from './addon.model';
import { AddonCategoryModel } from './addon_category.model';
import { BaseModel } from './base.model';

export class BrandModel extends BaseModel {
  static tableName = 'brands';

  name: string;
  addons?: AddonModel[];
  addon_categories?: AddonCategoryModel[];

  static jsonSchema = {
    type: 'object',
    required: ['name'],

    properties: {
      name: { type: 'string', minLength: 2, maxLength: 255 },
    },
  };

  static relationMappings = {
    addons: {
      relation: Model.HasManyRelation,
      modelClass: `${__dirname}/addon.model`,
      join: {
        from: 'brands.id',
        to: 'addons.brandId',
      },
    },
    addon_categories: {
      relation: Model.HasManyRelation,
      modelClass: `${__dirname}/addon_category.model`,
      join: {
        from: 'brands.id',
        to: 'addon_categories.brandId',
      },
    },
  };
}
