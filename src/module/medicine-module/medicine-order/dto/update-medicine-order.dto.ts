import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicineOrderDto } from './create-medicine-order.dto.js';

export class UpdateMedicineOrderDto extends PartialType(
  CreateMedicineOrderDto,
  { skipNullProperties: false },
) {}
