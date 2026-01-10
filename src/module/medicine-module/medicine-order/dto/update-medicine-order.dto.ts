import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicineOrderDto } from './create-medicine-order.dto';

export class UpdateMedicineOrderDto extends PartialType(CreateMedicineOrderDto) {}
