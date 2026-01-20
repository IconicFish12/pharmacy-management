import { IsDate, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import {
  ActiveStatus,
  Role,
  Shift,
} from '../../../common/database/generated/prisma/enums.js';

export class CreateUserDto {
  @IsNotEmpty({
    message: '',
  })
  readonly name: string;

  @IsNotEmpty({
    message: '',
  })
  readonly empId: string;

  @IsNotEmpty({
    message: '',
  })
  readonly email: string;

  @IsNotEmpty({
    message: '',
  })
  readonly password: string;

  @IsNotEmpty({
    message: '',
  })
  @IsEnum(Role)
  readonly role: Role;

  @IsNotEmpty({
    message: '',
  })
  @IsEnum(Shift)
  readonly shift: Shift;

  @IsNotEmpty({
    message: '',
  })
  @IsEnum(ActiveStatus)
  readonly status: ActiveStatus;

  @IsOptional()
  @IsDate()
  readonly dateOfBirth: Date;

  @IsOptional()
  readonly address: string;

  @IsOptional()
  readonly profileAvatar: string;

  @IsNotEmpty({
    message: '',
  })
  readonly salary: number;

  @IsDate()
  readonly startDate: Date;
}
