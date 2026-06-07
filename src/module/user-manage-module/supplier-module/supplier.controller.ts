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
import { SupplierService } from './supplier.service.js';
import { CreateSupplierDto } from './dto/create-supplier.dto.js';
import { UpdateSupplierDto } from './dto/update-supplier.dto.js';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../common/guards/roles.guard.js';
import { Roles } from '../../../common/guards/roles.decorator.js';
import { Role } from '../../../database/generated/prisma/enums.js';

@Controller()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  @Roles(Role.PHARMACIST, Role.OWNER)
  create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.supplierService.create(createSupplierDto);
  }

  @Get()
  @Roles(Role.OWNER)
  findAll(@Query('page') page?: number, @Query('perPage') perPage?: number) {
    return this.supplierService.findAll(page!, perPage!);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supplierService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.PHARMACIST, Role.OWNER)
  update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    return this.supplierService.update(id, updateSupplierDto);
  }

  @Delete(':id')
  @Roles(Role.PHARMACIST, Role.OWNER)
  remove(@Param('id') id: string) {
    return this.supplierService.remove(id);
  }
}
