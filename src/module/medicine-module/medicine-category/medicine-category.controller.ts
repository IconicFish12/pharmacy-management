import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MedicineCategoryService } from './medicine-category.service.js';
import { CreateMedicineCategoryDto } from './dto/create-medicine-category.dto.js';
import { UpdateMedicineCategoryDto } from './dto/update-medicine-category.dto.js';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../../common/guards/roles.decorator.js';
import { RolesGuard } from '../../../common/guards/roles.guard.js';
import { Role } from '../../../database/generated/prisma/enums.js';

@Controller()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class MedicineCategoryController {
  constructor(
    private readonly medicineCategoryService: MedicineCategoryService,
  ) {}

  @Post()
  @Roles(Role.PHARMACIST, Role.ADMIN)
  create(@Body() createMedicineCategoryDto: CreateMedicineCategoryDto) {
    return this.medicineCategoryService.create(createMedicineCategoryDto);
  }

  @Get()
  @Roles(Role.PHARMACIST, Role.ADMIN, Role.OWNER)
  findAll(@Query('page') page?: number, @Query('perPage') perPage?: number) {
    return this.medicineCategoryService.findAll(page!, perPage!);
  }

  @Get(':id')
  @Roles(Role.PHARMACIST, Role.ADMIN, Role.OWNER)
  findOne(@Param('id') id: string) {
    return this.medicineCategoryService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.PHARMACIST, Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateMedicineCategoryDto: UpdateMedicineCategoryDto,
  ) {
    return this.medicineCategoryService.update(id, updateMedicineCategoryDto);
  }

  @Delete(':id')
  @Roles(Role.PHARMACIST, Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.medicineCategoryService.remove(id);
  }
}
