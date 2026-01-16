import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MedicineOrderService } from './medicine-order.service.js';
import { CreateMedicineOrderDto } from './dto/create-medicine-order.dto.js';
import { UpdateMedicineOrderDto } from './dto/update-medicine-order.dto.js';

@Controller('medicine-order')
export class MedicineOrderController {
  constructor(private readonly medicineOrderService: MedicineOrderService) {}

  @Post()
  create(@Body() createMedicineOrderDto: CreateMedicineOrderDto) {
    return this.medicineOrderService.create(createMedicineOrderDto);
  }

  @Get()
  findAll() {
    return this.medicineOrderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicineOrderService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMedicineOrderDto: UpdateMedicineOrderDto,
  ) {
    return this.medicineOrderService.update(id, updateMedicineOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicineOrderService.remove(id);
  }
}
