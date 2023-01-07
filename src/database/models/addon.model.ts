import { BaseModel } from './base.model';

export class AddonModel extends BaseModel {
  static tableName = 'addons';

  name: string;
  description?: string;
  price: number;
  category?: string;
  brandId: number;

  static jsonSchema = {
    type: 'object',
    required: ['name', 'price', 'brandId'],

    properties: {
      name: { type: 'string', minLength: 2, maxLength: 255 },
      description: { type: 'string', minLength: 1, maxLength: 255 },
      price: { type: 'number', minimum: 0 },
      category: { type: 'string', minLength: 1, maxLength: 255 },
      brandId: { type: 'number' },
    },
  };
}
