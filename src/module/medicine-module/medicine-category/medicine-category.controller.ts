import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MedicineCategoryService } from './medicine-category.service.js';
import { CreateMedicineCategoryDto } from './dto/create-medicine-category.dto.js';
import { UpdateMedicineCategoryDto } from './dto/update-medicine-category.dto.js';

@Controller('medicine-category')
export class MedicineCategoryController {
  constructor(
    private readonly medicineCategoryService: MedicineCategoryService,
  ) {}

  @Post()
  create(@Body() createMedicineCategoryDto: CreateMedicineCategoryDto) {
    return this.medicineCategoryService.create(createMedicineCategoryDto);
  }

  @Get()
  findAll() {
    return this.medicineCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicineCategoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMedicineCategoryDto: UpdateMedicineCategoryDto,
  ) {
    return this.medicineCategoryService.update(id, updateMedicineCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicineCategoryService.remove(id);
  }
}
