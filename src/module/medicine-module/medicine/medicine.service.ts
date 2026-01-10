import { Injectable } from '@nestjs/common';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';

@Injectable()
export class MedicineService {
  create(createMedicineDto: CreateMedicineDto) {
    return 'This action adds a new medicine';
  }

  findAll() {
    return `This action returns all medicine`;
  }

  findOne(id: string) {
    return `This action returns a #${id} medicine`;
  }

  update(id: string, updateMedicineDto: UpdateMedicineDto) {
    return `This action updates a #${id} medicine`;
  }

  remove(id: string) {
    return `This action removes a #${id} medicine`;
  }
}
