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
import { MedicineService } from './medicine.service.js';
import { CreateMedicineDto } from './dto/create-medicine.dto.js';
import { UpdateMedicineDto } from './dto//update-medicine.dto.js';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../../common/guards/roles.decorator.js';
import { RolesGuard } from '../../../common/guards/roles.guard.js';
import { Role } from '../../../database/generated/prisma/enums.js'

@Controller()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

  @Post()
  @Roles(Role.PHARMACIST)
  create(@Body() createMedicineDto: CreateMedicineDto) {
    return this.medicineService.create(createMedicineDto);
  }

  @Get()
  @Roles(Role.PHARMACIST, Role.ADMIN, Role.OWNER)
  findAll(@Query('page') page?: number, @Query('perPage') perPage?: number) {
    return this.medicineService.findAll(page!, perPage!);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicineService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.PHARMACIST)
  update(
    @Param('id') id: string,
    @Body() updateMedicineDto: UpdateMedicineDto,
  ) {
    return this.medicineService.update(id, updateMedicineDto);
  }

  @Delete(':id')
  @Roles(Role.PHARMACIST)
  remove(@Param('id') id: string) {
    return this.medicineService.remove(id);
  }
}
