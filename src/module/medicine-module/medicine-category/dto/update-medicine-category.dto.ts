import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicineCategoryDto } from './create-medicine-category.dto';

export class UpdateMedicineCategoryDto extends PartialType(
  CreateMedicineCategoryDto,
  { skipNullProperties: false },
) {}
