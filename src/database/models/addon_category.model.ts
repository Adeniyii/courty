import { BaseModel } from './base.model';

export class AddonCategoryModel extends BaseModel {
  static tableName = 'addon_categories';

  name: string;
  brandId: number;

  static jsonSchema = {
    type: 'object',
    required: ['name', 'brandId'],

    properties: {
      name: { type: 'string', minLength: 2, maxLength: 255 },
      brandId: { type: 'number' },
    },
  };
}
