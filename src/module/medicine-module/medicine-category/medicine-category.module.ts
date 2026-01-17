import { Module } from '@nestjs/common';
import { MedicineCategoryService } from './medicine-category.service.js';
import { MedicineCategoryController } from './medicine-category.controller.js';
import { DatabaseService } from '../../../common/database/database.service.js';

@Module({
  controllers: [MedicineCategoryController],
  providers: [MedicineCategoryService, DatabaseService],
})
export class MedicineCategoryModule {}
