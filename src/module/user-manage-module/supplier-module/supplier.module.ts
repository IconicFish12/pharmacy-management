import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service.js';
import { SupplierController } from './supplier.controller.js';
import { DatabaseModule } from '../../../database/database.module.js';
import { DatabaseService } from '../../../database/database.service.js';
import { RolesGuard } from '../../../common/guards/roles.guard.js';

@Module({
  imports: [DatabaseModule],
  controllers: [SupplierController],
  providers: [SupplierService, DatabaseService, RolesGuard],
  exports: [SupplierService],
})
export class SupplierModule {}
