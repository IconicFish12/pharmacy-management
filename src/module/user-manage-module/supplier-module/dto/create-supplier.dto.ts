import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MinLength,
  IsEmail,
  MaxLength,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ActiveStatus } from '../../../../database/generated/prisma/enums.js';

export class CreateSupplierDto {
  @IsNotEmpty({
    message: 'Supplier company name is required',
  })
  readonly companyName!: string;

  @IsNotEmpty({
    message: 'Phone Number is required',
  })
  @IsPhoneNumber('ID', {
    message: 'Phone Number must be an valid indonesia phone number',
  })
  readonly phoneNumber!: string;

  @IsNotEmpty({
    message: 'Supplier contact name is required',
  })
  readonly contactName!: string;

  @IsNotEmpty()
  @IsEmail(
    {
      allow_utf8_local_part: true,
      allow_display_name: true,
      allow_underscores: true,
      domain_specific_validation: true,
    },
    {
      message: 'Supplier email must be an valid email',
    },
  )
  readonly supplierEmail!: string;

  @IsNotEmpty({
    message: 'Active Status is Required',
  })
  @IsEnum(ActiveStatus, {
    message: 'Active Status is not valid choose between ACTIVE and INACTIVE',
  })
  readonly status!: ActiveStatus;

  @IsNotEmpty({
    message: 'Address is Required',
  })
  @MinLength(7, {
    message: 'Address is must lesser than 7 Character',
  })
  readonly address!: string;

  @IsNotEmpty({
    message: 'Supplier License number is required',
  })
  //@Max(10, {
  //  message: 'Suplier License Number is must greater than 7 Character',
  //})
  @Type(() => Number)
  //@IsNumber()
  readonly licenseNumber!: number;
}
