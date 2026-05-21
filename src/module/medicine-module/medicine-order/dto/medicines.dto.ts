import { IsNotEmpty, IsNumber, IsPositive, IsUUID, Min } from 'class-validator';

export class MedicinesDto {
  @IsNotEmpty({ message: 'medicine id is required' })
  @IsUUID('all')
  medicineId!: string;

  @IsNotEmpty({ message: 'quantity is required' })
  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity!: number;

  @IsNotEmpty({ message: 'unit price is required' })
  @IsNumber()
  @IsPositive()
  unitPrice!: number;
}
