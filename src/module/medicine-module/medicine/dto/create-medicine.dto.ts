import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  MinDate,
} from 'class-validator';

export class CreateMedicineDto {
  @IsNotEmpty({
    message: 'medicine name is required',
  })
  readonly medicineName!: string;

  @IsNotEmpty({
    message: 'store keeping unit code is required',
  })
  readonly sku!: string;

  @IsOptional({
    message: 'Description field is optional',
  })
  readonly description!: string;

  @IsNotEmpty({
    message: 'medicine category is required',
  })
  @IsUUID('all')
  readonly categoryId!: string;

  @IsNotEmpty({
    message: 'medicine supplier is required',
  })
  @IsUUID('all')
  readonly supplierId!: string;

  @IsNotEmpty({
    message: 'medicine stock is required',
  })
  readonly stock!: number;

  @IsNotEmpty({
    message: 'medicine price is required',
  })
  @IsNumber()
  readonly price!: number;

  @IsNotEmpty({
    message: 'medicine expired date is required',
  })
  @IsDate()
  @Type(() => Date)
  @MinDate(new Date())
  readonly expiredDate!: Date;
}
