import { Injectable } from '@nestjs/common';
import { CreateMedicineCategoryDto } from './dto/create-medicine-category.dto.js';
import { UpdateMedicineCategoryDto } from './dto/update-medicine-category.dto.js';

@Injectable()
export class MedicineCategoryService {
  create(createMedicineCategoryDto: CreateMedicineCategoryDto) {
    return 'This action adds a new medicineCategory';
  }

  findAll() {
    return `This action returns all medicineCategory`;
  }

  findOne(id: string) {
    return `This action returns a #${id} medicineCategory`;
  }

  update(id: string, updateMedicineCategoryDto: UpdateMedicineCategoryDto) {
    return `This action updates a #${id} medicineCategory`;
  }

  remove(id: string) {
    return `This action removes a #${id} medicineCategory`;
  }
}
