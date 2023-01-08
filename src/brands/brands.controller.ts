import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Roles } from 'src/iam/authorization/decorators/roles.decorator';
import { Role } from 'src/users/enums/role.enum';
import { CreateAddonDto } from './addons/dto/create-addon.dto';
import { UpdateAddonDto } from './addons/dto/update-addon.dto';
import { CreateAddonCategoryDto } from './addon_categories/dto/create-addon_category.dto';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Roles(Role.Admin)
  @Post()
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @Get()
  findAll() {
    return this.brandsService.findAll();
  }

  @Get(':brandId')
  findOne(@Param('brandId') brandId: string) {
    return this.brandsService.findOne(+brandId);
  }

  @Roles(Role.Admin)
  @Patch(':brandId')
  update(
    @Param('brandId') brandId: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    return this.brandsService.update(+brandId, updateBrandDto);
  }

  @Roles(Role.Admin)
  @Delete(':brandId')
  remove(@Param('brandId') brandId: string) {
    return this.brandsService.remove(+brandId);
  }

  @Roles(Role.Admin)
  @Post(':brandId/addons')
  createAddon(
    @Param('brandId') brandId: string,
    @Body() createAddonDto: CreateAddonDto,
  ) {
    return this.brandsService.createAddon(+brandId, createAddonDto);
  }

  @Roles(Role.Admin)
  @Get(':brandId/addons')
  findAddons(@Param('brandId') brandId: string) {
    return this.brandsService.findAddons(+brandId);
  }

  @Roles(Role.Admin)
  @Get(':brandId/addons/:addonId')
  findOneAddon(
    @Param('brandId') brandId: string,
    @Param('addonId') addonId: string,
  ) {
    return this.brandsService.findOneAddon(+addonId, +brandId);
  }

  @Roles(Role.Admin)
  @Patch(':brandId/addons/:addonId')
  updateAddon(
    @Param('brandId') brandId: string,
    @Param('addonId') addonId: string,
    @Body() updateAddonDto: UpdateAddonDto,
  ) {
    return this.brandsService.updateAddon(+addonId, +brandId, updateAddonDto);
  }

  @Roles(Role.Admin)
  @Delete(':brandId/addons/:addonId')
  removeAddon(
    @Param('brandId') brandId: string,
    @Param('addonId') addonId: string,
  ) {
    return this.brandsService.removeAddon(+addonId, +brandId);
  }

  @Roles(Role.Admin)
  @Post(':brandId/addon-categories')
  createAddonCategory(
    @Param('brandId') brandId: string,
    @Body() createAddonCategoryDto: CreateAddonCategoryDto,
  ) {
    return this.brandsService.createAddonCategory(
      +brandId,
      createAddonCategoryDto,
    );
  }
}
