import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicineDto } from './create-medicine.dto.js';

export class UpdateMedicineDto extends PartialType(CreateMedicineDto, {
  skipNullProperties: false,
}) {}
