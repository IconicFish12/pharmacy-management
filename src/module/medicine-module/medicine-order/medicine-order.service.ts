import { Injectable } from '@nestjs/common';
import { CreateMedicineOrderDto } from './dto/create-medicine-order.dto.js';
import { UpdateMedicineOrderDto } from './dto/update-medicine-order.dto.js';

@Injectable()
export class MedicineOrderService {
  create(createMedicineOrderDto: CreateMedicineOrderDto) {
    return 'This action adds a new medicineOrder';
  }

  findAll() {
    return `This action returns all medicineOrder`;
  }

  findOne(id: string) {
    return `This action returns a #${id} medicineOrder`;
  }

  update(id: string, updateMedicineOrderDto: UpdateMedicineOrderDto) {
    return `This action updates a #${id} medicineOrder`;
  }

  remove(id: string) {
    return `This action removes a #${id} medicineOrder`;
  }
}
