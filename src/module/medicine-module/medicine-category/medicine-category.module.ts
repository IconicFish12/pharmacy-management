import { Module } from '@nestjs/common';
import { MedicineCategoryService } from './medicine-category.service.js';
import { MedicineCategoryController } from './medicine-category.controller.js';

@Module({
  controllers: [MedicineCategoryController],
  providers: [MedicineCategoryService],
})
export class MedicineCategoryModule {}
