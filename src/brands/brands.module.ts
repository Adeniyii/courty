import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { AddonsService } from './addons/addons.service';
import { AddonCategoriesService } from './addon_categories/addon_categories.service';

@Module({
  controllers: [BrandsController],
  providers: [BrandsService, AddonsService, AddonCategoriesService],
})
export class BrandsModule {}
